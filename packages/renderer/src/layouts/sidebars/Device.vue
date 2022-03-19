<script setup lang="ts">
import { computed, ref } from "vue";
import { NIcon, NSpace, NButton, NTooltip, NText, NTime, useMessage } from "naive-ui";
import IconRefresh from "@/assets/icons/refresh.svg?component";
import IconSettings from "@/assets/icons/settings.svg?component";
import DeviceCard from "@/components/DeviceCard.vue";

import useDeviceStore from "@/store/devices";
import useSettingStore from "@/store/settings";
import asstHooks from "@/hooks/caller/asst";
import versionHooks from "@/hooks/caller/version";

import installCore from "@/utils/installer";

const connectedStatus: Set<DeviceStatus> = new Set(["connected", "tasking"]);
const disconnectedStatus: Set<DeviceStatus> = new Set([
  "available",
  "disconnected",
  "connecting",
]);
const deviceStore = useDeviceStore();
const settingStore = useSettingStore();
const message = useMessage();
const { devices, lastUpdate } = deviceStore;
const { version } = settingStore;
const connectedDevices = computed(() =>
  devices.filter((device) => connectedStatus.has(device.status))
);
const disconnectedDevices = computed(() =>
  devices.filter((device) => disconnectedStatus.has(device.status))
);

async function checkCoreVersion() {
  const success = asstHooks.load();
  const version = versionHooks.core();
  if (success && version) {
    settingStore.version.core.current = version;
    return true;
  } else {
    return false;
  }
}

async function handleRefreshDevices() {
  if (!await checkCoreVersion()) {
    installCore();
    return;
  }
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
            tag: v.config,
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

const now = ref(Date.now());

setInterval(() => {
  now.value = Date.now();
}, 1000);

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
          <NButton
            text
            style="font-size: 24px"
            @click="handleRefreshDevices"
            :disabled="version.core === undefined ? true : false"
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
        v-for="device in disconnectedDevices"
        :uuid="device.uuid"
        :key="device.uuid"
      />
    </div>
    <div :style="{ textAlign: 'center' }">
      <NText depth="2">
        最后更新：
        <span v-if="lastUpdate === null">从不</span>
        <NTime v-else :time="lastUpdate" :to="now" type="relative" />
      </NText>
    </div>
  </div>
</template>
