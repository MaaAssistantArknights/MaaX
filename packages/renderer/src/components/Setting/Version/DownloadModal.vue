<script setup lang="ts">
import useComponentStore from '@/store/components'
import useDeviceStore from '@/store/devices'
import type { ComponentStatus, ComponentType } from '@type/componentManager'
import type { InstallerStatus } from '@type/misc'
import {
  NAlert,
  NButton,
  NCard,
  NModal,
  NPopconfirm,
  NSelect,
  NCollapse,
  NCollapseItem,
  useMessage,
  useDialog,
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import useSettingStore from '@/store/settings'

import type { Ref } from 'vue'
import { removeComponent, moveComponentBaseDir } from '@/hooks/caller/component'
import logger from '@/hooks/caller/logger'
import { openDialog } from '@/hooks/caller/util'

const { t } = useI18n()
const message = useMessage()
const dialog = useDialog()
const componentStore = useComponentStore()
const deviceStore = useDeviceStore()
const settingStore = useSettingStore()

const isTasking = computed(() => deviceStore.devices.some(device => device.status === 'tasking'))

const props = defineProps<{
  show: boolean
}>()

defineEmits<{
  (event: 'close'): void
  (event: 'update:show', value: boolean): void
}>()

const showTooltip = ref<ComponentType | undefined>()

const tooltipPosition = ref({
  x: 0,
  y: 0,
  width: 0,
})

const getInstallProgress = (component?: ComponentType) =>
  component ? componentStore[component].installerProgress : 0

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
      return '已安装'
    case 'upgradable':
      return '更新'
    case 'upgrading':
      return '正在更新'
    case 'need-restart':
      return '重启'
    case 'uninstalling':
      return '正在卸载'
  }
}

