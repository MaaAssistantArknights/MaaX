<script lang="ts" setup>
import { MessageReactive, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

import useDeviceStore from '@/store/devices'
import useComponentStore from '@/store/components'
import useTaskStore from '@/store/tasks'
import { ref, Ref } from 'vue'

const { t } = useI18n()
const message = useMessage()
const deviceStore = useDeviceStore()
const componentStore = useComponentStore()
const taskStore = useTaskStore()

const connectMessage: Ref<MessageReactive | undefined> = ref()

deviceStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === 'updateDeviceStatus') {
    const [uuid, status] = args
    const device = store.devices.find(device => device.uuid === uuid)
    if (device) {
      if (status === 'connecting') {
        if (connectMessage.value) connectMessage.value.destroy()
        connectMessage.value = message.loading(
          t('device.connecting', { deviceName: device.displayName })
        )
      } else if (status === 'connected' && device.status !== 'tasking') {
        // TODO: 想办法过滤掉独立启动任务的情况
        // 设备连接后提示，但是如果设备状态是从 tasking 到 connected，不提示
        if (connectMessage.value) connectMessage.value.destroy()
        connectMessage.value = message.success(
          t('device.connected', { deviceName: device.displayName })
        )
      } else if (status === 'disconnected') {
        if (connectMessage.value) connectMessage.value.destroy()
        connectMessage.value = message.error(
          t('device.disconnected', { deviceName: device.displayName })
        )
      }
    }
  }
})

componentStore.$onAction(({ name, store, args, after, onError }) => {
  if (name === 'updateComponentStatus') {
    const [componentType, status] = args
    if (status.installerStatus === 'exception') {
      message.error(
        t('download.installFailed', {
          componentType: t(`download["${componentType}"]`),
        })
      )
    }
  }
})

taskStore.$onAction(({ name, store, args, after, onError }) => {})
</script>

<template>
  <slot />
</template>
