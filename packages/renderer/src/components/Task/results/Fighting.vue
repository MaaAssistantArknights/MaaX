<script lang="ts" setup>
import { ref } from 'vue'
import useTaskStore from '@/store/tasks'
import ItemCard from '../ItemCard.vue'

interface DropItem {
  itemId: string
  itemName: string
  quantity: number
}
interface FightInfo {
  drops: (DropItem & {dropType: string})[] // 本次掉落
  stage: {
    stageId: string
    stageCode: string
  }
  stars: number
  stat: DropItem[] // 总计掉落
}

interface FightingResult {
  fightInfo: FightInfo[]
}

const props = defineProps<{
  result: FightingResult;
}>()

</script>

<template>
  <div>Fighting Task Progress</div>
</template>
