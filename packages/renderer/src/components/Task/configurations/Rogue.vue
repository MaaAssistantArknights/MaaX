<script setup lang="ts">
import { ref, onMounted, Ref, inject } from 'vue'
import _ from 'lodash'
import {
  NFormItem,
  NSelect,
  NSpace,
  NInputNumber
} from 'naive-ui'
import gamedataApi from '@/api/gamedata'

// import logger from '@/hooks/caller/logger'

type squadType = '默认分队' | '指挥分队' | '集群分队'| '后勤分队'| '矛头分队'| '突击战术分队'| '堡垒战术分队'| '远程战术分队' |'破坏战术分队'| '研究分队'| '高规格分队'
type rolesType = '默认职业组' | '稳扎稳打' | '取长补短' | '随心所欲' | '先手必胜'

interface RogueConfiguration {
  // strategy: Strategies;
  // operators: Array<OperatorOption>;
  mode: number;
  starts_count: number,
  investments_count: number,
  stop_when_investment_full: boolean,
  squad: string,
  roles: string,
  core_char: ''
}

const squadOptions: {
  label: string;
  value: squadType;
}[] = [
  {
    label: '默认分队',
    value: '默认分队'
  },
  {
    label: '指挥分队',
    value: '指挥分队'
  },
  {
    label: '集群分队',
    value: '集群分队'
  },
  {
    label: '后勤分队',
    value: '后勤分队'
  },
  {
    label: '矛头分队',
    value: '矛头分队'
  },
  {
    label: '突击战术分队',
    value: '突击战术分队'
  },
  {
    label: '堡垒战术分队',
    value: '堡垒战术分队'
  },
  {
    label: '远程战术分队',
    value: '远程战术分队'
  },
  {
    label: '破坏战术分队',
    value: '破坏战术分队'
  },
  {
    label: '研究分队',
    value: '研究分队'
  },
  {
    label: '高规格分队',
    value: '高规格分队'
  }
]

const rolesOptions: {
  label: string;
  value: rolesType;
}[] = [
  {
    label: '默认职业组',
    value: '默认职业组'
  },
  {
    label: '随心所欲(三张随机)',
    value: '随心所欲'
  },
  {
    label: '稳扎稳打(重装术士狙击)',
    value: '稳扎稳打'
  },
  {
    label: '取长补短(近卫辅助医疗)',
    value: '取长补短'
  },
  {
    label: '先手必胜(先锋狙击特种)',
    value: '先手必胜'
  }
]

const strategyOptions: Array<{
  label: string;
  value: number;
}> = [
  {
    label: '刷蜡烛, 尽可能往后打',
    value: 0
  },
  {
    label: '刷源石锭投资，第一层商店后退出',
    value: 1
  }
]

const props = defineProps<{
  configurations: RogueConfiguration;
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as
  (key: string, value: any, index: number) => void
const configurationDisabled = inject('configurationDisabled') as {re: boolean, nre: boolean}

function handleUpdateConfiguration (key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function handleUpdateStartsCount (value: number | null) {
  if (value === null) value = 999
  handleUpdateConfiguration('starts_count', value)
}

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

</script>

<template>
  <div class="configuration-form rogue-configuration">
    <NSpace vertical>
      <NFormItem
        label="主题"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect />
      </NFormItem>
      <NFormItem
        label="作战策略"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :disabled="configurationDisabled.re"
          :value="props.configurations.mode"
          :options="strategyOptions"
          @update:value="(value) => handleUpdateConfiguration('mode', value)"
        />
      </NFormItem>
      <NFormItem
        label="开局分队"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :disabled="configurationDisabled.re"
          :value="props.configurations.squad"
          :options="squadOptions"
          @update:value="(value) => handleUpdateConfiguration('squad', value)"
        />
      </NFormItem>
      <NFormItem
        label="开局职业"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :disabled="configurationDisabled.re"
          :value="props.configurations.roles"
          :options="rolesOptions"
          @update:value="(value) => handleUpdateConfiguration('roles', value)"
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
          :value="props.configurations.starts_count"
          :update-value-on-input="false"
          @update:value="handleUpdateStartsCount"
        />
      </NFormItem>
    </NSpace>
  </div>
</template>
