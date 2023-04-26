<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component'
import IconDevices from '@/assets/icons/devices.svg?component'
import IconTool from '@/assets/icons/tool.svg?component'
import { NIcon, NSpace, NButton, NTooltip } from 'naive-ui'
import DeviceCard from '@/components/Device/DeviceCard.vue'
import router from '@/router'

import useDeviceStore from '@/store/devices'
import { computed, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

let deviceStore = useDeviceStore()
let currentUuid = computed(
  () => router.currentRoute.value.params.uuid as string
)
let currentDevice = computed(() =>
  deviceStore.devices.find(device => device.uuid === currentUuid.value)
)
let otherDevices = deviceStore.devices.filter(
  device => device.uuid !== currentUuid.value
)

onBeforeRouteUpdate((to, from, next) => {
  deviceStore = useDeviceStore()
  currentUuid = computed(() => to.params.uuid as string)
  currentDevice = computed(() =>
    deviceStore.devices.find(device => device.uuid === currentUuid.value)
  )
  otherDevices = deviceStore.devices.filter(
    device => device.uuid !== currentUuid.value
  )
  next()
})
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
      <h2>当前设备</h2>
      <NSpace>
        <!-- <NTooltip>
          <template #trigger>
            <NButton
              :disabled="
                // currentDevice?.status !== 'connected'
                undefined
              "
              text
              style="font-size: 24px"
              @click="$router.push({ path: `/tool/${currentUuid}` })"
            >
              <NIcon>
                <IconTool />
              </NIcon>
            </NButton>
          </template>
          小工具
        </NTooltip> -->
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
    </NSpace>
    <div class="current-device">
      <DeviceCard :device="currentDevice!" />
    </div>
    <h2>其他设备</h2>
    <div class="other-devices">
      <DeviceCard
        v-for="device in otherDevices"
        :key="device.uuid"
        :device="device"
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
