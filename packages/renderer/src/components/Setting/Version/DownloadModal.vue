<script setup lang="ts">
import { ref, Ref, onMounted, computed } from 'vue'
import {
  NButton,
  NModal,
  NCard,
  NSpace,
  NProgress,
  NAlert,
  NTooltip,
  NPopconfirm
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import useComponentStore from '@/store/components'
import useDeviceStore from '@/store/devices'

const { t } = useI18n()
const componentStore = useComponentStore()
const deviceStore = useDeviceStore()

const isTasking = computed(() =>
  deviceStore.devices.some(device => device.status === 'tasking')
)

const props = defineProps<{
  show: boolean;
}>()
defineEmits(['close', 'update:show'])

const showTooltip: Ref<ComponentType | undefined> = ref()

const tooltipPosition = ref({
  x: 0,
  y: 0,
  width: 0
})

const getInstallProgress = (component?: ComponentType) =>
  (component ? componentStore[component].installerProgress : 0)

// TODO: replace with i18n function
const installButtonText = (status: ComponentStatus) => {
  switch (status) {
    case 'not-installed':
      return '开始安装'
    case 'installing':
      return '正在安装'
    case 'not-compatible':
      return '修复'
    case 'installed':
      return '重新安装'
    case 'upgradable':
      return '更新'
    case 'upgrading':
      return '正在更新'
  }
}

const installerStatusText = (status: InstallerStatus) => {
  switch (status) {
    case 'downloading':
      return '下载中...'
    case 'unzipping':
      return '解压中...'
    case 'exception':
      return '出错啦'
    default:
      return ''
  }
}

const handleInstall = (component: ComponentType) => {
  switch (componentStore[component].componentStatus) {
    case 'installed':
    case 'not-installed':
    case 'not-compatible':
    case 'upgradable': {
      window.ipcRenderer.invoke('main.ComponentManager:install', component)
      break
    }
    default:
      return
  }
  if (componentStore[component].componentStatus === 'upgradable') {
    componentStore.updateComponentStatus(component, {
      componentStatus: 'upgrading'
    })
  } else {
    componentStore.updateComponentStatus(component, {
      componentStatus: 'installing'
    })
  }
}

const handleInstallButtonClick = (component: ComponentType) => {
  if (!isTasking.value) {
    handleInstall(component)
  }
}

const handleMouseEnter = (event: MouseEvent, component: ComponentType) => {
  const element = event.target as HTMLElement
  const rect = element.getClientRects()[0]
  showTooltip.value = component
  tooltipPosition.value = {
    x: rect.x,
    y: rect.y,
    width: rect.width
  }
}

const handleMouseLeave = () => {
  showTooltip.value = undefined
}

const components: ComponentType[] = [
  'Maa App',
  'Maa Core',
  'Android Platform Tools',
  'Maa Dependency',
  'Maa Resource'
]

onMounted(() => {
  Promise.all(
    components.map(component => {
      return new Promise<void>(resolve => {
        window.ipcRenderer.invoke('main.ComponentManager:getStatus', component)
          .then((status: ComponentStatus | undefined) => {
            if (status) {
              componentStore.updateComponentStatus(component, { componentStatus: status })
            }
            resolve()
          })
          .catch(() => resolve())
      })
    })
  )
})
</script>

<template>
  <NModal
    :show="props.show"
    :closable="false"
    :style="{ width: '600px' }"
    @update:show="(value) => $emit('update:show', value)"
  >
    <NCard title="组件安装">
      <NSpace vertical>
        <NAlert type="info">
          {{ $t("download.needInstallAll") }}
        </NAlert>
        <div
          v-for="component of components"
          :key="component"
          class="download-card"
          @mouseenter="(event) => handleMouseEnter(event, component)"
          @mouseleave="handleMouseLeave"
        >
          <NProgress
            :percentage="componentStore[component].installerProgress * 100"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
            :rail-color="'transparent'"
          />
          <div class="download-info">
            <div class="download-title">
              {{ $t(`download["${component}"]`) }}
            </div>
            <div
              v-if="
                ['installing', 'upgrading'].includes(
                  componentStore[component].componentStatus
                )
              "
              class="download-status"
            >
              {{
                [
                  installButtonText(componentStore[component].componentStatus),
                  installerStatusText(
                    componentStore[component].installerStatus
                  ),
                ].join(" - ")
              }}
            </div>
            <NPopconfirm v-else :disabled="!isTasking" @positive-click="() => handleInstall(component)">
              <template #trigger>
                <NButton
                  type="primary"
                  :secondary="componentStore[component].componentStatus === 'installed'"
                  size="small"
                  @click="() => handleInstallButtonClick(component)"
                >
                  {{ installButtonText(componentStore[component].componentStatus) }}
                </NButton>
              </template>
            </NPopconfirm>
          </div>
        </div>
      </NSpace>
      <NTooltip
        trigger="manual"
        :x="tooltipPosition.x + getInstallProgress(showTooltip) * tooltipPosition.width"
        :y="tooltipPosition.y"
        :show="!!showTooltip && ['installing', 'upgrading'].includes(componentStore[showTooltip].componentStatus)"
      >
        {{ Math.ceil(getInstallProgress(showTooltip) * 100) }}%
      </NTooltip>
    </NCard>
  </NModal>
</template>

<style lang="less" scoped>
.download-card {
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1);
  border-radius: 0 0 12px 12px;
  padding: 0;
}

.download-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  height: 20px;
}
</style>
