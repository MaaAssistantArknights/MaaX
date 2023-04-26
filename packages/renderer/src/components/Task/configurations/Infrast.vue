<script setup lang="ts">
import { inject, computed, ref, onMounted } from 'vue'
import {
  NCheckbox,
  NFormItem,
  NSelect,
  NSlider,
  NSpace,
  NUpload,
  NUploadDragger,
  NText,
  UploadFileInfo,
} from 'naive-ui'
import Draggable from 'vuedraggable'
import _ from 'lodash'
import { showMessage } from '@/utils/message'

type FacilityType =
  | 'Mfg'
  | 'Trade'
  | 'Control'
  | 'Power'
  | 'Reception'
  | 'Office'
  | 'Dorm'

type droneUsageType =
  | '_NotUse'
  | 'Money'
  | 'SyntheticJade'
  | 'CombatRecord'
  | 'PureGold'
  | 'OriginStone'
  | 'Chip'

type infrastPlan = 0 | 10000

interface InfrastConfiguration {
  mode: number // 保留模式, 暂无意义
  facility: FacilityType[] // 换班基建
  drones: droneUsageType // 无人机用途
  threshold: number // 换班阈值
  replenish: boolean // 自动源石补货
  dorm_notstationed_enabled: boolean // 不将已入驻的干员放入宿舍
  drom_trust_enabled: boolean // 宿舍剩余位置蹭信赖
  filename: string // 换班基建配置文件名
  plan_index: number // 换班基建配置方案
}

const infrastConfig = {
  path: ref(''),
  loadStatus: ref(false),
  title: ref(''),
  config: ref(),
}

const droneUsageOptions: {
  value: droneUsageType
  label: string
}[] = [
  {
    value: '_NotUse', // _NotUse
    label: '不使用无人机',
  },
  {
    value: 'Money', // LMD
    label: '贸易站 - 龙门币',
  },
  {
    value: 'SyntheticJade', // Orumdum
    label: '贸易站 - 合成玉',
  },
  {
    value: 'CombatRecord', // 'Battle Record'
    label: '制造站 - 作战记录',
  },
  {
    value: 'PureGold', // 'Pure Gold',
    label: '制造站 - 赤金',
  },
  {
    value: 'OriginStone', // 'Originium Shard'
    label: '制造站 - 源石碎片',
  },
  {
    value: 'Chip', // Chip
    label: '制造站 - 芯片',
  },
]

const infrastPlanOption: {
  value: infrastPlan
  label: string
}[] = [
  {
    value: 0,
    label: '单设施最优解',
  },
  {
    value: 10000,
    label: '自定义换班模式',
  },
]

const allFacilities: FacilityType[] = [
  'Mfg',
  'Trade',
  'Power',
  'Control',
  'Reception',
  'Office',
  'Dorm',
]

