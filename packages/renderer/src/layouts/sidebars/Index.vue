<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component';
import { NIcon, useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();

</script>

<template>
  <div>
    <router-link class="router" to="/settings">
      <NIcon size="24px" :color="themeVars.textColor1">
        <IconSettings />
      </NIcon>
    </router-link>
    <h2>当前连接的设备</h2>
  </div>
</template>

<style lang="less" scoped>
.router {
  display: block;
  margin-bottom: 8px;
}
</style>