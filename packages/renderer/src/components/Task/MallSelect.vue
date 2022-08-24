<script lang="ts" setup>
import { onMounted } from 'vue'
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
  buyFirst: Item[];
  blacklist: Item[];
  others: Item[];
}>()

const emit = defineEmits(['update:show', 'change:item'])

function onItemChange () {
  emit('change:item')
}

onMounted(async () => {
  console.log(props.others)
})

</script>

<template>
  <NModal
    :show="props.show"
    @update:show="(value) => $emit('update:show', value)"
  >
    <NCard
      style="width: 600px"
      title="信用购买"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <MallItems
        text="优先购买"
        :items="props.buyFirst"
        @add="itemId => "
      />
      <NDivider />
      <MallItems
        text="黑名单"
        :items="props.blacklist"
        @update:item="onItemChange"
      />
      <NDivider />
      <MallItems
        text="随缘购买"
        :items="props.others"
        @update:item="onItemChange"
      />
    </NCard>
  </NModal>
</template>
