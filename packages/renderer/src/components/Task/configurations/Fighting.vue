<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue'
import { NFormItem, NInputNumber, NSpace, NSelect, NInputGroup, NForm } from 'naive-ui'
import { gamedata } from '@/api'
import type { GetConfig } from './types'
import _ from 'lodash'
import useResrourceStore from '@/store/resource'
import useSettingStore from '@/store/settings'
import semver from 'semver'

type FightConfig = GetConfig<'Fight'>
type Stage = {
  label: string
  value: string
}

const resourceStore = useResrourceStore()
const settingStore = useSettingStore()
const { getAllItems, getAllStages } = gamedata

// 标准 / 磨难
const StageExtraSuffix = {
  NORMAL: '-NORMAL',
  TOUGH: '-HARD',
}

const basicSupportStages: Stage[] = [
  { label: '当前关卡/上次作战', value: '' },
  { label: '1-7', value: '1-7' },
  { label: '剿灭', value: 'Annihilation' },
  { label: '龙门币-6/5', value: 'CE-6' },
  { label: '经验-6/5', value: 'LS-6' },
  { label: '红票-5', value: 'AP-5' },
  { label: '技能-5', value: 'CA-5' },
  { label: '重装/医疗-小', value: 'PR-A-1' },
  { label: '重装/医疗-大', value: 'PR-A-2' },
  { label: '狙击/术士-小', value: 'PR-B-1' },
  { label: '狙击/术士-大', value: 'PR-B-2' },
  { label: '辅助/先锋-小', value: 'PR-C-1' },
  { label: '辅助/先锋-大', value: 'PR-C-2' },
  { label: '特种/近卫-小', value: 'PR-D-1' },
  { label: '特种/近卫-大', value: 'PR-D-2' },
]

const supportStages: Stage[] = []

const props = defineProps<{
  configurations: FightConfig
  taskIndex: number
}>()

const allItems = ref<
  {
    label: string
    value: string
  }[]
>([])

const loading = ref(false)

const drops = computed<{ item_id?: string; times?: number }>({
  get() {
    const entries = Object.entries(props.configurations.drops)
    if (entries.length === 0) {
      return {}
    }
    const [item_id, times] = entries[0]
    return { item_id, times }
  },
  set(value) {
    let obj = {}
    if (!value.item_id) {
      obj = {}
    } else {
      obj = { [value.item_id]: value.times ?? 0 }
    }
    handleUpdateConfiguration('drops', obj)
  },
})

const updateTaskConfigurations = inject('update:configuration') as (
  key: string,
  value: any,
  index: number
) => void

const configurationDisabled = inject('configurationDisabled') as {
  re: boolean
  nre: boolean
}

function handleUpdateConfiguration(key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function handleMedicineUpdate(value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('medicine', value)
}

function handleTimesUpdate(value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('times', value)
}

function handleStoneUpdate(value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('stone', value)
}

function handleDropUpdate(value: { item_id?: string; times?: number }) {
  drops.value = value
}

onMounted(async () => {
  loading.value = true

  const clientType = settingStore.clientType === 'CN' ? 'Official' : settingStore.clientType
  const coreVersion = settingStore.version.core.current ?? ''

  const UTCNow = new Date().toUTCString()
  resourceStore.stageActivity?.[clientType]?.sideStoryStage
    ?.filter(item => semver.gte(coreVersion, item.MinimumRequired))
    .filter(item => {
      if (
        item.Activity.UtcExpireTime &&
        new Date(item.Activity.UtcExpireTime).toISOString() < UTCNow
      ) {
        return false
      }
      return true
    })
    .map(item => {
      supportStages.push({
        label: item.Display,
        value: item.Value,
      })
    })

  supportStages.push(...basicSupportStages)
  const stageResponse = await getAllStages()
  const mainlineStages = Object.values(stageResponse.stages)
    .filter(
      item =>
        item.stageType === 'MAIN' &&
        item.difficulty === 'NORMAL' &&
        item.canBattleReplay == true &&
        ['NONE', 'NORMAL', 'TOUGH'].includes(item.diffGroup)
    )
    .map(item => {
      const kv =
        item.diffGroup === 'NONE'
          ? item.code
          : item.code + StageExtraSuffix[item.diffGroup as keyof typeof StageExtraSuffix]
      return {
        label: kv,
        value: kv,
      }
    })

  supportStages.push(...mainlineStages)
  if (!props.configurations.drops) {
    handleUpdateConfiguration('drops', {})
  }
  const itemResponse = await getAllItems()
  allItems.value = Object.values(itemResponse.items)
    .filter(item => item.stageDropList.length !== 0)
    .filter(item => !['ACTIVITY_ITEM', 'ET_STAGE'].includes(item.itemType))
    .map(item => ({
      label: item.name,
      value: item.itemId,
    }))
  loading.value = false
})
</script>

<template>
  <div class="configuration-form">
    <NForm
      size="small"
      label-align="left"
      label-placement="left"
      label-width="auto"
      :show-feedback="false"
    >
      <NSpace vertical>
        <NFormItem label="选择关卡">
          <NSelect
            :disabled="configurationDisabled.nre"
            :value="props.configurations.stage"
            :options="supportStages"
            @update:value="value => handleUpdateConfiguration('stage', value)"
          />
        </NFormItem>
        <NFormItem label="作战次数">
          <NInputNumber
            :min="0"
            :max="999"
            :disabled="configurationDisabled.re"
            :value="props.configurations.times"
            :update-value-on-input="false"
            @update:value="handleTimesUpdate"
          />
        </NFormItem>
        <NFormItem label="使用理智液数量">
          <NInputNumber
            :min="0"
            :max="999"
            :disabled="configurationDisabled.re"
            :value="props.configurations.medicine"
            :update-value-on-input="false"
            @update:value="handleMedicineUpdate"
          />
        </NFormItem>
        <NFormItem label="使用源石数量">
          <NInputNumber
            :min="0"
            :max="999"
            :disabled="configurationDisabled.re"
            :value="props.configurations.stone"
            :update-value-on-input="false"
            @update:value="handleStoneUpdate"
          />
        </NFormItem>
        <NFormItem label="掉落物选择">
          <NInputGroup>
            <NSelect
              placeholder="掉落物（可为空）"
              :options="allItems"
              :loading="loading"
              filterable
              clearable
              :disabled="configurationDisabled.re"
              :value="drops.item_id"
              @update:value="value => handleDropUpdate({ item_id: value, times: drops.times })"
            />
            <NInputNumber
              placeholder="数量"
              :disabled="!drops.item_id || configurationDisabled.re"
              :style="{ width: '60px' }"
              :show-button="false"
              :value="drops.times"
              :min="0"
              :max="999"
              @update:value="
                value => handleDropUpdate({ item_id: drops.item_id, times: value ?? undefined })
              "
            />
          </NInputGroup>
        </NFormItem>
      </NSpace>
    </NForm>
  </div>
</template>
