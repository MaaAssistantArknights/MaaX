<script setup lang="ts">
import {
  NAvatar,
  NButton,
  NCard,
  NCheckbox,
  NInput,
  NInputNumber,
  NModal,
  NUpload,
  NUploadDragger,
  type UploadFileInfo,
} from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProfessionImage } from '@/utils/game_image'
import OperItem from './OperItem.vue'
import { useSeperateTaskStore } from '@/store/seperateTask'
import { AsstMsg, type CallbackMapper } from '@type/task/callback'
import TMap from '../External/TheresaWiki/TMap.vue'
import type { TileClickData } from '../External/TheresaWiki/types'

const route = useRoute()
const seperateTaskStore = useSeperateTaskStore()

const currentUuid = route.params.uuid as string

interface OperatorReq {
  elite?: 0 | 1 | 2
  level?: number
  skill_level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  module?: 0 | 1 | 2
  potentiality?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

interface Operator {
  name: string
  skill?: 1 | 2 | 3
  skill_usage?: 0 | 1 | 2 | 3
  requirements?: OperatorReq
}

interface CopilotObject {
  stage_name: string
  minimum_required: string
  doc?: {
    title?: string
    title_color?: string
    details?: string
    detail_color?: string
  }
  opers: Operator[]

  // 普通作业
  type?: ''
  groups?: {
    name: string
    opers: Operator[]
  }[]
  actions: any[]
}

interface SSSCopilotObject {
  stage_name: string
  minimum_required: string
  doc?: {
    title?: string
    title_color?: string
    details?: string
    detail_color?: string
  }
  opers?: Operator[]

