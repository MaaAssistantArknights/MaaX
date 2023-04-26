<script lang="ts" setup>
import { NPopover, NImage, NScrollbar, NText } from 'naive-ui'
import ItemCard from './ItemCard.vue'
import { getItemBorderedImage } from '@/utils/game_image'

const props = defineProps<{
  name: string
  count?: number
  width?: number
  height?: number
}>()
</script>
<template>
  <NPopover trigger="hover">
    <template #trigger>
      <div :style="{ position: 'relative' }">
        <NImage
          :width="props.width"
          :height="props.height"
          :src="getItemBorderedImage(props.name)"
          :preview-disabled="true"
        />
        <NText v-if="props.count" class="item-count">
          {{ props.count }}
        </NText>
      </div>
    </template>
    <NScrollbar :style="{ maxHeight: '30vh' }">
      <ItemCard :name="props.name" />
    </NScrollbar>
  </NPopover>
</template>

<style lang="less" scoped>
.item-count {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 12px;
  padding: 2px;
}
</style>
