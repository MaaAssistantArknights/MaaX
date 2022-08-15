<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import {
  NModal,
  NCard,
  NDivider
} from 'naive-ui'

import MallItems from '@/components/Task/MallItems.vue'

interface Item {
  name: string,
  item_id: string,
  image: string
}

const props = defineProps<{
  show: boolean;
  buy_first: Item[];
  blacklist: Item[];
  others: Item[];
}>()

const emit = defineEmits(['update:show', 'onChange:Item'])

// const operators: Ref<any[]> = ref([])
const loading = ref(false)
// let buyFirstSortable: Sortable | undefined
// let blacklistSortable: Sortable | undefined
// let othersSortable: Sortable | undefined

function onItemChange () {
  emit('onChange:Item')
}

onMounted(async () => {
  console.log(props.others)
  loading.value = true

  loading.value = false
})

</script>

<template>
  <NModal
    :show="props.show"
    @update:show="(value) => $emit('update:show', value)"
  >
    <n-card
      style="width: 600px"
      title="信用购买"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <MallItems
        text="优先购买"
        :items="props.buy_first"
        @onChange:Item="onItemChange"
      />
      <n-divider />
      <MallItems
        text="黑名单"
        :items="props.blacklist"
        @onChange:Item="onItemChange"
      />
      <n-divider />
      <MallItems
        text="随缘购买"
        :items="props.others"
        @onChange:Item="onItemChange"
      />
    </n-card>
  </NModal>
</template>