  // 保全作业
  type: 'SSS'
  buff?: string
  equipment?: ('A' | 'B')[]
  strategy?: '优选策略' | '自由策略'
  tool_men?: {
    [type: string]: number
  }
  drops: string[]
  blacklist?: string[]
  stages: {
    name: string
    strategies: {}[]
  }[]
}

const maaLink = ref<string>('')
const data = ref<CopilotObject | SSSCopilotObject | null>(null)
const showPreview = ref(false)
const mapPreview = ref<string>('')
const useAutoFormation = ref(false)
const useSSSLoop = ref(false)
const SSSLoopTimes = ref(1)

const processing = ref(false)
const taskId = ref(-1)
const logs = ref<string[]>([])

function updateData(obj: CopilotObject | SSSCopilotObject | null) {
  // check ver.
  showPreview.value = false
  mapPreview.value = ''
  data.value = obj
}

async function parseInfo(option: { file: UploadFileInfo }) {
  const file = option.file.file
  if (!file) {
    return
  }
  updateData(JSON.parse(await file.text()))
}

async function fetchInfo(url: string) {
  // console.log(url)
  const m = /^maa:\/\/(\d+)$/.exec(url)
  if (!m) {
    return
  }
  const res = (await (await fetch(`https://prts.maa.plus/copilot/get/${m[1]}`)).json()) as {
    status_code: number
    data: {
      content: string
    }
  }
  if (res.status_code !== 200) {
    // show error, 400 / 404
    updateData(null)
    return
  }
  updateData(JSON.parse(res.data.content))
}

function startFetch() {
  fetchInfo(maaLink.value)
}

if (route.params.id) {
  fetchInfo('maa://' + (route.params.id as string))
}

function track(text: string) {
  const pat = /BV[0-9a-zA-Z]+/
  const res: (
    | {
        type: 'text'
        text: string
      }
    | {
        type: 'link'
        text: string
        url: string
      }
  )[] = []
  while (text.length > 0) {
    const m = pat.exec(text)
    if (m) {
      if (m.index > 0) {
        res.push({
          type: 'text',
          text: text.slice(0, m.index),
        })
      }
      res.push({
        type: 'link',
        text: m[0],
        url: `https://bilibili.com/video/${m[0]}/`,
      })
      text = text.slice(m.index + m[0].length)
    } else {
      res.push({
        type: 'text',
        text,
      })
      text = ''
    }
  }
  return res
}

function openExt(url: string) {
  window.main.Util.openExternal(url)
}

function openExtMap() {
  window.main.Util.openExternal(`https://map.ark-nights.com/map/${data.value?.stage_name}`)
}

function popupPreview() {
  mapPreview.value = data.value?.stage_name ?? ''
  showPreview.value = !!mapPreview.value
}

// 先写着备用
function serializeReq(req: OperatorReq) {
  let res = ''
  if (req.elite) {
    res += `精${req.elite}`
  }
  if (req.level) {
    res += `${req.level}级`
  }
  if (req.skill_level) {
    res += req.skill_level <= 7 ? `${req.skill_level}级技能` : `专${req.skill_level - 7}`
  }
  if (req.module) {
    res += `${req.module}模`
  }
  if (req.potentiality) {
    res += `${req.potentiality}潜`
  }
  return res
}

async function start() {
  if (!data.value) {
    return
  }
  const filename = await window.main.Util.saveTempJson(JSON.stringify(data.value))
  processing.value = true
  logs.value = []
  const type = data.value.type === 'SSS' ? 'SSS' : 'NORM'
  if (data.value.type === 'SSS') {
    taskId.value = await window.main.CoreLoader.appendTask({
      uuid: currentUuid,
      type: 'SSSCopilot',
      params: {
        enable: true,
        filename,
        loop_times: useSSSLoop.value ? SSSLoopTimes.value : undefined,
      },
    })
  } else {
    taskId.value = await window.main.CoreLoader.appendTask({
      uuid: currentUuid,
      type: 'Copilot',
      params: {
        enable: true,
        filename,
        formation: useAutoFormation.value,
      },
    })
  }

  const tc = type === 'SSS' ? 'SSSCopilot' : 'Copilot'
  const h = seperateTaskStore.register(currentUuid, taskId.value, (msg, data) => {
    if (data.taskchain !== tc) {
      return false
    }
    // console.log(msg, data)
    switch (msg) {
      case AsstMsg.SubTaskExtraInfo: {
        const d = data as CallbackMapper[AsstMsg.SubTaskExtraInfo]
        switch (d.what) {
          case 'CopilotAction':
            if (d.details.doc) {
              logs.value.push(d.details.doc)
            }
            logs.value.push(`当前步骤: ${d.details.action} ${d.details.target}`)
            return true
          case 'SSSStage':
            logs.value.push(`进入关卡: ${d.details.stage}`)
            return true
          case 'SSSSettlement':
            logs.value.push(`${d.details.why}`)
            return true
          case 'SSSGamePass':
            logs.value.push('通关了?')
            return true
          case 'UnsupportedLevel':
            logs.value.push(`不支持的关卡!`)
            return true
        }
        return false
      }
      case AsstMsg.SubTaskError:
        console.warn(msg, data)
        // WTF?
        if ((data as any).first[0] === 'BattleStartPre') {
          return false
        }
        seperateTaskStore.unregister(currentUuid, taskId.value, h)
        processing.value = false
        return true
      case AsstMsg.SubTaskCompleted: {
        const d = data as CallbackMapper[AsstMsg.SubTaskCompleted]
        if (type === 'SSS') {
          if (d.subtask === 'SSSStageManagerTask') {
            console.warn(msg, data)
            seperateTaskStore.unregister(currentUuid, taskId.value, h)
            processing.value = false
            return true
          }
        } else {
          if (d.subtask === 'BattleProcessTask') {
            console.warn(msg, data)
            seperateTaskStore.unregister(currentUuid, taskId.value, h)
            processing.value = false
            return true
          }
        }
      }
    }
    return false
  })

  await window.main.CoreLoader.start({
    uuid: currentUuid,
  })
}

function stop() {
  processing.value = false
  window.main.CoreLoader.stop({
    uuid: currentUuid,
  })
}

const tmapLoading = ref(true)
const tmap = ref<InstanceType<typeof TMap> | null>(null)

function previewTileClick(tile: TileClickData) {
  console.log(tile)
  tmap.value?.setMapState({
    activeTiles: [
      {
        x: tile.maaLocation[0],
        y: tile.maaLocation[1],
      },
    ],
  })
}
</script>

<template>
  <NCard>
    <template #header>
      <span class="CopilotHeader"> 自动战斗 </span>
    </template>
    <div class="CopilotConfig">
      <NInput
        placeholder="神秘链接 maa://"
        v-model:value="maaLink"
        @blur="startFetch"
        @change="startFetch"
      ></NInput>
      <NUpload
        :default-upload="false"
        :show-file-list="false"
        :multiple="false"
        accept=".json"
        @change="parseInfo"
      >
        <NUploadDragger style="display: block">
          <span> 选择作业 </span>
        </NUploadDragger>
      </NUpload>
    </div>

    <div class="CopilotContent" v-if="data">
      <NCard v-if="data" embedded style="grid-column: span 2">
        <template #header>
          <span> 控制 </span>
        </template>