const props = defineProps<{
  configurations: InfrastConfiguration
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

const facilities = computed(() => {
  const diff = _.difference(allFacilities, props.configurations.facility)
  return [...props.configurations.facility, ...diff].map(facility => ({
    name: facility,
    enabled: props.configurations.facility.includes(facility),
  }))
})
function handleUpdateConfiguration(key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function onFacilityEnableUpdate(name: string, enabled: boolean) {
  const facs = _.cloneDeep(facilities.value)
  const fac = facs.find(facility => facility.name === name)
  if (fac) {
    fac.enabled = enabled
  }
  const updated = facs
    .filter(facility => facility.enabled)
    .map(facility => facility.name)
  handleUpdateConfiguration('facility', updated)
}

function onFacilitySortUpdate() {
  const updated = facilities.value
    .filter(facility => facility.enabled)
    .map(facility => facility.name)
  handleUpdateConfiguration('facility', updated)
}

async function handleSelectInfrastConfig(options: { file: UploadFileInfo }) {
  await infrastConfigParse(options.file.file?.path)
}

async function infrastConfigParse(path: string | undefined) {
  if (!path) {
    showMessage('请选择配置文件')
    return
  }
  infrastConfig.path.value = path
  // eslint-disable-next-line vue/max-len
  const raw_content = (await window.ipcRenderer.invoke(
    'main.Task:readInfrastConfig',
    { filepath: infrastConfig.path.value }
  )) as string
  if (raw_content.length < 1) {
    showMessage('读取基建文件文件失败', {
      type: 'error',
      duration: 0,
      closable: true,
    })
    return
  }
  try {
    const content = JSON.parse(raw_content)
    infrastConfig.title.value = content.title
    if (!content.plans) {
      showMessage('读取基建文件文件失败, 文件缺少配置', {
        type: 'error',
        duration: 0,
        closable: true,
      })
      return
    }
    handleUpdateConfiguration('filename', path)
    infrastConfig.config.value = []
    content.plans.forEach((v: any, index: number) => {
      infrastConfig.config.value.push({
        label: v.name,
        value: index,
      })
    })
  } catch (e) {
    showMessage('读取基建文件文件失败', {
      type: 'error',
      duration: 0,
      closable: true,
    })
    return
  }

  infrastConfig.loadStatus.value = true
}

onMounted(() => {
  if (
    props.configurations.mode === 10000 &&
    props.configurations.filename.length > 1
  ) {
    infrastConfigParse(props.configurations.filename)
  }
})
</script>

<template>
  <div class="configuration-form infrast-configuration">
    <NFormItem
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <Draggable
        :list="facilities"
        class="facilities"
        :disabled="configurationDisabled.nre"
        :animation="200"
        item-key="name"
        @change="onFacilitySortUpdate"
      >
        <template #item="{ element }">
          <NCheckbox
            :checked="element.enabled"
            :label="$t(`task.infrast.${element.name}`)"
            @update:checked="
              checked => onFacilityEnableUpdate(element.name, checked)
            "
          />
        </template>
      </Draggable>
    </NFormItem>
    <NSpace class="infra-left" vertical>
      <NFormItem
        label="无人机用途"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="top"
        :show-feedback="false"
        :label-style="{ justifyContent: 'center' }"
      >
        <NSelect
          :disabled="configurationDisabled.re"
          :value="props.configurations.drones"
          :options="droneUsageOptions"
          @update:value="value => handleUpdateConfiguration('drones', value)"
        />
      </NFormItem>
      <NFormItem
        label="进驻宿舍理智阈值"
        :show-label="true"
        :label-style="{ justifyContent: 'center', padding: 0 }"
        size="small"
        label-align="left"
        label-placement="top"
        :show-feedback="false"
      >
        <NSlider
          :disabled="configurationDisabled.re"
          :value="props.configurations.threshold"
          :max="1.0"
          :min="0"
          :step="0.01"
          :format-tooltip="value => `${Math.ceil(value * 100)}%`"
          @update:value="value => handleUpdateConfiguration('threshold', value)"
        />
      </NFormItem>
      <NFormItem :show-label="false" size="small" :show-feedback="false">
        <NCheckbox
          :disabled="configurationDisabled.re"
          :checked="props.configurations.replenish"
          @update:checked="
            checked => handleUpdateConfiguration('replenish', checked)
          "
        >
          源石碎片自动补货
        </NCheckbox>
      </NFormItem>
      <NFormItem :show-label="false" size="small" :show-feedback="false">
        <NCheckbox
          :disabled="configurationDisabled.re"
          :checked="props.configurations.drom_trust_enabled"
          @update:checked="
            checked => handleUpdateConfiguration('drom_trust_enabled', checked)
          "
        >
          宿舍空余位置蹭信赖
        </NCheckbox>
      </NFormItem>
      <NFormItem :show-label="false" size="small" :show-feedback="false">
        <NCheckbox
          :disabled="configurationDisabled.re"
          :checked="props.configurations.dorm_notstationed_enabled"
          @update:checked="
            checked =>
              handleUpdateConfiguration('dorm_notstationed_enabled', checked)
          "
        >
          不将已入驻的干员放入宿舍
        </NCheckbox>
      </NFormItem>
    </NSpace>
  </div>
  <NSpace vertical>
    <NFormItem
      label="换班策略"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="top"
      :show-feedback="false"
      :label-style="{ justifyContent: 'center' }"
    >
      <NSelect
        :disabled="configurationDisabled.re"
        :value="props.configurations.mode"
        :options="infrastPlanOption"
        @update:value="value => handleUpdateConfiguration('mode', value)"
      />
    </NFormItem>
    <NFormItem
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
      :label-style="{ justifyContent: 'center' }"
      style="
         {
          margin-top: 110px;
        }
      "
    >
      <NUpload
        v-if="props.configurations.mode === 10000"
        :default-upload="false"
        :show-file-list="false"
        :multiple="false"
        accept=".json"
        @change="handleSelectInfrastConfig"
      >
        <NUploadDragger style="display: block">
          <NText> 点击或者拖动文件 </NText>
          <NText
            v-if="infrastConfig.loadStatus.value"
            depth="3"
            style="display: block"
          >
            {{ infrastConfig.title ? infrastConfig.title : '该配置没有标题' }}
          </NText>
        </NUploadDragger>
      </NUpload>
    </NFormItem>
    <NFormItem
      v-if="infrastConfig.loadStatus && props.configurations.mode === 10000"
      label="换班方案"
      label-placement="left"
    >
      <NSelect
        :disabled="configurationDisabled.nre"
        :value="props.configurations.plan_index"
        :options="infrastConfig.config.value"
        @update:value="value => handleUpdateConfiguration('plan_index', value)"
      />
    </NFormItem>
  </NSpace>
</template>

<style lang="less" scoped>
.facilities {
  display: flex;
  flex-direction: column;
  & > :deep(.n-checkbox) {
    margin: 4px;
  }
}

.infrast-configuration {
  display: flex;
  justify-content: space-between;
}

.infra-left {
  flex: 1;
  & > :deep(.n-form-item) {
    margin-bottom: 4px;
  }
}
</style>
