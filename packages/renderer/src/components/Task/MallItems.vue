<script lang="ts" setup>
import Sortable from 'sortablejs'
import {
  NImage,
  NText
} from 'naive-ui'
import { getItemBorderedImage } from '@/utils/game_image'
import { ref, Ref, onMounted } from 'vue'
import router from '@/router'

let sortable: Sortable | undefined
const sortableRef: Ref<HTMLElement | null> = ref(null)
const uuid = router.currentRoute.value.params.uuid as string

const props = defineProps<{
  text: string;
  items: string[]
}>()

const emit = defineEmits(['update:items'])

onMounted(async () => {
  if (sortableRef.value && !sortable) {
    sortable = new Sortable(sortableRef.value, {
      swapThreshold: 1,
      animation: 150,
      group: `${uuid}-mallitems`,
      store: {
        get: () => {
          return props.items
        },
        set: (sortable) => {
          emit('update:items', sortable.toArray())
        }
      }
    })
  }
})

</script>

<template>
  <NText>{{ text }}</NText>
  <div ref="sortableRef" :style="{ minHeight: '70px' }">
    <NImage
      v-for="(item, index) of props.items"
      :key="index"
      :width="70"
      class="item"
      :src="getItemBorderedImage(item)"
      :data-id="item"
    />
  </div>
</template>

<style lang="less" scoped>
.item {
  display: inline-block
}
</style>
