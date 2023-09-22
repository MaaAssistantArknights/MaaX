<script lang="ts" setup>
import _ from 'lodash'
import { NSpace } from 'naive-ui'
import { computed } from 'vue'

import ItemCircle from '../ItemCircle.vue'

interface DropItem {
  itemId: string
  itemName: string
  quantity: number
}
interface FightInfo {
  drops: (DropItem & { dropType: string })[] // 本次掉落
  stage: {
    stageId: string
    stageCode: string
  }
  stars: number
  stats: DropItem[] // 总计掉落
}

interface FightingResult {
  fightInfo: FightInfo[]
}

const props = defineProps<{
  results: FightingResult
}>()

const totalDrops = computed(() => _.last(props.results.fightInfo)?.stats)
</script>

<template>
  <NSpace vertical class="progress-form">
    <NSpace
      v-for="(result, rindex) of props.results.fightInfo"
      :key="rindex"
      align="center"
      justify="center"
    >
      <span>{{ `作战 #${rindex + 1}` }}</span>
      <span>{{ result.stage.stageCode }}</span>
      <ItemCircle
        v-for="(item, iindex) of result.drops"
        :key="iindex"
        :name="item.itemName"
        :count="item.quantity"
        :height="50"
        :width="50"
      />
    </NSpace>
    <NSpace v-if="totalDrops" align="center" justify="center">
      <span>总计掉落</span>
      <ItemCircle
        v-for="(item, iindex) of totalDrops"
        :key="iindex"
        :name="item.itemName"
        :count="item.quantity"
        :height="50"
        :width="50"
      />
    </NSpace>
  </NSpace>
</template>
