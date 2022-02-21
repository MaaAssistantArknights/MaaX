<template>
  <router-view class="main container" />
</template>

<style lang="less" scoped>
.main {
  @apply flex-1 min-h-screen;
  background-color: hsla(var(--b1) / var(--tw-bg-opacity, 1));
}
</style>
