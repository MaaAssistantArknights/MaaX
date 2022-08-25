<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NFormItem, NCheckbox } from 'naive-ui'
import _ from 'lodash'

import MallSelect from '../MallSelect.vue'

const showModal = ref(false)

const socialShopItems = [
  '龙门币',
  '家具零件',
  '招聘许可',
  '加急许可',
  '赤金',
  '基础作战记录',
  '初级作战记录',
  '技巧概要·卷1',
  '技巧概要·卷2',
  '碳',
  '碳素',
  '源岩',
  '代糖',
  '酯原料',
  '异铁碎片',
  '双酮',
  '破损装置',
  '固源岩',
  '糖',
  '聚酸酯',
  '异铁',
  '酮凝集',
  '装置'
]

interface MallConfiguration {
  blacklist: string[]
  buyFirst: string[]
  shopping: boolean
}

const props = defineProps<{
  configurations: MallConfiguration;
}>()

const blacklist = computed(() => props.configurations.blacklist)
const buyFirst = computed(() => props.configurations.buyFirst)

const otherItems = computed(() => {
  return _.difference(
    socialShopItems, [
      ...props.configurations.buyFirst,
      ...props.configurations.blacklist
    ])
})

function onItemChange (key: string, items: string[]) {
  _.set(props.configurations, key, items)
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
        :buy-first="buyFirst"
        :blacklist="blacklist"
        :others="otherItems"
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
