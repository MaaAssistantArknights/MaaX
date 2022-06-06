<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { gamedata } from '@/api'
import { NCard, NText, NTag, NSkeleton } from 'naive-ui'

const props = defineProps<{
  name: string;
  itemid: string;
}>()

const items: Ref<Api.Maa.Item[]> = ref([])

const info: Ref<Api.Maa.Item | undefined> = ref()
const loading = ref(true)

onMounted(async () => {
  const itemApi = await gamedata.getAllItems()
  items.value = Object.values(itemApi.items) as unknown as Api.Maa.Item[]
  console.log(items)
  info.value = items.value.find(x => x.itemId === props.itemid)
  loading.value = false
})

</script>

<template>
  <NCard
    style="width: 300px;"
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
      <NText tag="div">{{ info?.usage }}</NText>
      <br />
      <NText tag="div">{{ info?.description }}</NText>
      <br />
      <NText depth="3" tag="div">获取方式</NText>
      <NText tag="div">{{ info?.obtainApproach }}</NText>
    </template>
  </NCard>
</template>
