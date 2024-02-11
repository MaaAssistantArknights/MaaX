<script setup lang="ts">
import { NButton, NCheckbox, NFormItem, NSelect } from 'naive-ui'
import { inject, ref } from 'vue'

import type { GetConfig } from './types'

const showModal = ref(false)

type RAConfig = GetConfig<'ReclamationAlgorithm'>

const props = defineProps<{
  configurations: RAConfig
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

const modeOptions = [
  {
    label: '刷分与建造点，进入战斗直接退出',
    value: 0,
  },
  {
    label: '刷赤金，联络员买水后基地锻造',
    value: 1,
  },
]
</script>

<template>
  <div class="configuration-form">
    <NFormItem
      label="模式"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NSelect
        :disabled="configurationDisabled.re"
        :value="props.configurations.mode"
        :options="modeOptions"
        @update:value="value => handleUpdateConfiguration('mode', value)"
      />
    </NFormItem>
  </div>
</template>

<style lang="less" scoped>
.mall-configuration {
  text-align: left;
}

.item-group {
  display: flex;
  align-items: center;
}
</style>
