<script setup lang="ts">
import { NButton, NGrid, NGridItem, NList, NListItem, NSpace, NText } from 'naive-ui'

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
</script>

<template>
  <div v-if="props.results.recruits">
    <NSpace vertical>
      <NList :style="{ background: 'transparent' }">
        <NListItem v-for="(recruit, index) of props.results.recruits" :key="index">
          <NSpace align="center" justify="space-around">
            <NText :type="recruit.refreshed ? 'info' : 'default'">
              {{ recruit.refreshed ? '已刷新' : `${recruit.level}星干员` }}
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
  </div>
  <div v-else class="progress-form no-progress">
    <NText> 暂时没有公开招募数据 Σ(っ °Д °;)っ </NText>
  </div>
</template>

<style lang="less" scoped>
.no-progress {
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: center;
}
</style>
