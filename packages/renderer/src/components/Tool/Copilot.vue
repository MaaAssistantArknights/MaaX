<script setup lang="ts">
import { NAvatar, NCard, NInput, NUpload, NUploadDragger, type UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProfessionImage } from '@/utils/game_image'
import OperItem from './OperItem.vue'

const route = useRoute()

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

function updateData(obj: CopilotObject | SSSCopilotObject | null) {
  // check ver.
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
  console.log(url)
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

if (route.query.id) {
  fetchInfo('maa://' + (route.query.id as string))
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
    {{ data }}
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
