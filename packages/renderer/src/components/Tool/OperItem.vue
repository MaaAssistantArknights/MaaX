<script setup lang="ts">
import { NAvatar } from 'naive-ui'
import { getOperatorAvatar, getSkillImage } from '@/utils/game_image'
import { getCharSkillCount, getCharSkillName, type Operator } from './utils'
import { computed } from 'vue'

const props = defineProps<{
  oper: Operator
}>()

const count = computed(() => {
  return getCharSkillCount(props.oper.name)
})
</script>

<template>
  <NAvatar size="large" :src="getOperatorAvatar(oper.name)"></NAvatar>
  <span> {{ oper.name }} </span>
  <template v-if="oper.skill">
    <NAvatar
      v-for="i in count"
      :key="i"
      size="large"
      :src="getSkillImage(getCharSkillName(oper.name, i as 1 | 2 | 3))"
      :style="`opacity: ${i === oper.skill ? 1 : 0.2};`"
    ></NAvatar>
    <div
      v-if="count < 3"
      :style="{
        gridColumn: `span ${3 - count}`,
      }"
    ></div>
  </template>
  <div v-else style="grid-column: span 3"></div>
</template>
