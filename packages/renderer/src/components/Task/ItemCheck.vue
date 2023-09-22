<script setup lang="ts">
import { getItemBorderedImage } from '@/utils/game_image'
import { NCheckbox, NPopover, NScrollbar } from 'naive-ui'

// import { maa as MaaApi } from '@/api'
import ItemCard from './ItemCard.vue'

const props = defineProps<{
  name: string
  checked: boolean
  itemid: string
}>()

const emit = defineEmits<{
  (event: 'update:checked', value: boolean): void
}>()
</script>

<template>
  <NPopover display-directive="show">
    <template #trigger>
      <div class="item-check">
        <NCheckbox
          class="item-checkbox"
          :checked="props.checked"
          @update:checked="checked => emit('update:checked', checked)"
        />
        <img
          :src="getItemBorderedImage(props.name)"
          @click="emit('update:checked', !props.checked)"
        />
        <!-- <div>
          <NText>    {{ props.name }} </NText>
        </div> -->
      </div>
    </template>
    <NScrollbar :style="{ maxHeight: '50vh' }">
      <ItemCard :name="props.name" />
    </NScrollbar>
  </NPopover>
</template>

<style lang="less" scoped>
.item-check {
  display: inline-block;
  position: relative;
  padding: 4px;

  & > img {
    width: 60px;
    height: 60px;
    cursor: pointer;
  }
}

.item-checkbox {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
