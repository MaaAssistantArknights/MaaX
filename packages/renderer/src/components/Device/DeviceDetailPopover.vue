<script lang="ts" setup>
import { NPopover, NImage, NInput, NIcon, NDescriptions, NDescriptionsItem, NDivider } from 'naive-ui'
import useDeviceStore from '@/store/devices'
import { ref, watch } from 'vue'
import logger from '@/hooks/caller/logger'
import IconPencilAlt from '@/assets/icons/pencil-alt.svg?component'

const deviceStore = useDeviceStore()

const props = defineProps<{
  uuid: string;
}>()

// const emit = defineEmits(['update:show'])
const show = ref(false)

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
  if (timer) clearInterval(timer)
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

watch(show, (newShowValue) => {
  if (newShowValue) {
    startGetScreenshot()
  } else {
    stopGetScreenshot()
  }
})

const updateDisplayName = (displayName: string) => {
  deviceStore.updateDeviceDisplayName(props.uuid, displayName)
}

</script>

<template>
  <NPopover v-model:show="show" :duration="500">
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
        <NDescriptionsItem label="name">
          <NInput
            v-model:value="device.displayName"
            minlength="1"
            maxlength="11"
            @update:value="updateDisplayName"
          >
            <template #prefix>
              <NIcon :component="IconPencilAlt" />
            </template>
          </NInput>
        </NDescriptionsItem>
        <NDescriptionsItem label="uuid">
          {{ device.uuid }}
        </NDescriptionsItem>
        <NDescriptionsItem label="address">
          {{ device.address }}
        </NDescriptionsItem>
      </NDescriptions>

      <NDivider />
      <NImage
        width="320"
        height="180"
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
