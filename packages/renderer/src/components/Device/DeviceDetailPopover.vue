<script lang="ts" setup>
import {
  NPopover,
  NImage,
  NInput,
  NIcon,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NTooltip,
  NText,
} from 'naive-ui'
import useDeviceStore from '@/store/devices'
import { computed, ref, watch } from 'vue'
import logger from '@/hooks/caller/logger'
import IconPencilAlt from '@/assets/icons/pencil-alt.svg?component'
import type { Device } from '@type/device'

const deviceStore = useDeviceStore()

const props = defineProps<{
  uuid: string
}>()

// const emit = defineEmits(['update:show'])
const show = ref(false)

const device = computed(() => deviceStore.getDevice(props.uuid) as Device)
const screenshot = ref('')
let timer: NodeJS.Timer | null = null

const startGetScreenshot = async () => {
  logger.info('send get')
  window.ipcRenderer.on(
    'renderer.Device:getScreenshot',
    async (event, data) => {
      if (data.uuid === props.uuid) {
        const imageData = await window.ipcRenderer.invoke(
          'main.CoreLoader:getScreencap',
          { uuid: props.uuid }
        )
        screenshot.value = imageData.screenshot
      }
    }
  )
  if (timer) clearInterval(timer)
  timer = setInterval(async () => {
    logger.info('send asyncScreencap')
    await window.ipcRenderer.invoke('main.CoreLoader:asyncScreencap', {
      uuid: props.uuid,
    })
  }, 3000)
}

const stopGetScreenshot = () => {
  if (timer) clearInterval(timer)
  timer = null
  window.ipcRenderer.off('renderer.Device:getScreenshot', () => {})
}

const inputContent = ref('')

watch(show, newShowValue => {
  if (device.value.displayName !== undefined) {
    inputContent.value = device.value.displayName
  }
  // if (newShowValue) {
  //   startGetScreenshot()
  // } else {
  //   stopGetScreenshot()
  // }
})

const updateDisplayName = event => {
  if (inputContent.value === '') {
    if (device.value.displayName !== undefined) {
      inputContent.value = device.value.displayName
    } else inputContent.value = device.value.uuid
  }
  deviceStore.updateDeviceDisplayName(props.uuid, inputContent.value)
}
</script>

<template>
  <NPopover v-model:show="show" :duration="500">
    <template #trigger>
      <slot />
    </template>
    <template #default>
      <NDescriptions
        label-placement="top"
        label-align="left"
        :column="0"
        :bordered="false"
        style="max-width: fit-content"
      >
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 备注: </NText>
          </template>
          <NInput
            v-model:value="inputContent"
            maxlength="11"
            passively-activated
            @change="updateDisplayName"
          >
            <template #prefix>
              <NIcon :component="IconPencilAlt" />
            </template>
          </NInput>
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 设备标识符: </NText>
          </template>
          {{ device.uuid }}
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 连接地址: </NText>
          </template>
          {{ device.address.length > 0 ? device.address : '刷新以查看' }}
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 启动命令: </NText>
          </template>
          <NTooltip trigger="hover">
            <template #trigger>
              <NInput
                v-model:value="device.commandLine"
                type="textarea"
                placeholder="启动命令"
                :autosize="{ minRows: 3 }"
                style="min-width: 100%"
              >
                <template #prefix>
                  <NIcon :component="IconPencilAlt" />
                </template>
              </NInput>
            </template>
            模拟器自动启动命令, 非必要请不要修改这里的内容,
            留空将会在下一次链接时尝试自动获取
          </NTooltip>
        </NDescriptionsItem>
      </NDescriptions>

      <NDivider />
      <NImage width="320" height="180" src="screenshot" />
    </template>
  </NPopover>
</template>

<style scoped>
:deep(.n-input__input-el) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  padding-left: 5px !important;
  height: 15px !important;
}

:deep(.n-input) {
  --n-color: rgba(255, 255, 255, 0) !important;
}

:deep(.n-input__border) {
  border: none !important;
}

:deep(.n-input-wrapper) {
  padding: 0 !important;
}
</style>
