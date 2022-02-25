<script setup lang="ts">
import { NTooltip, useThemeVars } from 'naive-ui';
import useDeviceStore from '@/store/devices';
import router from '@/router';

const props = defineProps<{
  uuid: string
}>()

const themeVars = useThemeVars();
const deviceStore = useDeviceStore();
const device = deviceStore.devices.find(device => device.uuid === props.uuid);
const currentUuid = router.currentRoute.value.params.uuid as (string | undefined);  
</script>

<template>
  <div
    class="device-card"
    :style="{
      backgroundColor:
        currentUuid === props.uuid ? themeVars.hoverColor : 'transparent'
    }"
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
  padding: 8px 16px;
  align-items: center;
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
  }
  &[data-status="available"]::before {
    background-color: #a8aaaf;
  }
  &[data-status="connecting"]::before {
    background-color: #28cd41;
    animation: connecting 1s cubic-bezier(.46,1,.76,.94) alternate
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