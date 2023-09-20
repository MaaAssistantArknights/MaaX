<script setup lang="ts">
import { gamedata } from '@/api'
import type { Item, Stage } from '@type/api/maa'
import { NCard, NSkeleton, NTag, NText } from 'naive-ui'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  name: string
}>()

const items = ref<Item[]>([])
const stages = ref<Stage[]>([])

const info = ref<Item | undefined>()
const loading = ref(true)

onMounted(async () => {
  const itemApi = await gamedata.getAllItems()
  const stageApi = await gamedata.getAllStages()
  stages.value = Object.values(stageApi.stages) as unknown as Stage[]
  items.value = Object.values(itemApi.items) as unknown as Item[]
  const itemid = Object.values(itemApi.items).find(item => item.name === props.name)?.itemId
  info.value = items.value.find(x => x.itemId === itemid)
  loading.value = false
})

// function getStageInfo (stageId: string): Stage | undefined {
//   return stages.value.find(stage => stage.stageId === stageId)
// }
</script>

<template>
  <NCard
    style="width: 300px"
    :content-style="{ padding: '4px' }"
    :header-style="{ padding: '4px' }"
    :bordered="false"
  >
    <template #header>
      <NSkeleton v-if="loading" width="33%" text />
      <template v-else>
        <NTag>{{ info?.name }}</NTag>
      </template>
    </template>
    <NSkeleton v-if="loading" :repeat="5" text />
    <template v-else>
      <NText tag="div">
        {{ info?.usage }}
      </NText>
      <br />
      <NText tag="div">
        {{ info?.description.replaceAll('\\n', '') }}
      </NText>
      <br />
      <NText depth="3" tag="div"> 获取方式 </NText>
      <NText tag="div">
        {{
          info?.obtainApproach || ((info?.stageDropList ?? []).length !== 0 ? '关卡掉落' : '未知')
        }}
      </NText>
      <!-- <NSpace
        v-for="(dropList, index) in (info?.stageDropList ?? [])"
        :key="index"
      >
        <NText tag="div">
          {{ getStageInfo(dropList.stageId)?.code }}
        </NText>
        <NText tag="div">
          {{ getStageInfo(dropList.stageId)?.name }}
        </NText>
      </NSpace> -->
    </template>
  </NCard>
</template>