const installerStatusText = (status: InstallerStatus) => {
  switch (status) {
    case 'downloading':
      return '下载中...'
    case 'extracting':
      return '解压中...'
    case 'restart':
      return '重启'
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
    case 'not-compatible': {
      window.main.ComponentManager.install(component)
      break
    }
    case 'upgradable': {
      window.main.ComponentManager.upgrade(component)
      break
    }
    case 'need-restart': {
      window.main.Util.restart()
      break
    }
    default:
      return
  }
  if (componentStore[component].componentStatus === 'upgradable') {
    componentStore.updateComponentStatus(component, {
      componentStatus: 'upgrading',
    })
  } else {
    componentStore.updateComponentStatus(component, {
      componentStatus: 'installing',
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
    width: rect.width,
  }
}

const handleMouseLeave = () => {
  showTooltip.value = undefined
}

const components: ComponentType[] = ['Maa App', 'Maa Core', 'Android Platform Tools']

type ComponentSources = {
  [key in ComponentType]: string[]
}

const componentsSources: Ref<ComponentSources> = ref({
  'Maa App': [],
  'Maa Core': [],
  'Android Platform Tools': [],
})

async function uninstallComponent(component: ComponentType) {
  try {
    componentStore.updateComponentStatus(component, {
      componentStatus: 'uninstalling',
    })
    await removeComponent(component)
    componentStore.updateComponentStatus(component, {
      componentStatus: 'not-installed',
    })
    message.success(`${t(`download["${component}"]`)}已卸载`)
  } catch (e) {
    logger.error(`Error while uninstall ${component}: ${e}`)
  }
}

async function moveComponentDir() {
  const result = await openDialog('选择目录', ['openDirectory'], [])
  if (result.canceled) {
    return
  }
  const path = result.filePaths[0]
  const withError = await moveComponentBaseDir(path)
  settingStore.updateComponentBaseDir(path)
  if (withError) {
    message.warning('在移动过程中出现错误，这并不会影响组件的使用，但是可能会存在残留，需要退出MaaX后手动删除')
  } else {
    message.success('移动成功')
  }

  dialog.info({
    title: '提示',
    content: '需要重启MaaX才能生效',
    positiveText: '现在重启',
    negativeText: '以后再说',
    onPositiveClick: () => {
      window.main.Util.restart()
    },
  })
}

onMounted(() => {
  Promise.all(
    components.map(
      component =>
        new Promise<void>(resolve => {
          window.main.ComponentManager.getStatus(component)
            .then((status: ComponentStatus | undefined) => {
              if (status) {
                componentStore.updateComponentStatus(component, {
                  componentStatus: status,
                })
              }
              resolve()
            })
            .catch(() => resolve())
        })
    )
  )
  Promise.all(
    components.map(
      component =>
        new Promise<void>(resolve => {
          window.main.ComponentManager.getAvailableMirrors(component)
            .then((sources: string[]) => {
              componentsSources.value[component] = sources
              resolve()
            })
            .catch(() => resolve())
        })
    )
  )
})
</script>

<template>
  <NModal :show="props.show" :closable="false" :style="{ width: '600px' }"
    @update:show="value => $emit('update:show', value)">
    <NCard title="组件安装和升级">
      <NSpace vertical>
        <div class="download-card">
          <NCollapse class="download-info">
            <NCollapseItem>
              <template #header>
                <span>安装位置</span>
              </template>
              <template #header-extra>
                <NButton type="primary" size="small" class="collapse-header-button"
                  @click="event => { event.stopPropagation(); moveComponentDir() }">
                  移动
                </NButton>
              </template>
              <template #default>
                当前安装位置：{{ !!settingStore.componentDir?.length ? settingStore.componentDir : '默认' }}
              </template>
            </NCollapseItem>
          </NCollapse>
        </div>
        <NAlert type="info">
          {{ $t('download.needInstallAll') }}
        </NAlert>
        <div v-for="component of components" :key="component" class="download-card"
          @mouseenter="event => handleMouseEnter(event, component)" @mouseleave="handleMouseLeave">
          <NProgress :percentage="componentStore[component].installerProgress * 100" :border-radius="0" :height="4"
            :show-indicator="false" :rail-color="'transparent'" />
          <NCollapse class="download-info">
            <NCollapseItem>
              <template #header>
                <NSpace class="download-title" align="center">
                  <span>{{ $t(`download["${component}"]`) }}</span>
                </NSpace>
              </template>
              <template #header-extra>
                <div v-if="['installing', 'upgrading', 'installed'].includes(
                  componentStore[component].componentStatus
                )
                  " class="download-status">
                  {{
                    [
                      installButtonText(componentStore[component].componentStatus),
                      installerStatusText(componentStore[component].installerStatus),
                    ]
                      .filter(text => !!text)
                      .join(' - ')
                  }}
                </div>
                <NPopconfirm v-else :disabled="!isTasking" @positive-click="() => handleInstall(component)">
                  <template #trigger>
                    <NButton type="primary" :secondary="componentStore[component].componentStatus === 'installed'"
                      size="small" @click="(event) => { event.stopPropagation(); handleInstallButtonClick(component) }"
                      class="collapse-header-button">
                      {{ installButtonText(componentStore[component].componentStatus) }}
                    </NButton>
                  </template>
                </NPopconfirm>
              </template>
              <template #default>
                <div class="advanced-options">
                  <NSpace align="center">
                    <span>下载源：</span>
                    <NSelect v-model:value="componentStore[component].installMirror" size="small" placeholder="选择镜像"
                      :options="componentsSources[component].map(source => ({ label: source, value: source }))
                        " />
                  </NSpace>
                  <NSpace v-if="component !== 'Maa App'">
                    <NPopconfirm @positive-click="() => uninstallComponent(component)">
                      <template #trigger>
                        <NButton type="error" :disabled="componentStore[component].componentStatus !== 'installed'"
                          :loading="componentStore[component].componentStatus === 'uninstalling'">
                          卸载
                        </NButton>
                      </template>
                      <template #default>
                        <span>确认卸载 {{ $t(`download["${component}"]`) }} 吗？</span>
                      </template>
                    </NPopconfirm>
                  </NSpace>
                </div>
              </template>
            </NCollapseItem>
          </NCollapse>
        </div>
      </NSpace>
      <NTooltip trigger="manual" :x="tooltipPosition.x + getInstallProgress(showTooltip) * tooltipPosition.width"
        :y="tooltipPosition.y" :show="!!showTooltip &&
          ['installing', 'upgrading'].includes(componentStore[showTooltip].componentStatus)
          ">
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
  padding: 12px 20px;
  box-sizing: border-box;
}

.advanced-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
