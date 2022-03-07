<script setup lang="ts">
import { computed } from "vue";
import IconDisconnect from "@/assets/icons/disconnect.svg?component";
import IconLink from "@/assets/icons/link.svg?component";
import {
  NButton,
  NTooltip,
  NIcon,
  NSpace,
  NPopconfirm,
  useThemeVars,
  useMessage,
} from "naive-ui";
import useDeviceStore from "@/store/devices";
import useTaskStore from "@/store/tasks";
import router from "@/router";

const props = defineProps<{
  uuid: string;
}>();

const message = useMessage();
const themeVars = useThemeVars();
const deviceStore = useDeviceStore();
const taskStore = useTaskStore();
const device = deviceStore.devices.find((device) => device.uuid === props.uuid);
const routeUuid = computed(
  () => router.currentRoute.value.params.uuid as string | undefined
);
const isCurrent = computed(() => routeUuid.value === props.uuid);

const connectedStatus: Set<DeviceStatus> = new Set(["connected", "tasking"]);
const disconnectedStatus: Set<DeviceStatus> = new Set([
  "available",
  "disconnected",
  "connecting", 
  "unknown",
]);

function disconnectDevice(uuid: string) {}

function connectDevice(uuid: string) {}

function handleJumpToTask() {
  if (!connectedStatus.has(device?.status ?? "unknown")) {
    return;
  }
  if (!isCurrent.value) router.push(`/task/${device?.uuid}`);
}

function handleDeviceDisconnect() {
  // task stop
  // device disconnect
  message.info(
    `${device?.connectionString}断开中... （此消息不会在正式版中出现）`
  );
}

function handleDeviceConnect() {
  if (!disconnectedStatus.has(device?.status ?? "unknown")) {
    return;
  }
  deviceStore.updateDeviceStatus(device?.uuid as string, "connecting");
  message.loading(`${device?.connectionString}连接中...`);

  window.ipcRenderer.send("asst:createEx",{address:device?.connectionString});

  const success = window.ipcRenderer.sendSync("asst:connect", {
    address: device?.connectionString,
    adb_path: device?.adbPath,
    config: "LDPlayer",
  });

  if (success) {
    // do something
  } else {
    // do something
  }
}



</script>

<template>
  <div
    class="device-card"
    v-if="device"
    :class="isCurrent ? 'current' : ''"
    :style="{
      backgroundColor: isCurrent ? themeVars.hoverColor : 'transparent',
    }"
  >
    <NButton
      class="device-info"
      @click="handleJumpToTask"
      @dblclick="handleDeviceConnect"
      text
      :focusable="false"
    >
      <NTooltip>
        <template #trigger>
          <div class="device-status" :data-status="device?.status"></div>
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
      <div class="device-name">{{ device?.connectionString }}</div>
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
  padding: 4px 16px;
  align-items: center;
  transition: background-color 0.3s var(--n-bezier);
  justify-content: space-between;
}

.device-info {
  flex: 1;
  justify-content: flex-start;
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
    animation: connecting 1s cubic-bezier(0.46, 1, 0.76, 0.94) alternate
      infinite;
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
