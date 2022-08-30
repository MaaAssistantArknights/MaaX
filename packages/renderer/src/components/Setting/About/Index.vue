<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { onMounted, ref } from 'vue'

const loading = ref(false)

const cacheInfo = ref({
  log: 0,
  download: 0
})

function formatBytes (bytes: number): string {
  const units = ['Bytes', 'KiB', 'MiB', 'GiB']
  let index = 0
  while (bytes > 1024 && index < 3) {
    bytes /= 1024
    ++index
  }
  return `${bytes.toFixed(2)} ${units[index]}`
}

onMounted(async () => {
  loading.value = true
  cacheInfo.value = await window.ipcRenderer.invoke('main.Util:GetCacheInfo')
  loading.value = false
})

</script>

<template>
  <div id="about">
    <h2 class="title">
      关于
    </h2>
    <NSpace justify="center" align="center">
      <NButton type="primary" :loading="loading">
        <span>清理日志</span>
        <span v-if="!loading">&nbsp;{{ formatBytes(cacheInfo.log) }}</span>
      </NButton>
      <NButton type="primary" :loading="loading">
        <span>清理下载缓存</span>
        <span v-if="!loading">&nbsp;{{ formatBytes(cacheInfo.download) }}</span>
      </NButton>
    </NSpace>
  </div>
</template>
