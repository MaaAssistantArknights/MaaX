<script setup lang="ts">
import IconSettings from '@/assets/icons/settings.svg?component';

</script>

<template>
  <div class="index-side-bar">
    <router-link class="router" to="/settings">
      <IconSettings width="24" height="24" />
    </router-link>
    <h3>当前连接的设备</h3>
  </div>
</template>

<style lang="less" scoped>
.index-side-bar {
  @apply text-left;
}

.router {
  @apply mb-2 block;
}
</style>