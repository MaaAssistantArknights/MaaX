<script setup lang="ts">
import { NText } from 'naive-ui'
</script>

<template>
  <div class="no-configuration">
    <NText :depth="3">没有设置项</NText>
  </div>
</template>

<style lang="less" scoped>
.no-configuration {
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
}
</style>
