<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isMaximized = ref(false)

onMounted(() => {
  window.main.WindowManager.isMaximized().then(result => {
    isMaximized.value = result
  })
})

window.renderer.WindowManager.updateMaximized = maximized => {
  isMaximized.value = maximized
}
</script>

<template>
  <div class="window-controller">
    <div class="drag-bar" />
  </div>
</template>

<style lang="less" scoped>
.window-controller {
  display: flex;
  position: fixed;
  z-index: 10;
  top: 0;
  justify-content: end;
  align-items: center;
  width: 100vw;
  padding-right: 24px;
  pointer-events: none;
  height: 40px;
}

.drag-bar {
  height: 100%;
  flex: 1;
  align-self: flex-start;
  -webkit-app-region: drag;
}
</style>
