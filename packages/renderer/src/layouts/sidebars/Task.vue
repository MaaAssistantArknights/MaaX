<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component'
import IconDevices from '@/assets/icons/devices.svg?component'
import { NIcon, NSpace, NButton, NTooltip } from 'naive-ui'
import DeviceCard from '@/components/Device/DeviceCard.vue'
import router from '@/router'

import useDeviceStore from '@/store/devices'

const deviceStore = useDeviceStore()
const currentUuid = router.currentRoute.value.params.uuid as string
const otherDevices = deviceStore.devices.filter(device => device.uuid !== currentUuid)
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
    <NSpace
      justify="space-between"
      align="center"
    >
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
    <div class="current-device">
      <DeviceCard
        :uuid="currentUuid"
      />
    </div>
    <div class="other-devices">
      <DeviceCard
        v-for="device in otherDevices"
        :key="device.uuid"
        :uuid="device.uuid"
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
