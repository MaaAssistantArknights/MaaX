<script setup lang="ts">
import { NSpace, NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'

const loading = ref(false)

const cacheInfo = ref({
  log: 0,
  download: 0,
})

function formatBytes(bytes: number): string {
  const units = ['Bytes', 'KiB', 'MiB', 'GiB']
  let index = 0
  while (bytes > 1024 && index < 3) {
    bytes /= 1024
    ++index
  }
  return `${bytes.toFixed(2)} ${units[index]}`
}

async function refreshStatus() {
  loading.value = true
  cacheInfo.value = await window.ipcRenderer.invoke('main.Util:GetCacheInfo')
  loading.value = false
}

async function cleanLogs() {
  await window.ipcRenderer.invoke('main.Util:CleanLogs')
  refreshStatus()
}

async function cleanDownloadCache() {
  await window.ipcRenderer.invoke('main.Util:CleanDownloadCache')
  refreshStatus()
}

onMounted(refreshStatus)
</script>

<template>
  <div id="clear" :style="{ textAlign: 'left' }">
    <h2 class="title">缓存清理</h2>
    <NSpace justify="start" align="center">
      <NButton type="primary" :loading="loading" round size="small" @click="cleanLogs">
        <span>清理日志</span>
        <span v-if="!loading">&nbsp;{{ formatBytes(cacheInfo.log) }}</span>
      </NButton>
      <NButton type="primary" :loading="loading" round size="small" @click="cleanDownloadCache">
        <span>清理下载缓存</span>
        <span v-if="!loading">&nbsp;{{ formatBytes(cacheInfo.download) }}</span>
      </NButton>
    </NSpace>
  </div>
</template>
