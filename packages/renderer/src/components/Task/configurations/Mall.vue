<script setup lang="ts">
import { ref, inject } from 'vue'
import { NButton, NFormItem, NCheckbox } from 'naive-ui'

import MallSelect from '../MallSelect.vue'

const showModal = ref(false)

interface MallConfiguration {
  blacklist: string[]
  buy_first: string[]
  shopping: boolean
}

const props = defineProps<{
  configurations: MallConfiguration
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

function handleItemUpdate(items: { buy_first: string[]; blacklist: string[] }) {
  for (const [key, list] of Object.entries(items)) {
    handleUpdateConfiguration(key, list)
  }
}
</script>

<template>
  <div class="configuration-form">
    <NFormItem
      label="自动购物"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :disabled="configurationDisabled.nre"
        :checked="props.configurations.shopping"
        @update:checked="
          checked => handleUpdateConfiguration('shopping', checked)
        "
      />
    </NFormItem>

    <NFormItem
      :show-label="false"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NButton
        quaternary
        type="primary"
        :focusable="false"
        :disabled="configurationDisabled.nre"
        @click="showModal = true"
      >
        管理购买选项...
      </NButton>
      <MallSelect
        v-model:show="showModal"
        :buy_first="props.configurations.buy_first"
        :blacklist="props.configurations.blacklist"
        @update:item="handleItemUpdate"
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
