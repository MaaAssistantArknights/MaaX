<script setup lang="ts">
import { useRoute } from 'vue-router'
import { NAvatar, NButton, NCard, NSwitch, NTag, NTooltip } from 'naive-ui'
import { ref } from 'vue'
import { useSeperateTaskStore } from '@/store/seperateTask'
import { getOperatorAvatar } from '@/utils/game_image'
import { showMessage } from '@/utils/message'
import { AsstMsg, type CallbackMapper, type SubTaskExtraInfoMapper } from '@type/task/callback'
import type { GetTask } from '@type/task'

type RecruitResult = SubTaskExtraInfoMapper['RecruitResult']

const route = useRoute()
const seperateTaskStore = useSeperateTaskStore()

const currentUuid = route.params.uuid as string

const processing = ref(false)
const taskId = ref(-1)
const result = ref<RecruitResult | null>(null)

const useAvatar = ref(true)

const tagLevel: Record<string, 1 | 2 | 4 | 5 | 6> = {
  支援机械: 1,
  新手: 2,
  特种干员: 4,
  支援: 4,
  削弱: 4,
  位移: 4,
  爆发: 4,
  快速复活: 4,
  资深干员: 5,
  控场: 5,
  召唤: 5,
  高级资深干员: 6,
}

// TODO: 选个好点的颜色
const operColor = {
  1: 'grey',
  2: '#d3db2e',
  3: '#09b3f7',
  4: '#d8b3d8',
  5: '#ffc90e',
  6: '#ff7f27',
} as const

function tagColor(l: 1 | 2 | 3 | 4 | 5 | 6) {
  return {
    textColor: operColor[l],
    borderColor: operColor[l],
  }
}

function checkResult(res: RecruitResult['result'][number]) {
  const ls = res.opers.map(x => x.level)
  const checkOrder = [3, 2, 1, 4, 5, 6] as const
  for (const l of checkOrder) {
    if (ls.includes(l)) {
      return l
    }
  }
  return -1
}

async function doRecruit(selectTags: string[] = []) {
  const arg: GetTask<'Recruit'>['configurations'] = {
    select: [],
    confirm: [],
    times: 0,
    set_time: false,
    expedite: false,
    skip_robot: false,
  }
  processing.value = true
  taskId.value = await window.main.CoreLoader.appendTask({
    uuid: currentUuid,
    type: 'Recruit',
    params: {
      enable: true,
      ...arg,
    },
  })
  const h = seperateTaskStore.register(currentUuid, taskId.value, (msg, data) => {
    if (data.taskchain !== 'Recruit') {
      return false
    }
    switch (msg) {
      case AsstMsg.SubTaskExtraInfo: {
        const d = data as CallbackMapper[AsstMsg.SubTaskExtraInfo]
        if (d.what === 'RecruitResult') {
          result.value = d.details
        }
        return true
      }
      case AsstMsg.SubTaskError:
        showMessage('识别失败, 是不是没有进入公招界面呢?')
      // fallthrough
      case AsstMsg.SubTaskCompleted:
        seperateTaskStore.unregister(currentUuid, taskId.value, h)
        processing.value = false
        return true
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
      <div class="RecruitResultHeader">
        <div class="RecruitResultTitle">公招计算</div>

        <div class="RecruitResultOptions">
          <div class="RecruitResultOption">
            <div>显示头像</div>
            <NSwitch v-model:value="useAvatar"></NSwitch>
          </div>

          <NButton @click="doRecruit()" :disabled="processing">识别</NButton>
        </div>
      </div>
    </template>

    <div class="RecruitResultPanel">
      <div class="RecruitResultLayer" :class="{
        __Processing: processing,
      }"></div>
      <template v-if="result">
        <div class="RecruitTag">
          <div>识别结果</div>
          <NTag v-for="item in result.tags" :key="item" :color="tagColor(tagLevel[item] ?? 3)">
            {{ item }}
          </NTag>
        </div>
        <div class="RecruitResults">
          <div v-for="(res, idx) in result.result" :key="idx" class="RecruitResult">
            <div class="RecruitResultInfo">
              <div class="RecruitResultLevel">{{ checkResult(res) }} ★</div>
              <div class="RecruitResultTags">
                <NTag v-for="item in res.tags" :key="item" :color="tagColor(tagLevel[item] ?? 3)">
                  {{ item }}
                </NTag>
              </div>
              <!-- <div class="RecruitResultAction">
                <NButton @click="doRecruit(res.tags)">选择这个</NButton>
              </div> -->
            </div>
            <div class="RecruitResultOpers">
              <template v-if="useAvatar">
                <NTooltip v-for="oper in res.opers" :key="oper.name" trigger="hover">
                  <template #trigger>
                    <NAvatar :src="getOperatorAvatar(oper.name)" :style="{
                      border: `2px solid ${operColor[oper.level]}`,
                    }"></NAvatar>
                  </template>

                  {{ oper.name }}
                </NTooltip>
              </template>
              <template v-else>
                <NTooltip v-for="oper in res.opers" :key="oper.name" trigger="hover">
                  <template #trigger>
                    <NTag :color="{
                      textColor: operColor[oper.level],
                      borderColor: operColor[oper.level],
                    }">
                      {{ oper.name }}</NTag>
                  </template>

                  <NAvatar size="large" :src="getOperatorAvatar(oper.name)" :style="{
                    border: `2px solid ${operColor[oper.level]}`,
                  }"></NAvatar>
                </NTooltip>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
  </NCard>
</template>

<style lang="less" scoped>
.RecruitResultHeader {
  display: flex;
  flex-direction: column;
  align-items: center;

  .RecruitResultTitle {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .RecruitResultOptions {
    display: flex;
    width: 100%;
    justify-content: space-around;

    .RecruitResultOption {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.RecruitResultPanel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px;

  .RecruitResultLayer {
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

  .RecruitTag {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .RecruitResults {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .RecruitResult {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .RecruitResultInfo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;

        .RecruitResultLevel {
          white-space: nowrap;
        }

        .RecruitResultTags {
          display: flex;
          gap: 8px;
        }

        .RecruitResultAction {
          margin-left: 16px;
        }
      }

      .RecruitResultOpers {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
  }
}
</style>
