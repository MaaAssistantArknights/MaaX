<script setup lang="ts">
import { computed } from 'vue'
import IconDisconnect from '@/assets/icons/disconnect.svg?component'
import DeviceDetailPopover from '@/components/Device/DeviceDetailPopover.vue'
import IconLink from '@/assets/icons/link.svg?component'
import {
  NButton,
  NTooltip,
  NIcon,
  NSpace,
  NPopconfirm,
  useThemeVars
} from 'naive-ui'

import useDeviceStore from '@/store/devices'
import router from '@/router'
import useTaskStore from '@/store/tasks'
import useSettingStore from '@/store/settings'
// import useTaskIdStore from '@/store/taskId'
import { showMessage } from '@/utils/message'

const props = defineProps<{
  device: Device;
}>()

const themeVars = useThemeVars()
const deviceStore = useDeviceStore()
const taskStore = useTaskStore()
const settingStore = useSettingStore()

const touchMode = computed(() => settingStore.touchMode)
// const taskIdStore = useTaskIdStore()

const deviceDisplayName = computed(
  () => props.device.displayName || props.device.address
)
const routeUuid = computed(
  () => router.currentRoute.value.params.uuid as string | undefined
)
const isCurrent = computed(() => routeUuid.value === props.device.uuid)

const connectedStatus: Set<DeviceStatus> = new Set(['connected', 'tasking'])
const disconnectedStatus: Set<DeviceStatus> = new Set([
  'available',
  'disconnected',
  'connecting',
  'unknown'
])

// function disconnectDevice (uuid: string) {}

// function connectDevice (uuid: string) {}

function handleJumpToTask() {
  // 未连接的设备也可以查看任务
  // 2023.4.19: 先不做支持了，这会导致一些ui上的问题，比如正在连接的消息框无法关闭
  //            理想方案是把正在连接的消息框变成全局唯一实例

  // FIXME: feature要! 框的bug再修

  // if (!connectedStatus.has(props.device.status)) {
  //   // TODO: 提示设备未连接
  //   return
  // }
  // 4.20完成了
  // 问题似乎是router在push之后并不会刷新对应的页面
  if (!taskStore.getCurrentTaskGroup(props.device.uuid)) {
    taskStore.initDeviceTask(props.device.uuid)
  }
  taskStore.fixTaskList(props.device.uuid)
  console.log(router.currentRoute.value.path.charAt(5), isCurrent.value)
  if (router.currentRoute.value.path.charAt(5) !== '2') {
    console.log('push task2')
    if (!isCurrent.value) router.push(`/task2/${props.device.uuid}`)
  } else {
    console.log('push task')
    if (!isCurrent.value) router.push(`/task/${props.device.uuid}`)
  }
}

function handleDeviceDisconnect() {
  // task stop
  window.ipcRenderer.send('main.CoreLoader:disconnectAndDestroy', { uuid: props.device.uuid })
  taskStore.stopAllTasks(props.device.uuid as string)
  deviceStore.updateDeviceStatus(props.device.uuid as string, 'disconnected')
  router.push('/device')
}

async function handleDeviceConnect() {
  if (!disconnectedStatus.has(props.device.status ?? 'unknown')) {
    return
  }
  if (!props.device.uuid) {
    showMessage('设备uuid不存在', {
      type: 'error',
      duration: 3000
    })
    return
  }

  // 无地址, 尝试唤醒模拟器
  if (!props.device.address || props.device.address.length === 0) {
    if (!await deviceStore.wakeUpDevice(props.device.uuid)) {
      return
    }
  }

  deviceStore.updateDeviceStatus(props.device.uuid as string, 'connecting')
  await window.ipcRenderer.invoke('main.CoreLoader:initCoreAsync', {
    address: props.device.address,
    uuid: props.device.uuid,
    adb_path: props.device.adbPath,
    config: props.device.config,
    touch_mode: touchMode.value
  } as InitCoreParam)
}
</script>

<template>
  <div
    v-if="device"
    class="device-card"
    :class="isCurrent ? 'current' : ''"
    :style="{
      backgroundColor: isCurrent ? themeVars.hoverColor : 'transparent',
    }"
  >
    <NButton
      class="device-info"
      text
      :focusable="false"
      @click="handleJumpToTask"
      @dblclick="handleDeviceConnect"
    >
      <NTooltip>
        <template #trigger>
          <div class="device-status" :data-status="device?.status" />
        </template>
        {{
          (() => {
            switch (device?.status) {
            case "available":
              return "点击右边按钮连接设备";
            case "connected":
              return "设备已连接";
            case "connecting":
              return "设备正在连接中...";
            case "disconnected":
              return "设备已断开连接";
            case "tasking":
              return "任务进行中...";
            default:
              return "设备状态未知";
            }
          })()
        }}
      </NTooltip>
      <DeviceDetailPopover :uuid="props.device.uuid">
        <div class="device-name">
          {{ deviceDisplayName }}
        </div>
      </DeviceDetailPopover>
    </NButton>
    <NSpace :align="'center'">
      <NPopconfirm
        v-if="connectedStatus.has(device?.status ?? 'unknown')"
        positive-text="确定"
        negative-text="取消"
        @positive-click="handleDeviceDisconnect"
      >
        <template #trigger>
          <NButton
            class="operation"
            text
            :focusable="false"
            style="font-size: 24px"
          >
            <NIcon>
              <IconDisconnect />
            </NIcon>
          </NButton>
        </template>
        {{
          (device?.status === "tasking" ? "当前设备正在进行任务，" : "") +
            "确定断开连接？"
        }}
      </NPopconfirm>
      <NButton
        v-if="disconnectedStatus.has(device?.status ?? 'unknown')"
        class="operation"
        text
        :focusable="false"
        style="font-size: 24px"
        :disabled="'connecting' === device?.status"
        @click="handleDeviceConnect"
      >
        <NIcon>
          <IconLink />
        </NIcon>
      </NButton>
    </NSpace>
  </div>
</template>

<style lang="less" scoped>
@keyframes connecting {
  from {
    top: 0;
  }

  to {
    top: -8px;
  }
}

.device-card {
  display: flex;
  border-radius: 12px;
  align-items: center;
  transition: background-color 0.3s var(--n-bezier);
  justify-content: space-between;
  padding: 0 12px;
}

.device-info {
  flex: 1;
  border-radius: inherit;
  justify-content: flex-start;
  padding: 12px 0;
}

.device-status {
  position: relative;
  margin-right: 8px;
  height: 12px;
  width: 12px;
  opacity: 0.8;
  overflow: visible;

  &::before {
    content: "";
    position: absolute;
    border-radius: 100%;
    background-color: gray;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: background-color 0.3s var(--n-bezier);
  }

  &[data-status="available"]::before {
    background-color: #a8aaaf;
  }

  &[data-status="connecting"]::before {
    background-color: #28cd41;
    animation: connecting 1s cubic-bezier(0.46, 1, 0.76, 0.94) alternate infinite;
  }

  &[data-status="waitingTask"]::before {
    background-color: #28cd41;
    animation: connecting 1s cubic-bezier(0.46, 1, 0.76, 0.94) alternate infinite;
  }

  &[data-status="connected"]::before {
    background-color: #28cd41;
  }

  &[data-status="tasking"]::before {
    background-color: #66c7ff;
  }

  &[data-status="disconnected"]::before {
    background-color: #ff6b6b;
  }
}

.operation {
  margin-top: 4px;
}
</style>
