<script setup lang="ts">
import { inject } from 'vue'
import { NFormItem, NInput, NSelect, NSpace } from 'naive-ui'
import router from '@/router'
import useDeviceStore from '@/store/devices'
import type { GetConfig } from './types'

const deviceStore = useDeviceStore()

type EmulatorConfig = GetConfig<'Emulator'>

const delayOptions = [
  {
    value: 30,
    label: '30秒 - 不建议',
  },
  {
    value: 60,
    label: '一分钟',
  },
  {
    value: 120,
    label: '两分钟',
  },
  {
    value: 300,
    label: '五分钟',
  },
  {
    value: 600,
    label: '十分钟',
  },
]

const props = defineProps<{
  configurations: EmulatorConfig
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as (
  key: string,
  value: any,
  index: number
) => void

const configurationDisabled = inject('configurationDisabled') as {
  re: boolean
  nre: boolean
}

function handleUpdateConfiguration(key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

const routeUuid = router.currentRoute.value.params.uuid as string

const commandLine = deviceStore.getDevice(routeUuid)?.commandLine
if (commandLine) {
  handleUpdateConfiguration('commandLine', commandLine)
}
</script>
<template>
  <div class="configuration-form">
    <NSpace vertical>
      <NFormItem
        label="启动后延迟"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :disabled="configurationDisabled.nre"
          :value="props.configurations.delay"
          :options="delayOptions"
          @update:value="value => handleUpdateConfiguration('delay', value)"
        />
      </NFormItem>
      <NFormItem
        label="当前参数"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NInput
          :style="{ textAlign: 'left' }"
          spellcheck="false"
          type="textarea"
          :value="configurations.commandLine"
        />
      </NFormItem>
    </NSpace>
  </div>
</template>
