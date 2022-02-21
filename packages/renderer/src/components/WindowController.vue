<script setup lang="ts">
import { ref, Ref } from "vue";

import IconWindowMinimize from "@/assets/icons/window-minimize.svg?component";
import IconClose from "@/assets/icons/close.svg?component";
import IconScaleContract from "@/assets/icons/scale-contract.svg?component";
import IconScaleExtend from "@/assets/icons/scale-extend.svg?component";

const isMaximized: Ref<boolean> = ref(window.ipcRenderer.sendSync('window:is-maximized'));

const onClose = () => {
  window.ipcRenderer.send('window:close');
}

const onToggleMaximized = () => {
  const result = window.ipcRenderer.sendSync('window:toggle-maximized');
  if (result instanceof Error) {

  }
}

const onMinimize = () => {
  window.ipcRenderer.send('window:minimize');
}

window.ipcRenderer.on('window:update-maximized', (_, maximized) => {
  isMaximized.value = maximized;
})
</script>

<template>
  <div class="window-controller">
    <div class="placeholder-bar w-64"></div>
    <div class="drag-bar"></div>
    <button class="btn btn-error traffic-light" @click="onClose">
      <IconClose width="12" height="12" style="zoom: 75%;" />
    </button>
    <button class="btn btn-success traffic-light" @click="onToggleMaximized">
      <IconScaleExtend width="12" height="12" v-if="!isMaximized" />
      <IconScaleContract width="12" height="12" v-if="isMaximized" />
    </button>
    <button class="btn btn-warning traffic-light" @click="onMinimize">
      <IconWindowMinimize width="12" height="12" />
    </button>
  </div>
</template>

<style lang="less" scoped>
.window-controller {
  @apply flex fixed z-50 top-0 justify-end items-center w-screen pr-6 pointer-events-none;
  height: 60px;
}

.drag-bar {
  @apply h-full flex-1;
  -webkit-app-region: drag;
}

.traffic-light {
  @apply ml-2 flex rounded-full justify-center items-center p-0 min-h-fit pointer-events-auto;
  width: 18px;
  height: 18px;
  & svg {
    fill: #000;
  }
}
</style>
