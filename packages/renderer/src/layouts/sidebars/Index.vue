<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component';
import { NIcon, NSpace, NButton } from 'naive-ui';

</script>

<template>
  <div>
    <NButton text style="font-size: 24px" @click="$router.push({ path: '/settings' })">
      <NIcon>
        <IconSettings />
      </NIcon>
    </NButton>
    <NSpace justify="space-between" align="center">
      <h2>当前连接的设备</h2>
      <NIcon></NIcon>
    </NSpace>
  </div>
</template>

<style lang="less" scoped>
.router {
  display: block;
  margin-bottom: 8px;
}
</style>