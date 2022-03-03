<script setup lang="ts">
import { ref, Ref } from "vue";
import { NButton, NSpace, NIcon } from 'naive-ui';

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
    console.log()
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
    <div class="placeholder-bar"></div>
    <div class="drag-bar"></div>
    <NSpace class="traffic-lights">
      <NButton
        @click="onToggleMaximized"
        circle
        type="success"
        size="tiny"
        class="traffic-light"
      >
        <template #icon>
          <NIcon class="traffic-light-icon" color="#000">
            <IconScaleExtend v-if="!isMaximized" />
            <IconScaleContract v-if="isMaximized" />
          </NIcon>
        </template>
      </NButton>
      <NButton
        @click="onMinimize"
        circle
        type="warning"
        size="tiny"
        class="traffic-light"
      >
        <template #icon>
          <NIcon class="traffic-light-icon" color="#000">
            <IconWindowMinimize />
          </NIcon>
        </template>
      </NButton>
      <NButton
        @click="onClose"
        circle
        type="error"
        size="tiny"
        class="traffic-light"
      >
        <template #icon>
          <NIcon class="traffic-light-icon" color="#000">
            <IconClose />
          </NIcon>
        </template>
      </NButton>
    </NSpace>
  </div>
</template>

<style lang="less" scoped>
.window-controller {
  display: flex;
  position: fixed;
  z-index: 50;
  top: 0;
  justify-content: end;
  align-items: center;
  width: 100vw;
  padding-right: 24px;
  pointer-events: none;
  height: 60px;
}

.placeholder-bar {
  width: 256px;
}

.drag-bar {
  height: 100%;
  flex: 1;
  -webkit-app-region: drag;
}

.traffic-lights {
  margin-right: 48px;
  pointer-events: auto;
  zoom: 65%;
}

.traffic-light {
  border: 1px solid #aaa;
  .traffic-light-icon {
    opacity: 0;
  }
  &:hover .traffic-light-icon {
    opacity: 1;
  }
}
</style>
