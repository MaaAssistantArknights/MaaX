<script setup lang="ts">
import { computed, h, ref } from 'vue'
import {
  NIcon,
  NSpace,
  NButton,
  NTooltip,
  NText,
  NTime
  // useMessage
} from 'naive-ui'
import IconRefresh from '@/assets/icons/refresh.svg?component'
import IconSettings from '@/assets/icons/settings.svg?component'
import DeviceCard from '@/components/DeviceCard.vue'

import useDeviceStore from '@/store/devices'
import useSettingStore from '@/store/settings'

import { installCore, checkCoreVersion } from '@/utils/core'
import { show } from '@/utils/message'

const connectedStatus: Set<DeviceStatus> = new Set(['connected', 'tasking'])
const disconnectedStatus: Set<DeviceStatus> = new Set([
  'available',
  'disconnected',
  'connecting'
])
const deviceStore = useDeviceStore()
const settingStore = useSettingStore()
// const message = useMessage()
const connectedDevices = computed(() =>
  deviceStore.devices.filter((device) => connectedStatus.has(device.status))
)
const disconnectedDevices = computed(() =>
  deviceStore.devices.filter((device) => disconnectedStatus.has(device.status))
)

async function handleRefreshDevices () {
  if (!(await checkCoreVersion())) {
    installCore()
    return
  }
  show('正在更新设备列表...', { type: 'loading', duration: 0 })

  // console.log(deviceStore.devices);
  window.ipcRenderer.invoke('asst:getEmulators').then((ret) => {
    if (!ret.every((v: any) => { return v.uuid })) {
      show(() => h('span', '检测到设备, 但唯一标识符获取失败, 可能是模拟器未启动完成导致, 请重试或重启模拟器'), { type: 'error' })
      return
    }

    deviceStore.mergeSearchResult(
      ret
        .filter((v: any) => {
          return !deviceStore.devices.find((dev) => dev.uuid === v.uuid)
        })
        .map((v: any) => {
          return {
            uuid: v.uuid,
            name: v.config,
            tag: v.tag,
            status: 'available',
            adbPath: v.adb_path,
            connectionString: v.address,
            emulatorPath: v.emulatorPah,
            commandLine: v.commandLine
          }
        })
    )

    if (ret.length > 0) {
      show(`找到${ret.length}个设备`, { type: 'success', duration: 2000 })
    } else {
      show('未找到任何可用设备! 请重试', { type: 'warning', duration: 2000 })
    }
  })
}

const now = ref(Date.now())

setInterval(() => {
  now.value = Date.now()
}, 1000)
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
            :disabled="settingStore.version.core === undefined ? true : false"
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
        <span v-if="deviceStore.lastUpdate === null">从不</span>
        <NTime
          v-else
          :time="deviceStore.lastUpdate"
          :to="now"
          type="relative"
        />
      </NText>
    </div>
  </div>
</template>
