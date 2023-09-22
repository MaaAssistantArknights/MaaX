<script setup lang="ts">
import { useSeperateTaskStore } from '@/store/seperateTask'
import { getItemBorderedImage, getOperatorAvatar } from '@/utils/game_image'
import { showMessage } from '@/utils/message'
import { items } from '@common/ArknightsGameData/zh_CN/gamedata/excel/item_table.json'
import type { GetTask } from '@type/task'
import { AsstMsg, type CallbackMapper, type SubTaskExtraInfoMapper } from '@type/task/callback'
import { NAvatar, NButton, NCard, NSwitch, NTag, NTooltip } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

type DepotResult = SubTaskExtraInfoMapper['DepotInfo']

const route = useRoute()
const seperateTaskStore = useSeperateTaskStore()

const rareColor = {
  0: 'grey',
  1: '#d3db2e',
  2: '#09b3f7',
  3: '#d8b3d8',
  4: '#ffc90e',
  5: '#ff7f27',
} as const

const currentUuid = route.params.uuid as string

const processing = ref(false)
const taskId = ref(-1)
const result = ref<DepotResult | null>(null)

async function doDepot() {
  const arg: GetTask<'Depot'>['configurations'] = {}
  processing.value = true
  taskId.value = await window.main.CoreLoader.appendTask({
    uuid: currentUuid,
    type: 'Depot',
    params: {
      enable: true,
      ...arg,
    },
  })
  const h = seperateTaskStore.register(currentUuid, taskId.value, (msg, data) => {
    if (data.taskchain !== 'Depot') {
      return false
    }
    switch (msg) {
      case AsstMsg.SubTaskExtraInfo: {
        const d = data as CallbackMapper[AsstMsg.SubTaskExtraInfo]
        if (d.what === 'DepotInfo') {
          result.value = d.details
        }
        return true
      }
      case AsstMsg.SubTaskError:
        showMessage('识别失败, 是不是没有进入仓库界面呢?')
        seperateTaskStore.unregister(currentUuid, taskId.value, h)
        processing.value = false
        return true
      case AsstMsg.SubTaskCompleted: {
        const d = data as CallbackMapper[AsstMsg.SubTaskCompleted]
        if (d.subtask === 'DepotRecognitionTask') {
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
      <div class="DepotResultHeader">
        <div class="DepotResultTitle">仓库识别</div>

        <div class="DepotResultOptions">
          <NButton @click="doDepot()" :disabled="processing">识别</NButton>
        </div>
      </div>
    </template>

    <div class="DepotResultPanel">
      <div
        class="DepotResultLayer"
        :class="{
          __Processing: processing,
        }"
      ></div>
      <div class="DepotResultContent">
        <div
          class="DepotResultItem"
          v-for="item in result?.arkplanner.object.items
          // .sort((a, b) => (items[b.id as keyof typeof items].rarity - items[a.id as keyof typeof items].rarity))
          .sort((a, b) => (items[a.id as keyof typeof items].sortId - items[b.id as keyof typeof items].sortId))
          // .sort((a, b) => a.id.localeCompare(b.id))
          ?? []"
          :key="item.id"
        >
          <NTooltip trigger="hover">
            <template #trigger>
              <NAvatar
                :src="getItemBorderedImage(item.name)"
                :style="{
                border: `2px solid ${rareColor[items[item.id as keyof typeof items].rarity as keyof typeof rareColor] ?? 'wheat'}`,
              }"
                size="large"
              ></NAvatar>
            </template>

            {{ item.name }}
          </NTooltip>
          <span class="DepotResultCount"> {{ item.have }} </span>
        </div>
      </div>
    </div>
  </NCard>
</template>

<style lang="less" scoped>
.DepotResultHeader {
  display: flex;
  flex-direction: column;
  align-items: center;

  .DepotResultTitle {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .DepotResultOptions {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
}

.DepotResultPanel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;

  .DepotResultLayer {
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

  .DepotResultContent {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(6, 1fr);

    & .DepotResultItem {
      display: flex;
      gap: 4px;
      align-items: center;

      & .DepotResultCount {
        font-size: larger;
      }
    }
  }
}
</style>
