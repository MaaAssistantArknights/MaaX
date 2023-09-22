<script setup lang="ts">
import { useSeperateTaskStore } from '@/store/seperateTask'
import { getItemBorderedImage, getOperatorAvatar } from '@/utils/game_image'
import { showMessage } from '@/utils/message'
import type { OneToSix } from '@type/game'
import type { GetTask } from '@type/task'
import { AsstMsg, type CallbackMapper, type SubTaskExtraInfoMapper } from '@type/task/callback'
import { NAvatar, NButton, NCard, NSwitch, NTag, NTooltip } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { OperFilter, OperOrder, RealLimited } from './opers'

type OperBoxResult = SubTaskExtraInfoMapper['OperBoxInfo']

const route = useRoute()
const seperateTaskStore = useSeperateTaskStore()

const operColor = {
  1: 'grey',
  2: '#d3db2e',
  3: '#09b3f7',
  4: '#d8b3d8',
  5: '#ffc90e',
  6: '#ff7f27',
} as const

const currentUuid = route.params.uuid as string

const processing = ref(false)
const taskId = ref(-1)
const result = ref<OperBoxResult | null>(null)

const onlyShowHighlight = ref(true)
const highlightOwned = ref(true)
const hideRealLimited = ref(true)

function isHighlight(own: boolean) {
  return own ? highlightOwned.value : !highlightOwned.value
}

function isShow(own: boolean, limited: boolean) {
  if (!own && limited && hideRealLimited.value) {
    return false
  }
  return !onlyShowHighlight.value || isHighlight(own)
}

const owned = computed(() => {
  if (!result.value) {
    return null
  }
  const res: Record<
    OneToSix,
    {
      name: string
      own: boolean
      id: number
      lim: boolean
    }[]
  > = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  }
  result.value.all_opers
    .filter(oper => !OperFilter.includes(oper.name))
    .forEach(oper => {
      res[oper.rarity].push({
        name: oper.name,
        own: oper.own,
        id: OperOrder.indexOf(oper.name),
        lim: RealLimited.includes(oper.name),
      })
    })
  for (let i = 1; i <= 6; i++) {
    res[i as OneToSix] = res[i as OneToSix].sort((a, b) => {
      return a.id - b.id
    })
  }
  return res
})

async function doOperBox() {
  const arg: GetTask<'OperBox'>['configurations'] = {}
  processing.value = true
  taskId.value = await window.main.CoreLoader.appendTask({
    uuid: currentUuid,
    type: 'OperBox',
    params: {
      enable: true,
      ...arg,
    },
  })
  const h = seperateTaskStore.register(currentUuid, taskId.value, (msg, data) => {
    if (data.taskchain !== 'OperBox') {
      return false
    }
    console.log(msg, data)
    switch (msg) {
      case AsstMsg.SubTaskExtraInfo: {
        const d = data as CallbackMapper[AsstMsg.SubTaskExtraInfo]
        if (d.what === 'OperBoxInfo') {
          result.value = d.details
        }
        return true
      }
      case AsstMsg.SubTaskError:
        showMessage('识别失败, 是不是没有进入干员界面呢?')
        seperateTaskStore.unregister(currentUuid, taskId.value, h)
        processing.value = false
        return true
      case AsstMsg.SubTaskCompleted: {
        const d = data as CallbackMapper[AsstMsg.SubTaskCompleted]
        if (d.subtask === 'OperBoxRecognitionTask') {
          seperateTaskStore.unregister(currentUuid, taskId.value, h)
          processing.value = false
          return true
        }
        return false
      }
    }
    return false
  })
  await window.main.CoreLoader.start({
    uuid: currentUuid,
  })
}
</script>

<template>
  <NCard :bordered="false">
    <template #header>
      <div class="OperBoxResultHeader">
        <div class="OperBoxResultTitle">干员识别</div>

        <div class="OperBoxResultOptions">
          <div>
            <span> {{ highlightOwned ? '高亮已拥有干员' : '高亮未拥有干员' }} </span>
            <NSwitch v-model:value="highlightOwned"></NSwitch>
          </div>
          <div>
            <span>仅显示高亮</span>
            <NSwitch v-model:value="onlyShowHighlight"></NSwitch>
          </div>
          <div>
            <span>隐藏真限定</span>
            <NSwitch v-model:value="hideRealLimited"></NSwitch>
          </div>
          <NButton @click="doOperBox()" :disabled="processing">识别</NButton>
        </div>
      </div>
    </template>

    <div class="OperBoxResultPanel">
      <div
        class="OperBoxResultLayer"
        :class="{
          __Processing: processing,
        }"
      ></div>
      <div class="OperBoxResultContent">
        <div v-for="i in 6" :key="i" class="OperBoxResultContentRow">
          <div
            v-for="oper in owned?.[(7 - i) as OneToSix] ?? []"
            :key="oper.name"
            :class="{
              Hide: !isShow(oper.own, oper.lim),
            }"
            class="OperBoxResultContentItem"
          >
            <NTooltip trigger="hover">
              <template #trigger>
                <NAvatar
                  v-show="isShow(oper.own, oper.lim)"
                  :src="getOperatorAvatar(oper.name)"
                  :style="{
                  border: `2px solid ${operColor[(7 - i) as OneToSix]}`,
                  opacity: isHighlight(oper.own) ? 1 : 0.4,
                  transition: 'opacity 0.5s',
                }"
                ></NAvatar>
              </template>

              {{ oper.name }}
            </NTooltip>
          </div>
        </div>
        <!-- {{ result?.all_opers }} -->
      </div>
    </div>
  </NCard>
</template>

<style lang="less" scoped>
.OperBoxResultHeader {
  display: flex;
  flex-direction: column;
  align-items: center;

  .OperBoxResultTitle {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .OperBoxResultOptions {
    display: flex;
    width: 100%;
    justify-content: space-around;

    & > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.OperBoxResultPanel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;

  .OperBoxResultLayer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: black;
    opacity: 0;
    z-index: 1;
    pointer-events: none;
    transition: opacity 0.5s;

    &.__Processing {
      opacity: 0.2;
      pointer-events: all;
    }
  }

  .OperBoxResultContent {
    display: flex;
    flex-direction: column;
    gap: 16px;

    & > .OperBoxResultContentRow {
      display: flex;
      flex-wrap: wrap;

      & > .OperBoxResultContentItem {
        margin-right: 8px;
        width: 50px;
        transition: width 0.5s, margin 0.5s;

        &.Hide {
          margin: 0px;
          width: 0px;
        }
      }
    }
  }
}
</style>
