<script setup lang="ts">
import { NCheckbox, NPopover } from 'naive-ui'
import { maa as MaaApi } from '@common/api'
import ItemCard from './ItemCard.vue'

const props = defineProps<{
  name: string;
  checked: boolean;
}>()

const emit = defineEmits(['update:checked'])

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
          :src="MaaApi.gamedata.items.imageLink(props.name)"
          @click="emit('update:checked', !props.checked)"
        />
      </div>
    </template>
    <ItemCard :name="props.name" />
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
