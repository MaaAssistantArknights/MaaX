<script lang="ts" setup>
import {
  NSpace,
  NText,
  NGrid,
  NGridItem,
  NButton,
  NList,
  NListItem
} from 'naive-ui'

interface RecruitResult {
  tags: string[]
  level: number
  refreshed: boolean
  selectedTags: string[]
}

const props = defineProps<{
  results: {
    recruits: RecruitResult[]
  }
}>()

console.log(props)
</script>

<template>
  <NSpace vertical>
    <NList :style="{ background: 'transparent' }">
      <NListItem
        v-for="(recruit, index) of props.results.recruits"
        :key="index"
      >
        <NSpace align="center" justify="space-around">
          <NText :type="recruit.refreshed ? 'info' : 'default'">
            {{ recruit.refreshed ? "已刷新" : `${recruit.level}星干员` }}
          </NText>
          <NGrid x-gap="6" y-gap="8" :cols="3">
            <NGridItem v-for="tag of recruit.tags" :key="tag">
              <NButton
                size="tiny"
                secondary
                :type="recruit.selectedTags.includes(tag) ? 'info' : 'default'"
              >
                {{ tag }}
              </NButton>
            </NGridItem>
          </NGrid>
        </NSpace>
      </NListItem>
    </NList>
  </NSpace>
</template>
