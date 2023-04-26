<script lang="ts" setup>
import Draggable from 'vuedraggable'
import {
  NText,
  NImage
} from 'naive-ui'
import router from '@/router'
import { getItemBorderedImage } from '@/utils/game_image'

const uuid = router.currentRoute.value.params.uuid as string

const props = defineProps<{
  text: string;
  items: string[]
}>()

defineEmits<{
  (event: 'updated'): void
}>()

</script>

<template>
  <NText>{{ text }}</NText>
  <!-- Draggable组件在没有双向绑定的情况下会自动更新list中的内容，目前还不知道原理 -->
  <Draggable
    :group="`${uuid}-mallItems`"
    :list="props.items"
    :style="{ minHeight: '70px' }"
    :animation="200"
    :swap-threshold="1"
    item-key="item_id"
    @change="$emit('updated')"
  >
    <template #item="{ element }">
      <NImage
        :width="70"
        class="item"
        :src="getItemBorderedImage(element)"
        :preview-disabled="true"
      />
    </template>
  </Draggable>
</template>

<style lang="less" scoped>
.item {
  display: inline-block
}
</style>
