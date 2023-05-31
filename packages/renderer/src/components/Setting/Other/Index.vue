<script setup lang="ts">
import { NSpace, NButton } from 'naive-ui'

async function onClickOpenFolder(type: 'core' | 'core-log' | 'ui-log'): Promise<void> {
  await window.main.Util.openFolder(type)
}
</script>

<template>
  <div id="other" :style="{ textAlign: 'left' }">
    <h2 class="title">其他</h2>
    <NSpace justify="start" align="center">
      <NButton type="primary" round size="small" @click="onClickOpenFolder('core')">
        <span>打开core存储文件夹</span>
      </NButton>
      <NButton type="primary" round size="small" @click="onClickOpenFolder('ui-log')">
        <span>打开UI日志存储文件夹</span>
      </NButton>
      <NButton type="primary" round size="small" @click="onClickOpenFolder('core-log')">
        <span>打开core日志存储文件夹</span>
      </NButton>
    </NSpace>
  </div>
</template>
