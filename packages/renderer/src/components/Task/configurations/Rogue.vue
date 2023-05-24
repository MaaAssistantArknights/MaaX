<script setup lang="ts">
import { inject } from 'vue'
import _ from 'lodash'
import { RogueTheme, type MizukiSquadType, type PhantomSquadType, type RolesType } from '@type/game'
import {
  NForm,
  NFormItem,
  NSelect,
  NSpace,
  NInputNumber,
  NCheckbox,
  NInput,
  NTooltip,
} from 'naive-ui'
import { showMessage } from '@/utils/message'
import type { GetConfig } from './types'

// import logger from '@/hooks/caller/logger'

type RogueConfig = GetConfig<'Roguelike'>

const phantomSquadOptions: {
  label: string
  value: PhantomSquadType
}[] = [
  {
    label: '指挥分队',
    value: '指挥分队',
  },
  {
    label: '集群分队',
    value: '集群分队',
  },
  {
    label: '后勤分队',
    value: '后勤分队',
  },
  {
    label: '矛头分队',
    value: '矛头分队',
  },
  {
    label: '突击战术分队',
    value: '突击战术分队',
  },
  {
    label: '堡垒战术分队',
    value: '堡垒战术分队',
  },
  {
    label: '远程战术分队',
    value: '远程战术分队',
  },
  {
    label: '破坏战术分队',
    value: '破坏战术分队',
  },
  {
    label: '研究分队',
    value: '研究分队',
  },
  {
    label: '高规格分队',
    value: '高规格分队',
  },
]

const mizukiSquadOptions: {
  label: string
  value: MizukiSquadType
}[] = [
  {
    label: '心胜于物分队',
    value: '心胜于物分队',
  },
  {
    label: '物尽其用分队',
    value: '物尽其用分队',
  },
  {
    label: '以人为本分队',
    value: '以人为本分队',
  },
  {
    label: '指挥分队',
    value: '指挥分队',
  },
  {
    label: '集群分队',
    value: '集群分队',
  },
  {
    label: '后勤分队',
    value: '后勤分队',
  },
  {
    label: '矛头分队',
    value: '矛头分队',
  },
  {
    label: '突击战术分队',
    value: '突击战术分队',
  },
  {
    label: '堡垒战术分队',
    value: '堡垒战术分队',
  },
  {
    label: '远程战术分队',
    value: '远程战术分队',
  },
  {
    label: '破坏战术分队',
    value: '破坏战术分队',
  },
  {
    label: '研究分队',
    value: '研究分队',
  },
  {
    label: '高规格分队',
    value: '高规格分队',
  },
]

const rolesOptions: {
  label: string
  value: RolesType
}[] = [
  {
    label: '随心所欲(三张随机)',
    value: '随心所欲',
  },
  {
    label: '稳扎稳打(重装术士狙击)',
    value: '稳扎稳打',
  },
  {
    label: '取长补短(近卫辅助医疗)',
    value: '取长补短',
  },
  {
    label: '先手必胜(先锋狙击特种)',
    value: '先手必胜',
  },
]

const strategyOptions: Array<{
  label: string
  value: number
}> = [
  {
    label: '刷蜡烛, 尽可能往后打',
    value: 0,
  },
  {
    label: '刷源石锭投资，第一层商店后退出',
    value: 1,
  },
]

const themeOptions: {
  label: string
  value: string
}[] = [
  {
    label: '傀影',
    value: 'Phantom',
  },
  {
    label: '水月',
    value: 'Mizuki',
  },
]

const props = defineProps<{
  configurations: RogueConfig
  taskIndex: number
}>()

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

function handleUpdateRogueTheme(value: string) {
  updateTaskConfigurations('theme', value, props.taskIndex)
  // 切主题, 检查一下分队
  if (value === RogueTheme.Phantom) {
    if (!phantomSquadOptions.find(item => item.value === props.configurations.squad)) {
      showMessage('当前分队不支持傀影主题, 已自动切换到指挥分队', {
        type: 'info',
        duration: 5000,
        closable: true,
      })
      handleUpdateConfiguration('squad', '指挥分队')
    }
  } else {
    if (!mizukiSquadOptions.find(item => item.value === props.configurations.squad)) {
      showMessage('当前分队不支持水月主题, 已自动切换到指挥分队', {
        type: 'info',
        duration: 5000,
        closable: true,
      })
      handleUpdateConfiguration('squad', '指挥分队')
    }
  }
}

function handleUpdateStartsCount(value: number | null) {
  if (value === null) value = 999
  handleUpdateConfiguration('starts_count', value)
}
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
        <NFormItem label="主题">
          <NSelect
            :disabled="configurationDisabled.re"
            :value="props.configurations.theme"
            :options="themeOptions"
            @update:value="value => handleUpdateRogueTheme(value)"
          />
        </NFormItem>
        <NFormItem label="作战策略">
          <NSelect
            :disabled="configurationDisabled.re"
            :value="props.configurations.mode"
            :options="strategyOptions"
            @update:value="value => handleUpdateConfiguration('mode', value)"
          />
        </NFormItem>
        <NFormItem label="开局分队">
          <NSelect
            :disabled="configurationDisabled.re"
            :value="props.configurations.squad"
            :options="
              props.configurations.theme === RogueTheme.Phantom
                ? phantomSquadOptions
                : mizukiSquadOptions
            "
            @update:value="value => handleUpdateConfiguration('squad', value)"
          />
        </NFormItem>
        <NFormItem label="开局职业">
          <NSelect
            :disabled="configurationDisabled.re"
            :value="props.configurations.roles"
            :options="rolesOptions"
            @update:value="value => handleUpdateConfiguration('roles', value)"
          />
        </NFormItem>
        <NFormItem label="开局干员">
          <NTooltip trigger="hover">
            <template #trigger>
              <NInput
                :disabled="configurationDisabled.re"
                :value="props.configurations.core_char"
                @update:value="value => handleUpdateConfiguration('core_char', value)"
              />
            </template>
            仅支持单个干员中！文！名！。默认识别练度自动选择
          </NTooltip>
        </NFormItem>
        <NFormItem label="作战次数">
          <NInputNumber
            :min="0"
            :max="999"
            :disabled="configurationDisabled.re"
            :value="props.configurations.starts_count"
            :update-value-on-input="false"
            @update:value="handleUpdateStartsCount"
          />
        </NFormItem>
        <NFormItem>
          <NCheckbox
            :disabled="configurationDisabled.re"
            :checked="props.configurations.use_support"
            @update:checked="value => handleUpdateConfiguration('use_support', value)"
          >
            开局干员使用助战
          </NCheckbox>
        </NFormItem>
        <NFormItem>
          <NTooltip trigger="hover">
            <template #trigger>
              <NCheckbox
                :disabled="configurationDisabled.re"
                :checked="props.configurations.use_nonfriend_support"
                @update:checked="value => handleUpdateConfiguration('use_nonfriend_support', value)"
              >
                允许使用非好友助战
              </NCheckbox>
            </template>
            是否可以是非好友助战干员，仅在勾选'开局干员使用助战'时有效
          </NTooltip>
        </NFormItem>
      </NSpace>
    </NForm>
  </div>
</template>
