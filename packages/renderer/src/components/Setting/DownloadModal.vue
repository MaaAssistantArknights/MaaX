<script setup lang="ts">
import _ from 'lodash'
import { NButton, NModal, NCard, NSpace, NProgress, NAlert } from 'naive-ui'
import { computed, onMounted, Ref, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps<{
  show: boolean
}>()
defineEmits(['close'])

type InstallStatus = 'not-installed' | 'installing' | 'installed' | 'upgradable'

const status: Ref<InstallStatus> = ref('not-installed')

const uiStatus = ref({ text: '', progress: 0 })
const coreStatus = ref({ text: '', progress: 0 })
const adbStatus = ref({ text: '', progress: 0 })

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
  window.ipcRenderer.invoke('main.ComponentManager:checkUpdate', 'core')
}

const handleUpdateStatus = (event: Electron.IpcRendererEvent, data: any) => {
  const text = _.clone(data.data.text)
  const progress = _.clone(data.data.progress)
  switch (data.type) {
    case 'ui':
      break
    case 'core':
      coreStatus.value.text = text
      coreStatus.value.progress = progress
      break
    case 'adb':
      adbStatus.value = data
      break
    default:
      break
  }
}

onMounted(
  () => {
    console.warn('onMounted')
    window.ipcRenderer.on('renderer.DownloadModel:updateStatus', handleUpdateStatus)
  }
)

onUnmounted(
  () => {
    window.ipcRenderer.off('renderer.DownloadModel:updateStatus', handleUpdateStatus)
  }
)

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
        <NAlert type="info">{{ $t('download.needInstallAll') }}</NAlert>
        <div class="download-card">
          <div class="download-info">
            <div class="download-title">{{ $t('download.MaaCore') }}</div>
            <div class="download-status">{{ coreStatus.text }}</div>
          </div>
          <NProgress
            :percentage="coreStatus.progress"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
           <div class="download-card">
          <div class="download-info">
            <div class="download-title">{{ $t('download.MaaUI') }}</div>
            <div class="download-status">{{ uiStatus.text }}</div>
          </div>
          <NProgress
            :percentage="uiStatus.progress"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
        <div class="download-card">
          <div class="download-info">
            <div class="download-title">{{ $t('download.adb') }}</div>
            <div class="download-status">{{ adbStatus.text }}</div>
          </div>
          <NProgress
            :percentage="adbStatus.progress"
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