        <div class="CopilotControl">
          <template v-if="!processing">
            <template v-if="data.type === 'SSS'">
              <div>
                <NCheckbox v-model:checked="useSSSLoop">
                  <span style="white-space: nowrap"> 循环次数 </span>
                </NCheckbox>
                <NInputNumber :disabled="!useSSSLoop" v-model:value="SSSLoopTimes"></NInputNumber>
              </div>
            </template>
            <template v-else>
              <div>
                <span> {{ data.stage_name }} </span>
                <NButton @click="openExtMap()"> prts.map </NButton>
                <NButton @click="popupPreview()"> theresa.wiki </NButton>
                <NModal v-model:show="showPreview">
                  <div>
                    <TMap
                      ref="tmap"
                      v-show="!tmapLoading"
                      @tileClick="previewTileClick"
                      @mapReady="tmapLoading = false"
                      :stageId="mapPreview"
                    ></TMap>
                    <span v-show="tmapLoading"> Loading... </span>
                  </div>
                </NModal>
              </div>
              <div>
                <NCheckbox v-model:checked="useAutoFormation">
                  <span style="white-space: nowrap"> 自动编队 </span>
                </NCheckbox>
              </div>
            </template>
          </template>
          <div style="justify-content: center">
            <NButton v-if="!processing" @click="start" size="large">开始</NButton>
            <NButton v-else @click="stop" size="large">停止</NButton>
          </div>
          <div style="flex-direction: column">
            <span v-for="(log, idx) in logs" :key="idx">
              {{ log }}
            </span>
          </div>
        </div>
      </NCard>
      <NCard embedded>
        <template #header>
          <span> {{ data.doc?.title ?? data.stage_name }} </span>
        </template>

        <div class="CopilotDetail" v-if="data.doc?.details">
          <span v-for="(row, idx) in data.doc.details.split(/[\n\r]/)" :key="idx">
            <template v-for="(item, idx2) in track(row)" :key="idx2">
              <template v-if="item.type === 'text'">
                {{ item.text }}
              </template>
              <a v-else-if="item.type === 'link'" @click="openExt(item.url)">
                {{ item.text }}
              </a>
            </template>
          </span>
        </div>
      </NCard>
      <NCard embedded>
        <template #header>
          <span> 干员 </span>
        </template>
        <div class="CopilotOpers">
          <OperItem v-for="oper in data.opers ?? []" :key="oper.name" :oper="oper"></OperItem>
          <template v-if="data.type !== 'SSS'">
            <template v-for="group in data.groups ?? []" :key="group.name">
              <span style="grid-column: span 5">
                {{ group.name }}
              </span>
              <OperItem v-for="oper in group.opers ?? []" :key="oper.name" :oper="oper"></OperItem>
            </template>
          </template>
        </div>
      </NCard>
      <template v-if="data.type === 'SSS'">
        <NCard embedded>
          <template #header>
            <span> 基本配置 </span>
          </template>
          <div class="SSSCopilotInfo">
            <template v-if="data.buff">
              <span> 导能元件 </span>
              <span> {{ data.buff }} </span>
              <!-- <NAvatar :src="getItemBorderedImage(data.buff)"></NAvatar> -->
            </template>
            <template v-if="data.equipment">
              <span> 战术装备 </span>
              <div class="SSSCopilotEquipment">
                <span v-for="(type, idx) in data.equipment" :key="idx"> {{ type }} </span>
              </div>
              <!-- <NAvatar :src="getItemBorderedImage(data.buff)"></NAvatar> -->
            </template>
          </div>
        </NCard>

        <template v-if="data.tool_men">
          <NCard embedded>
            <template #header>
              <span> 工具人 </span>
            </template>
            <div class="SSSCopilotToolMen">
              <template v-for="toolmen in Object.entries(data.tool_men)" :key="toolmen[0]">
                <NAvatar
                  size="small"
                  :src="getProfessionImage(toolmen[0].replace('术士', '术师'))"
                ></NAvatar>
                <span> {{ toolmen[0] }} </span>
                <span> {{ toolmen[1] }} </span>
              </template>
            </div>
          </NCard>
        </template>
      </template>
    </div>
    <!-- {{ data }} -->
  </NCard>
</template>

<style lang="less" scoped>
.CopilotHeader {
  font-size: 24px;
}

.CopilotContent {
  margin-top: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  .CopilotControl {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > div {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  .CopilotDetail {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    span {
      text-align: start;
      margin-bottom: 4px;
    }

    a {
      color: blue;
      cursor: pointer;
    }
  }

  .CopilotOpers {
    margin-top: 8px;

    display: grid;
    grid-template-columns: repeat(5, max-content);
    gap: 8px;

    align-items: center;
  }

  .SSSCopilotInfo {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    gap: 8px;

    .SSSCopilotEquipment {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
    }
  }

  .SSSCopilotToolMen {
    display: grid;
    grid-template-columns: repeat(3, max-content);
    gap: 8px;
  }
}
</style>
