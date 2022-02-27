<script setup lang="ts">
import { computed } from 'vue';
import { NIcon, NSpace, NButton, NTooltip } from 'naive-ui';
import IconRefresh from '@/assets/icons/refresh.svg?component';
import IconSettings from '@/assets/icons/settings.svg?component';
import DeviceCard from '@/components/DeviceCard.vue';

import useDeviceStore from '@/store/devices';

const connectedStatus: Set<DeviceStatus> = new Set(['connected', 'tasking']);
const disconnectedStatus: Set<DeviceStatus> = new Set(['available', 'disconnected', 'connecting']);
const deviceStore = useDeviceStore();
const { devices } = deviceStore;
const connectedDevices = computed(() =>
  devices.filter(device => connectedStatus.has(device.status))
);
const disconnectedDevices = computed(() =>
  devices.filter(device => disconnectedStatus.has(device.status))
);

</script>

<template>
  <div>
    <NButton
      text
      style="font-size: 24px"
      @click="$router.push({ path: '/settings' })"
    >
      <NIcon>
        <IconSettings />
      </NIcon>
    </NButton>
    <h2>当前连接的设备</h2>
    <div class="connected-devices">
      <DeviceCard
        v-for="(device) in connectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
    <NSpace :justify="'space-between'" :align="'center'">
      <h2>可用的设备列表</h2>
      <NTooltip>
        <template #trigger>
          <NButton
            text
            style="font-size: 24px;"
          >
            <NIcon>
              <IconRefresh />
            </NIcon>
          </NButton>
        </template>
        刷新
      </NTooltip>
    </NSpace>
    <div class="disconnected-devices">
      <DeviceCard
        v-for="(device) in disconnectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
  </div>
</template>