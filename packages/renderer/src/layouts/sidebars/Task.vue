<script setup lang="ts">
import { computed } from "vue";
import IconSettings from "@/assets/icons/settings.svg?component";
import IconDevices from "@/assets/icons/devices.svg?component";
import { NIcon, NSpace, NButton, NTooltip } from "naive-ui";
import DeviceCard from "@/components/DeviceCard.vue";

import useDeviceStore from "@/store/devices";

const connectedStatus: Set<DeviceStatus> = new Set(["connected", "tasking"]);
const deviceStore = useDeviceStore();
const { devices } = deviceStore;
const connectedDevices = computed(() =>
  devices.filter((device) => connectedStatus.has(device.status))
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
    <NSpace justify="space-between" align="center">
      <h2>当前连接的设备</h2>
      <NTooltip>
        <template #trigger>
          <NButton
            text
            style="font-size: 24px"
            @click="$router.push({ path: '/device' })"
          >
            <NIcon>
              <IconDevices />
            </NIcon>
          </NButton>
        </template>
        查看所有设备
      </NTooltip>
    </NSpace>
    <div class="connected-devices">
      <DeviceCard
        v-for="device in connectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.router {
  display: block;
  margin-bottom: 8px;
}
</style>
