<script setup lang="ts">
import { computed, ref } from 'vue'
import { NIcon, NSpace, NButton, NTooltip, NText, NTime, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import IconRefresh from '@/assets/icons/refresh.svg?component'
import IconSettings from '@/assets/icons/settings.svg?component'
import DeviceCard from '@/components/Device/DeviceCard.vue'

import useDeviceStore from '@/store/devices'
import useSettingStore from '@/store/settings'

import { showMessage } from '@/utils/message'
import type { Device } from '@type/device'

const dialog = useDialog()
const { t } = useI18n()
const connectedStatus = ['connected', 'tasking']
const deviceStore = useDeviceStore()
const settingStore = useSettingStore()
const connectedDevices = computed(() =>
  deviceStore.devices.filter(device => connectedStatus.includes(device.status))
)
const disconnectedDevices = computed(() =>
  deviceStore.devices.filter(device => !connectedStatus.includes(device.status))
)

// TODO: 从maa启动模拟器的支持

/**
 * @description 过滤不可用的连接设备，并在神谕上提示
 */
function deviceInfoParser(devices: Device[]): any[] {
  const ret: any[] = []
  devices.forEach(info => {
    if (!info.uuid) {
      showMessage(t('device.connectionError', { address: info.address }), {
        type: 'error',
        duration: 0,
        closable: true,
      })
    } else {
      ret.push({
        status: 'available',
        uuid: info.uuid,
        address: info.address,
        config: info.config,
        commandLine: info.commandLine,
        adbPath: info.adbPath,
        pid: info.pid,
        displayName: info.displayName,
      })
    }
  })
  if (ret.length === 0) {
    showMessage(
      t('device.noDeviceAvailable'),
      {
        type: 'info',
        duration: 0,
        closable: true,
      },
      true
    )
  } else {
    showMessage(
      t('device.availableDeviceFound', { count: ret.length }),
      {
        type: 'info',
      },
      true
    )
  }
  return ret
}

async function handleRefreshDevices() {
  const is_exist = await window.main.DeviceDetector.isDefaultAdbExists()
  if (!is_exist) {
    showMessage(t('device.adbNotAvailable'), {
      type: 'error',
      duration: 0,
      closable: true,
    })
    return
  }

  const refreshingMessage = showMessage(t('device.refreshingDevices'), {
    type: 'loading',
    duration: 0,
  })

  window.main.DeviceDetector.getEmulators()
    .then(ret => {
      // FIXME: Emulator无法转换为Device
      const devices = deviceInfoParser(ret)
      deviceStore.mergeSearchResult(devices)
    })
    .catch(() => {
      refreshingMessage.destroy()
      dialog.error({
        title: t('Common.error'),
        content: t('device.refreshingError'),
      })
    })
}

const now = ref(Date.now())

setInterval(() => {
  now.value = Date.now()
}, 1000)
</script>

<template>
  <div>
    <NButton text style="font-size: 24px" @click="$router.push({ path: '/settings' })">
      <NIcon>
        <IconSettings />
      </NIcon>
    </NButton>
    <h2>已连接的设备</h2>
    <div class="connected-devices">
      <DeviceCard v-for="device in connectedDevices" :key="device.uuid" :device="device" />
    </div>
    <NSpace :justify="'space-between'" :align="'center'">
      <h2>其他设备</h2>
      <NTooltip>
        <template #trigger>
          <NButton
            text
            style="font-size: 24px"
            :disabled="settingStore.version.core === undefined ? true : false"
            @click="handleRefreshDevices"
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
      <DeviceCard v-for="device in disconnectedDevices" :key="device.uuid" :device="device" />
    </div>
    <!-- <div class="unknown-devices">
                  <DeviceCard
                    v-for="device in unknownDevices"
                    :uuid="device.uuid"
                    :key="device.uuid"
                  />
                </div> -->
    <div :style="{ textAlign: 'center' }">
      <NText depth="2">
        {{ $t('Common.lastUpdate') }}:&nbsp;
        <span v-if="deviceStore.lastUpdate === null">从不</span>
        <NTime v-else :time="deviceStore.lastUpdate" :to="now" type="relative" />
      </NText>
    </div>
  </div>
</template>
