<script lang="ts" setup>
import { NImage, NDescriptions, NDescriptionsItem, NDivider, NTooltip, NText } from 'naive-ui'
import { type Callback, AsstMsg, type CallbackMapper } from '@type/task/callback'
import { useIntervalFn } from '@vueuse/core'
import useDeviceStore from '@/store/devices'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import logger from '@/hooks/caller/logger'
import IconPencilAlt from '@/assets/icons/pencil-alt.svg?component'
import type { Device } from '@type/device'
import ClickToEdit from '@/components/UtilComponents/ClickToEdit.vue'
import { Call } from '@vicons/ionicons5'

const deviceStore = useDeviceStore()

const props = defineProps<{
  device: Device
}>()

const screenshot = ref('')
const interval = useIntervalFn(requestScreenshot, 3000, { immediate: false })

async function requestScreenshot() {
  logger.info('send asyncScreencap')
  await window.ipcRenderer.invoke('main.CoreLoader:asyncScreencap', {
    uuid: props.device.uuid,
  })
}

async function gotScreenshot(event: Electron.IpcRendererEvent, Callback: Callback) {
  const { code, data } = Callback
  if (code === AsstMsg.AsyncCallInfo && data.what === 'Screencap') {
    if (data.uuid === props.device.uuid && data.details.ret === true) {
      screenshot.value = await window.ipcRenderer.invoke('main.CoreLoader:getImage', {
        uuid: props.device.uuid,
      })
    }
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
  window.ipcRenderer.on('renderer.CoreLoader:callback', gotScreenshot)
  // start timer
  interval.resume()
})

onBeforeUnmount(() => {
  // unregister event
  window.ipcRenderer.off('renderer.CoreLoader:callback', gotScreenshot)
  // stop timer
  interval.pause()
})
</script>

<template>
  <div>
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
            模拟器自动启动命令, 非必要请不要修改这里的内容, 留空将会在下一次连接时尝试自动获取
          </template>
        </NTooltip>
      </NDescriptionsItem>
    </NDescriptions>
    <NDivider />
    <NImage style="width: 320px; height: 180px" :src="screenshot">
      <template #placeholder>
        <NText> 任务运行中可查看截图 </NText>
      </template>
    </NImage>
  </div>
</template>
