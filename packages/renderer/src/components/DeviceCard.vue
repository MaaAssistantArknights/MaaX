<script setup lang="ts">
import { computed } from 'vue';
import IconDisconnect from '@/assets/icons/disconnect.svg?component';
import { NButton, NTooltip, NIcon, useThemeVars } from 'naive-ui';
import useDeviceStore from '@/store/devices';
import router from '@/router';

const props = defineProps<{
  uuid: string
}>()

const themeVars = useThemeVars();
const deviceStore = useDeviceStore();
const device = deviceStore.devices.find(device => device.uuid === props.uuid);
const routeUuid = router.currentRoute.value.params.uuid as (string | undefined);
const isCurrent = computed(() => routeUuid === props.uuid);

function handleJumpToTask() {
  if (!isCurrent.value) router.push(`/task/${device?.uuid}`);
}

function handleDeviceDisconnect() {
  if (device?.status === 'tasking') {
    // confirm for disconnect
  }
  // task stop
  // device disconnect
}
</script>

<template>
  <div
    class="device-card"
    :class="isCurrent ? 'current' : ''"
    :style="{
      backgroundColor:
        isCurrent ? themeVars.hoverColor : 'transparent'
    }"
  >
    <NButton
      class="device-info"
      @click="handleJumpToTask"
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
              case 'available':
                return '点击连接设备';
              case 'connected':
                return '设备已连接';
              case 'connecting':
                return '设备正在连接中...';
              case 'disconnected':
                return '设备已断开连接';
              case 'tasking':
                return '任务进行中...';
              default:
                return '设备状态未知';
            }
          })()
        }}
      </NTooltip>
      <div class="device-name">{{ device?.connectionString }}</div>
    </NButton>
    <div class="operations">
      <NButton
        text
        :focusable="false"
        style="font-size: 24px;"
        @click="handleDeviceDisconnect"
      >
        <NIcon>
          <IconDisconnect />
        </NIcon>
      </NButton>
    </div>
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
    background-color: #e1d460;
  }
}
</style>