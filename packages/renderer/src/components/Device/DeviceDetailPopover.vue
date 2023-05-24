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
import { ref, onMounted, onUnmounted } from 'vue'
import logger from '@/hooks/caller/logger'
import IconPencilAlt from '@/assets/icons/pencil-alt.svg?component'
import type { Device } from '@type/device'
import ClickToEdit from '@/components/UtilComponents/ClickToEdit.vue'

const deviceStore = useDeviceStore()

const props = defineProps<{
  device: Device
}>()

// const emit = defineEmits(['update:show'])
const show = ref(false)

const screenshot = ref('')
let timer: number | null = null

async function gotScreenshot(event: Electron.IpcRendererEvent, data: { uuid: string }) {
  if (data.uuid === props.device.uuid) {
    const imageData = await window.ipcRenderer.invoke('main.CoreLoader:getScreencap', {
      uuid: props.device.uuid,
    })
    screenshot.value = imageData.screenshot
  }
}

const updateDisplayName = (displayName: string) => {
  deviceStore.updateDeviceDisplayName(props.device.uuid, displayName)
}

const updateCommandLine = (commandLine: string) => {
  deviceStore.updateCommandLine(props.device.uuid, commandLine)
}

onMounted(() => {
  // register event
  window.ipcRenderer.on('renderer.Device:getScreenshot', gotScreenshot)
  // start timer
  timer = window.setInterval(async () => {
    logger.info('send asyncScreencap')
    await window.ipcRenderer.invoke('main.CoreLoader:asyncScreencap', {
      uuid: props.device.uuid,
    })
  }, 3000)
})

onUnmounted(() => {
  // unregister event
  window.ipcRenderer.off('renderer.Device:getScreenshot', gotScreenshot)
  // stop timer
  if (timer) window.clearInterval(timer)
})
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
        style="min-width: 100%; max-width: 320px"
      >
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 备注: （双击可编辑）</NText>
          </template>
          <ClickToEdit
            :value="props.device.displayName ?? ''"
            @update:value="updateDisplayName"
            spellcheck="false"
          />
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 设备标识符: </NText>
          </template>
          <template #default>
            {{ props.device.uuid }}
          </template>
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 连接地址: </NText>
          </template>
          <template #default>
            {{ props.device.address.length > 0 ? props.device.address : '刷新以查看' }}
          </template>
        </NDescriptionsItem>
        <NDescriptionsItem>
          <template #label>
            <NText type="info"> 启动命令: （双击可编辑）</NText>
          </template>
          <NTooltip trigger="hover">
            <template #trigger>
              <ClickToEdit
                :value="props.device.commandLine ?? ''"
                @update:value="updateCommandLine"
                type="textarea"
                placeholder="未设置启动命令"
                :autosize="{ minRows: 1 }"
                style="min-width: 100%; padding: 0 4px"
                spellcheck="false"
              />
            </template>
            <template #default>
              模拟器自动启动命令, 非必要请不要修改这里的内容, 留空将会在下一次链接时尝试自动获取
            </template>
          </NTooltip>
        </NDescriptionsItem>
      </NDescriptions>
      <NDivider />
      <NImage width="320" height="180" src="screenshot" />
    </template>
  </NPopover>
</template>
