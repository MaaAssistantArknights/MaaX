<script setup lang="ts">
import { NButton, NModal, NCard, NSpace, NProgress, NAlert } from 'naive-ui'
import { computed, Ref, ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()
defineEmits(['close'])

type InstallStatus = 'not-installed' | 'installing' | 'installed' | 'upgradable'

const status: Ref<InstallStatus> = ref('not-installed')

const installButtonText = computed(() => {
  switch (status.value) {
    case 'not-installed':
      return '开始安装'
    case 'installing':
      return '正在安装'
    case 'installed':
      return '重新安装'
    case 'upgradable':
      return '更新'
    default: return '' // unreachable
  }
})

const handleInstall = () => {
  window.ipcRenderer.invoke('main.componentManager:checkUpdate', 'core')
}
</script>

<template>
  <NModal :show="props.show" :closable="false" :style="{ width: '600px' }">
    <NCard title="组件安装">
      <template #footer>
        <NSpace :justify="'end'">
          <NButton
            @click="handleInstall"
            type="primary"
            :disabled="status === 'installing'"
          >{{ installButtonText }}</NButton>
        </NSpace>
      </template>
      <NSpace vertical>
        <NAlert type="info">必须安装完所需组件才能继续</NAlert>
        <div class="download-card">
          <div class="download-info">
            <div class="download-title">Maa 核心组件</div>
            <div class="download-status">下载中 50%</div>
          </div>
          <NProgress
            :percentage="50"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
        <div class="download-card">
          <div class="download-info">
            <div class="download-title">Android 设备连接组件</div>
            <div class="download-status">下载中 50%</div>
          </div>
          <NProgress
            :percentage="50"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
      </NSpace>
    </NCard>
  </NModal>
</template>

<style lang="less" scoped>
.download-card {
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1);
  border-radius: 12px 12px 0 0;
  padding: 0;
}
.download-info {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  height: 20px;
}
</style>
