<script setup lang="ts">
import { ref, onMounted, Ref, h, inject } from 'vue'
import _ from 'lodash'
import {
  NFormItem,
  NButton,
  NModal,
  NSelect,
  NCard,
  NSpace,
  NDataTable,
  NAvatar,
  DataTableColumns
} from 'naive-ui'
import gamedataApi from '@/api/gamedata'
import { getOperatorAvatar, getSkillImage } from '@/utils/game_image'
// import {
//   secondsToFormattedDuration,
//   formattedDurationToSeconds
// } from '@/utils/time_picker'
import OperatorSelector from '@/components/Task/OperatorSelector.vue'
// import logger from '@/hooks/caller/logger'

// type Strategies = 'ToTheEnd' | 'AfterFirstLevel' | 'AfterMoney';

// interface OperatorOption {
//   name: string, // 干员名
//   skill: number, // 使用技能, 可选范围1-3
//   skill_usage: number // 技能用法 0-不自动使用, 1-好了就用, 2-好了就用,仅使用一次, 3-自动判断使用技能(饼)
// }

interface RogueConfiguration {
  // strategy: Strategies;
  // operators: Array<OperatorOption>;
  mode: number;
  // duration: number; // TODO:最长运行时间, 暂不支持
}

const strategyOptions: Array<{
  label: string;
  value: number;
}> = [
  {
    label: '尽可能往后打',
    value: 0
  },
  {
    label: '刷源石锭投资，第一层商店后退出',
    value: 1
  },
  {
    label: '刷源石锭投资，投资后退出',
    value: 2
  }
]

const skillUsageOptions: Array<{
  label: string;
  value: number;
}> = [
  {
    label: '不自动使用',
    value: 0
  },
  {
    label: '好了就用，有多少次用多少次',
    value: 1
  },
  {
    label: '好了就用，仅使用一次',
    value: 2
  },
  {
    label: '自动判断使用时机',
    value: 3
  }
]

const props = defineProps<{
  configurations: RogueConfiguration;
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as
  (key: string, value: any, index: number) => void

function handleUpdateConfiguration (key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

const showModal = ref(false)
const showSelectModal = ref(false)

const selectedOperators: Ref<any[]> = ref([])
const allSkills: Ref<any> = ref()
const loading = ref(false)

onMounted(async () => {
  loading.value = true

  allSkills.value = (await gamedataApi.getAllSkills()) as any
  Object.keys(allSkills.value).forEach((key) => {
    allSkills.value[key].name = allSkills.value[key].levels[0].name
    allSkills.value[key].image = getSkillImage(allSkills.value[key].name)
  })
  loading.value = false
})

const addOperator = (operator: any) => {
  console.log('emit add:operator')
  selectedOperators.value.push({
    operator,
    skill: 1,
    skillUsage: 0
  })
}

const removeOperator = (operator: any) => {
  console.log('emit remove:operator')
  _.remove(selectedOperators.value, (op) => op.operator.name === operator.name)
}

const createColumns = (): DataTableColumns<any> => [
  {
    title: '干员',
    key: 'operator',
    render: (row) => h(NAvatar, { size: 36, src: getOperatorAvatar(row.operator.name) })
  },
  {
    title: '技能',
    key: 'skill',
    render: (row) => {
      const skillAvatar = (skill: any, index: number) =>
        h(NAvatar, {
          size: 36,
          src: allSkills.value[skill.skillId].image,
          onClick: () => { row.skill = index + 1 },
          class: `skill-avatar ${row.skill === index + 1 ? 'selected' : ''}`
        })
      return h(NSpace, {}, () => _.map(row.operator.skills, skillAvatar))
    }
  },
  {
    title: '技能用法',
    key: 'skillUsage',
    render: (row) => h(NSelect, {
      value: row.skillUsage,
      options: skillUsageOptions,
      onUpdateValue: (value) => { row.skillUsage = value }
    })
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) =>
      h(
        NButton,
        {
          size: 'small',
          type: 'error',
          onClick: () => removeOperator(row.operator)
        },
        {
          default: () => '删除'
        }
      )
  }
]
</script>

<template>
  <div class="configuration-form rogue-configuration">
    <NSpace vertical>
      <!-- <NFormItem label="运行时间">
        <NTimePicker
          :style="{ width: '100%' }"
          :default-formatted-value="
            secondsToFormattedDuration(props.configurations.duration)
          "
          :actions="['confirm']"
          @update:formatted-value="
            (value) =>
              handleUpdateConfiguration('duration', formattedDurationToSeconds(value))
          "
        />
      </NFormItem> -->

      <NFormItem
        label="通关策略"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :value="props.configurations.mode"
          :options="strategyOptions"
          @update:value="(value) => handleUpdateConfiguration('mode', value)"
        />
      </NFormItem>
      <!-- <NFormItem :show-label="false">
        <NButton quaternary type="primary" @click="showModal = true" :focusable="false"
          >选择优先招募干员...
        </NButton>
      </NFormItem> -->
    </NSpace>
    <NModal
      v-model:show="showModal"
      title="优先招募干员"
      display-directive="show"
      role="dialog"
      aria-modal="true"
    >
      <NCard
        style="width: 600px"
        role="dialog"
        aria-modal="true"
        title="优先招募干员"
      >
        <template #header-extra>
          <NButton @click="() => (showSelectModal = true)">
            选择
          </NButton>
        </template>
        <NDataTable
          class="operator-table"
          :data="selectedOperators"
          :columns="createColumns()"
        />
        <OperatorSelector
          :show="showSelectModal"
          :selected-operators="selectedOperators.map((value) => value.operator)"
          @update:show="(value) => (showSelectModal = value)"
          @add:operator="addOperator"
          @remove:operator="removeOperator"
        />
      </NCard>
    </NModal>
  </div>
</template>

<style lang="less" scoped>
.operator-row {
  display: flex;
  justify-content: space-between;
}

.operator-skills {
  flex: 1;
}

.operator-table :deep(.skill-avatar) {
  position: relative;
  &.selected::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    border: 2px solid rgb(234, 173, 61);
    width: 100%;
    height: 100%;
  }
}
</style>
