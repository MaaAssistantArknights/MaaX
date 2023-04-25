<script lang="ts" setup>
import {
  NModal,
  NCard,
  NDivider
} from 'naive-ui'

import MallItems from '@/components/Task/MallItems.vue'
import { ref } from 'vue'
import _ from 'lodash'

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

const props = defineProps<{
  show: boolean
  buy_first: string[]
  blacklist: string[]
}>()

const buy_first = ref(props.buy_first)
const blacklist = ref(props.blacklist)

const others = ref(
  _.difference(
    socialShopItems, [
      ...buy_first.value,
      ...blacklist.value
    ]
  )
)

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void
  (event: 'update:item', item: {
    buy_first: string[], blacklist: string[]
  }): void
}>()

function handleUpdate () {
  emit('update:item', { buy_first: buy_first.value, blacklist: blacklist.value })
}

</script>

<template>
  <NModal :show="props.show" @update:show="value => $emit('update:show', value)">
    <NCard
      style="width: 600px"
      title="信用购买"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <MallItems v-model:items="buy_first" text="优先购买" @updated="handleUpdate" />
      <NDivider />
      <MallItems v-model:items="blacklist" text="黑名单" @updated="handleUpdate" />
      <NDivider />
      <MallItems v-model:items="others" text="随缘购买" />
    </NCard>
  </NModal>
</template>
