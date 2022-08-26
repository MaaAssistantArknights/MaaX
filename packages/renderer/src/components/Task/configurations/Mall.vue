<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NFormItem, NCheckbox } from 'naive-ui'
import _ from 'lodash'

import MallSelect from '../MallSelect.vue'

const showModal = ref(false)

interface MallConfiguration {
  blacklist: string[]
  buy_first: string[]
  shopping: boolean
}

const props = defineProps<{
  configurations: MallConfiguration;
}>()

function onItemChange (items: { buy_first: string[], blacklist: string[] }) {
  for (const [key, list] of Object.entries(items)) {
    _.set(props.configurations, key, list)
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
        :checked="props.configurations.shopping"
        @update:checked="
          (checked) =>
            _.set(props.configurations, 'shopping', checked)
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
        @click="showModal = true"
      >
        管理购买选项...
      </NButton>
      <MallSelect
        v-model:show="showModal"
        :buy_first="props.configurations.buy_first"
        :blacklist="props.configurations.blacklist"
        @update:item="onItemChange"
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
