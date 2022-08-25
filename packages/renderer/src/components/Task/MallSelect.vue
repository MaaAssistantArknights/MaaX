<script lang="ts" setup>
import {
  NModal,
  NCard,
  NDivider
} from 'naive-ui'

import MallItems from '@/components/Task/MallItems.vue'

const props = defineProps<{
  show: boolean;
  buyFirst: string[];
  blacklist: string[];
  others: string[];
}>()

const emit = defineEmits(['update:show', 'update:item'])

function handleChange (key: 'buyFirst' | 'blacklist', items: string[]) {
  emit('update:item', key, items)
}

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
        @update:items="items => handleChange('buyFirst', items)"
      />
      <NDivider />
      <MallItems
        text="黑名单"
        :items="props.blacklist"
        @update:items="items => handleChange('blacklist', items)"
      />
      <NDivider />
      <MallItems
        text="随缘购买"
        :items="props.others"
      />
    </NCard>
  </NModal>
</template>
