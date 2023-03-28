<script lang="ts" setup>
import { NPopover, NImage, NInput, NIcon, NDescriptions, NDescriptionsItem, NDivider } from 'naive-ui'
import useDeviceStore from '@/store/devices'
import { ref } from 'vue'
import logger from '@/hooks/caller/logger'

const deviceStore = useDeviceStore()

const props = defineProps<{
  uuid: string;
}>()

const emit = defineEmits(['update:show'])

const device = deviceStore.getDevice(props.uuid) as Device
const screenshot = ref('')
let timer: NodeJS.Timer|null = null

const startGetScreenshot = async () => {
  logger.info('send get')
  window.ipcRenderer.on('renderer.Device:getScreenshot', async (event, data) => {
    if (data.uuid === props.uuid) {
      const imageData = await window.ipcRenderer.invoke('main.CoreLoader:getScreencap', { uuid: props.uuid })
      screenshot.value = imageData.screenshot
    }
  })
  timer = setInterval(async () => {
    logger.info('send asyncScreencap')
    await window.ipcRenderer.invoke('main.CoreLoader:asyncScreencap', { uuid: props.uuid })
  }, 3000)
}

const stopGetScreenshot = () => {
  if (timer) clearInterval(timer)
  timer = null
  window.ipcRenderer.off('renderer.Device:getScreenshot', () => {})
}

const onShow = async (show: boolean) => {
  logger.warn('in show')
  if (show) {
    startGetScreenshot()
  } else {
    stopGetScreenshot()
  }
}

const updateDisplayName = (displayName: string) => {
  deviceStore.updateDeviceDisplayName(props.uuid, displayName)
}

</script>

<template>
  <NPopover @update:show="onShow">
    <template #trigger>
      <slot />
    </template>
    <template #default>
      <NDescriptions
        label-placement="left"
        label-align="left"
        :column="1"
        :bordered="false"
        style="max-width: fit-content;"
      >
        <NDescriptionsItem label="uuid">
          {{ device.uuid }}
        </NDescriptionsItem>
        <NDescriptionsItem label="name">
          <NInput
            v-model:value="device.displayName"
            style="border: none !important;"
            @update:value="updateDisplayName"
          />
        </NDescriptionsItem>
      </NDescriptions>
      <NDivider />
      <NImage
        width="640"
        height="360"
        src="screenshot"
      />
    </template>
  </NPopover>
</template>

<style scoped>
:deep(.n-input__input-el) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 5px !important;
  height:15px !important;
}

:deep(.n-input){
  --n-color: rgba(255, 255, 255, 0) !important;
}

:deep(.n-input__border) {
  border:none !important;
}

:deep(.n-input-wrapper) {
  padding: 0 !important;
}
</style>
