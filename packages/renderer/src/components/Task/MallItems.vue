<script lang="ts" setup>
import draggable from 'vuedraggable'
import {
  NScrollbar,
  NImage,
  NText
} from 'naive-ui'

interface Item {
  name: string,
  item_id: string,
  image: string
}

const props = defineProps<{
  text: string;
  items: Item[]
}>()

const emit = defineEmits(['change:item'])

function onItemChange () {
  emit('change:item')
}

</script>

<template>
  <n-text>
    {{ text }}
  </n-text>
  <n-scrollbar
    x-scrollable
    :style="{ maxHeight: '20vh' }"
  >
    <draggable
      class="item-group"
      :list="props.items"
      group="mall"
      animation="100"
      item-key="name"
      @change="onItemChange"
    >
      <template #item="{ element }">
        <div :class="{ 'not-draggable': false }">
          <n-image
            width="70"
            :src="element.image"
          />
        </div>
      </template>
    </draggable>
  </n-scrollbar>
</template>

<style lang="less" scoped>
.item-group {
  display: flex;
  align-items: center;
}
</style>
