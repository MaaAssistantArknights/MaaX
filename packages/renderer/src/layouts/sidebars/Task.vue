<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component';
import IconDevices from '@/assets/icons/devices.svg?component';
import { NIcon, NSpace, NButton, NTooltip } from 'naive-ui';
import DeviceCard from '@/components/DeviceCard.vue';
import router from '@/router';

const uuid = router.currentRoute.value.params.uuid as string

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
            style="font-size: 24px;"
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
    <DeviceCard :uuid="uuid" />
  </div>
</template>

<style lang="less" scoped>
.router {
  display: block;
  margin-bottom: 8px;
}
</style>