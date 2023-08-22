<script setup lang="ts">
import { ref, computed } from 'vue'
import IconDisconnect from '@/assets/icons/disconnect.svg?component'
import DeviceDetailPopover from '@/components/Device/DeviceDetailPopover.vue'
import IconLink from '@/assets/icons/link.svg?component'
import { NButton, NTooltip, NIcon, NSpace, NPopconfirm, useThemeVars, NPopover } from 'naive-ui'

import useDeviceStore from '@/store/devices'
import router from '@/router'
import useTaskStore from '@/store/tasks'
import useSettingStore from '@/store/settings'
// import useTaskIdStore from '@/store/taskId'
import { showMessage } from '@/utils/message'
import type { Device, DeviceStatus } from '@type/device'
import type { InitCoreParam } from '@type/ipc'

const props = defineProps<{
  device: Device
}>()

const showDetail = ref(false)

const themeVars = useThemeVars()
const deviceStore = useDeviceStore()
const taskStore = useTaskStore()
const settingStore = useSettingStore()

const touchMode = computed(() => settingStore.touchMode)
// const taskIdStore = useTaskIdStore()

const deviceDisplayName = computed(
  () => props.device.displayName || props.device.address || props.device.uuid
)
const routeUuid = computed(() => router.currentRoute.value.params.uuid as string | undefined)
const isCurrent = computed(() => routeUuid.value === props.device.uuid)

const connectedStatus: Set<DeviceStatus> = new Set(['connected', 'tasking'])
const disconnectedStatus: Set<DeviceStatus> = new Set([
  'available',
  'disconnected',
  'connecting',
  'unknown',
])

// function disconnectDevice (uuid: string) {}

// function connectDevice (uuid: string) {}

function handleJumpToTask() {
  if (!taskStore.getCurrentTaskGroup(props.device.uuid)) {
    taskStore.initDeviceTask(props.device.uuid)
  }
  taskStore.fixTaskList(props.device.uuid)
  if (!isCurrent.value) router.push(`/task/${props.device.uuid}`)
}

function handleDeviceDisconnect() {
  // task stop
  window.main.CoreLoader.disconnectAndDestroy({
    uuid: props.device.uuid,
  })
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
      duration: 3000,
    })
    return
  }

  // 无地址, 尝试唤醒模拟器
  if (!props.device.address || props.device.address.length === 0) {
    if (!(await deviceStore.wakeUpDevice(props.device.uuid))) {
      showMessage('无法连接模拟器', {
        type: 'error',
        duration: 3000,
      })
      return
    }
  }

  deviceStore.updateDeviceStatus(props.device.uuid, 'connecting')
  await window.main.CoreLoader.initCoreAsync({
    address: props.device.address,
    uuid: props.device.uuid,
    adb_path: props.device.adbPath,
    config: props.device.config,
    touch_mode: touchMode.value,
  } as InitCoreParam)
}
</script>

<template>
  <div v-if="device" class="device-card" :class="isCurrent ? 'current' : ''">
    <NButton class=" device-info" text :focusable="false" @click="handleJumpToTask" @dblclick="handleDeviceConnect">
      <NTooltip>
        <template #trigger>
          <div class="device-status" :data-status="device?.status" />
        </template>
        {{
          (() => {
            switch (device?.status) {
              case 'available':
                return '点击右边按钮连接设备'
              case 'connected':
                return '设备已连接'
              case 'connecting':
                return '设备正在连接中...'
              case 'disconnected':
                return '设备已断开连接'
              case 'tasking':
                return '任务进行中...'
              default:
                return '设备状态未知'
            }
          })()
        }}
      </NTooltip>
      <NPopover v-model:show="showDetail" :duration="500">
        <template #trigger>
          <div class="device-name">
            {{ deviceDisplayName }}
          </div>
        </template>
        <template #default>
          <DeviceDetailPopover :device="props.device" />
        </template>
      </NPopover>
    </NButton>
    <NSpace :align="'center'">
      <NPopconfirm v-if="connectedStatus.has(device?.status ?? 'unknown')" positive-text="确定" negative-text="取消"
        @positive-click="handleDeviceDisconnect">
        <template #trigger>
          <NButton class="operation" text :focusable="false" style="font-size: 24px">
            <NIcon>
              <IconDisconnect />
            </NIcon>
          </NButton>
        </template>
        {{ (device?.status === 'tasking' ? '当前设备正在进行任务，' : '') + '确定断开连接？' }}
      </NPopconfirm>
      <NButton v-if="disconnectedStatus.has(device?.status ?? 'unknown')" class="operation" text :focusable="false"
        style="font-size: 24px" :disabled="'connecting' === device?.status" @click="handleDeviceConnect">
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
    content: '';
    box-sizing: border-box;
    position: absolute;
    border-radius: 100%;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: background-color 0.3s var(--n-bezier);
  }

  &[data-status='unknown']::before {
    border: 2px solid #a8aaaf;
  }

  &[data-status='available']::before {
    background-color: #a8aaaf;
  }

  &[data-status='connecting']::before {
    background-color: #28cd41;
    animation: connecting 1s cubic-bezier(0.46, 1, 0.76, 0.94) alternate infinite;
  }

  &[data-status='waitingTask']::before {
    background-color: #28cd41;
    animation: connecting 1s cubic-bezier(0.46, 1, 0.76, 0.94) alternate infinite;
  }

  &[data-status='connected']::before {
    background-color: #28cd41;
  }

  &[data-status='tasking']::before {
    background-color: #66c7ff;
  }

  &[data-status='disconnected']::before {
    background-color: #ff6b6b;
  }
}

.operation {
  margin-top: 4px;
}
</style>
