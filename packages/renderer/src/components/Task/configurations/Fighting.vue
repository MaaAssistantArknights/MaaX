<script setup lang="ts">
import { ref, onMounted, computed, Ref, inject } from 'vue'
import {
  NFormItem,
  NInputNumber,
  NSpace,
  NSelect,
  NInputGroup
} from 'naive-ui'
import { gamedata } from '@/api'

type DropConfiguration = Record<string, number>

interface FightingConfiguration {
  stage: string
  medicine: number
  stone: number
  times: number
  drops: DropConfiguration
  report_to_penguin: boolean
  penguin_id: string
  server: string
  client_type: string
}

const { getAllItems } = gamedata

// FIXME: 不应该硬编码(
// 最好也整成图片的选择形式?
const supportStages = [
  { label: '当前关卡/上次作战', value: '' },
  { label: 'LE-5', value: 'LE-5' },
  { label: 'LE-7', value: 'LE-7' },
  { label: 'LE-8', value: 'LE-8' },
  { label: '1-7', value: '1-7' },
  { label: '龙门币-6/5', value: 'CE-6' },
  { label: '经验-6/5', value: 'LS-6' },
  { label: '红票-5', value: 'AP-5' },
  { label: '技能-5', value: 'CA-5' }
]

const props = defineProps<{
  configurations: FightingConfiguration;
  taskIndex: number
}>()

const allItems: Ref<Array<{
  label: string
  value: string
}>> = ref([])

const loading = ref(false)

const drops = computed({
  get () {
    const entries = Object.entries(props.configurations.drops)
    if (entries.length === 0) {
      return {}
    }
    const [item_id, times] = entries[0]
    return { item_id, times }
  },
  set (value: { item_id?: string, times?: number }) {
    if (!value.item_id) value = {}
    if (value.item_id && !value.times) value.times = 0
    const obj = Object.fromEntries([[value.item_id, value.times].filter(v => v !== undefined)].filter(v => v.length))
    handleUpdateConfiguration('drops', obj)
  }
})

const updateTaskConfigurations = inject('update:configuration') as
  (key: string, value: any, index: number) => void

const configurationDisabled = inject('configurationDisabled') as {re: boolean, nre: boolean}

function handleUpdateConfiguration (key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function handleMedicineUpdate (value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('medicine', value)
}

function handleTimesUpdate (value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('times', value)
}

function handleStoneUpdate (value: number | null) {
  if (value === null) value = 6
  handleUpdateConfiguration('stone', value)
}

function handleDropUpdate (value: { item_id?: string, times?: number }) {
  drops.value = value
}

onMounted(async () => {
  if (!props.configurations.drops) {
    handleUpdateConfiguration('drops', {})
  }
  loading.value = true
  const response = await getAllItems()
  allItems.value = Object.entries(response.items)
    .filter(([item_id, item]) => item.stageDropList.length !== 0)
    .map(([item_id, item]) => ({
      label: item.name,
      value: item_id
    }))
  loading.value = false
})

</script>

<template>
  <div class="configuration-form">
    <NSpace vertical>
      <NFormItem
        label="选择关卡"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :disabled="configurationDisabled.nre"
          :value="props.configurations.stage"
          :options="supportStages"
          @update:value="value => handleUpdateConfiguration('stage', value)"
        />
      </NFormItem>
      <NFormItem
        label="作战次数"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NInputNumber
          :min="0"
          :max="999"
          :disabled="configurationDisabled.re"
          :value="props.configurations.times"
          :update-value-on-input="false"
          @update:value="handleTimesUpdate"
        />
      </NFormItem>
      <NFormItem
        label="使用理智液数量"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NInputNumber
          :min="0"
          :max="999"
          :disabled="configurationDisabled.re"
          :value="props.configurations.medicine"
          :update-value-on-input="false"
          @update:value="handleMedicineUpdate"
        />
      </NFormItem>
      <NFormItem
        label="使用源石数量"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NInputNumber
          :min="0"
          :max="999"
          :disabled="configurationDisabled.re"
          :value="props.configurations.stone"
          :update-value-on-input="false"
          @update:value="handleStoneUpdate"
        />
      </NFormItem>
      <NFormItem
        label="掉落物选择"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NInputGroup>
          <NSelect
            placeholder="掉落物（可为空）"
            :options="allItems"
            :loading="loading"
            filterable
            clearable
            :disabled="configurationDisabled.re"
            :value="drops.item_id"
            @update:value="value => handleDropUpdate({item_id: value, times: drops.times})"
          />
          <NInputNumber
            placeholder="数量"
            :disabled="!drops.item_id || configurationDisabled.re"
            :style="{width: '60px'}"
            :show-button="false"
            :value="drops.times"
            :min="0"
            :max="999"
            @update:value="value => handleDropUpdate({item_id: drops.item_id, times: value ?? undefined})"
          />
        </NInputGroup>
      </NFormItem>
    </NSpace>
  </div>
</template>
