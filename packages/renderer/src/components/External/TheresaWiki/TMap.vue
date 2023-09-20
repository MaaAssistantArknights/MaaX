<script setup lang="ts">
import { onUnmounted } from 'vue'
import { onMounted } from 'vue'
import { ref } from 'vue'

import type { MapState, RecvMsg, SendMsg, TileClickData } from './types'

defineProps<{
  stageId: string
}>()

const emits = defineEmits<{
  mapReady: []
  tileClick: [data: TileClickData]
}>()

defineExpose({
  checkMap,
  setMapState,
})

function genId() {
  // https://github.com/martinwang2002/Theresa-wiki/blob/master/src/models/utils/messenger.ts#L183
  return Math.random().toString(36).slice(2, 6)
}

const frame = ref<HTMLIFrameElement | null>(null)

function listener(ev: MessageEvent<RecvMsg>) {
  const { data } = ev
  // console.log(data)
  if (!data) {
    return
  }
  if (typeof data.type !== 'string') {
    return
  }
  switch (data.type) {
    case 'mapReady':
      emits('mapReady')
      break
    case 'tileClick':
      emits('tileClick', data.data)
      break
  }
}

function checkMap() {
  const msg: SendMsg = {
    id: genId(),
    type: 'checkMap',
  }
  frame.value?.contentWindow?.postMessage(msg, '*')
}

function setMapState(state: MapState) {
  const msg: SendMsg = {
    id: genId(),
    type: 'setMapState',
    data: state,
  }
  frame.value?.contentWindow?.postMessage(msg, '*')
}

onMounted(() => {
  window.addEventListener('message', listener, false)
})

onUnmounted(() => {
  window.removeEventListener('message', listener)
})
</script>

<template>
  <iframe id="frame" ref="frame" :src="`https://theresa.wiki/widget/map/${stageId}/scene`">
  </iframe>
</template>

<style scoped>
#frame {
  border: none;
  width: 640px;
  height: 360px;
}
</style>
