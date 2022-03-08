<script setup lang="ts">
import { computed } from "vue";
import { NIcon, NSpace, NButton, NTooltip, useMessage } from "naive-ui";
import IconRefresh from "@/assets/icons/refresh.svg?component";
import IconSettings from "@/assets/icons/settings.svg?component";
import DeviceCard from "@/components/DeviceCard.vue";

import useDeviceStore from "@/store/devices";

const connectedStatus: Set<DeviceStatus> = new Set(["connected", "tasking"]);
const disconnectedStatus: Set<DeviceStatus> = new Set([
  "available",
  "disconnected",
  "connecting",
]);
const deviceStore = useDeviceStore();
const message = useMessage();
const { devices } = deviceStore;
const connectedDevices = computed(() =>
  devices.filter((device) => connectedStatus.has(device.status))
);
const disconnectedDevices = computed(() =>
  devices.filter((device) => disconnectedStatus.has(device.status))
);




function handleRefreshDevices() {
  const refreshMessage = message.loading("正在更新设备列表...");

  //console.log(deviceStore.devices);
  window.ipcRenderer.invoke("asst:getEmulators").then((ret) => {
    deviceStore.mergeSearchResult(
      ret
        .filter((v: any) => {
          return !deviceStore.devices.find(
            (dev) => dev.connectionString === v.address
          );
        })
        .map((v: any) => {
          return {
            uuid: v.address,
            name: v.config,
            tag:v.config,
            status: "available",
            adbPath: v.adb_path,
            connectionString: v.address,
          };
        })
    );

    if (ret.length > 0) {
      refreshMessage.type = "success";
      refreshMessage.content = `找到${ret.length}个设备`;
    } else {
      refreshMessage.type = "warning";
      refreshMessage.content = "未找到任何可用设备!";
    }
  });
}

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
        v-for="device in connectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
    <NSpace :justify="'space-between'" :align="'center'">
      <h2>可用的设备列表</h2>
      <NTooltip>
        <template #trigger>
          <NButton text style="font-size: 24px" @click="handleRefreshDevices">
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
        v-for="device in disconnectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
  </div>
</template>
