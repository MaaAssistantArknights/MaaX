<script setup lang="ts">
import { NCheckbox, NFormItem, NSelect } from 'naive-ui'
import { inject } from 'vue'
import type { GetConfig } from './types'

type StartUpConfig = GetConfig<'StartUp'>

const serverOptions = [
  {
    value: 'Official',
    label: 'CN-Official',
  },
  {
    value: 'BiliBili',
    label: 'CN-BiliBili',
  },
]

const props = defineProps<{
  configurations: StartUpConfig
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
</script>
<template>
  <div class="configuration-form">
    <NFormItem
      label="客户端类型"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NSelect
        :disabled="configurationDisabled.nre"
        :value="props.configurations.client_type"
        :options="serverOptions"
        @update:value="value => handleUpdateConfiguration('client_type', value)"
      />
    </NFormItem>
    <NFormItem
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :disabled="configurationDisabled.nre"
        :checked="props.configurations.start_game_enabled"
        @update:checked="
          checked => handleUpdateConfiguration('start_game_enabled', checked)
        "
      >
        自动启动客户端
      </NCheckbox>
    </NFormItem>
  </div>
</template>
