<script lang="ts" setup>
import Sortable from 'sortablejs'
import {
  NImage,
  NText
} from 'naive-ui'
import { ref, Ref, onMounted } from 'vue'
import router from '@/router'

interface Item {
  name: string,
  item_id: string,
  image: string
}

let sortable: Sortable | undefined
const sortableRef: Ref<HTMLElement | null> = ref(null)
const uuid = router.currentRoute.value.params.uuid as string

const props = defineProps<{
  text: string;
  items: Item[]
}>()

const emit = defineEmits(['add', 'remove'])

onMounted(() => {
  if (sortableRef.value && !sortable) {
    console.log('create sortable ' + `${uuid}-mallitems`)
    sortable = new Sortable(sortableRef.value, {
      swapThreshold: 1,
      animation: 150,
      group: `${uuid}-mallitems`,
      onAdd: (event) => {
        // this attribute must be string
        const targetItemId = event.item.getAttribute('data-id') as string
        emit('add', targetItemId)
      },
      onRemove: (event) => {
        const targetItemId = event.item.getAttribute('data-id') as string
        emit('remove', targetItemId)
      }
    })
  }
})

</script>

<template>
  <n-text>{{ text }}</n-text>
  <div ref="sortableRef" :style="{ minHeight: '70px' }">
    <n-image
      v-for="(element, index) of props.items"
      :key="index"
      width="70"
      :src="element.image"
      class="item"
      :data-id="element.item_id"
    />
  </div>
</template>

<style lang="less" scoped>
.item {
  display: inline-block
}
</style>
