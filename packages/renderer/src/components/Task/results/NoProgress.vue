<script setup lang="ts">
import { NText } from 'naive-ui'
</script>

<template>
  <div class="progress-form no-progress">
    <NText :depth="3">
      无进度展示
    </NText>
  </div>
</template>

<style lang="less" scoped>
.no-progress {
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
}
</style>
