<script setup lang="ts">
import { inject, computed } from 'vue'
import { NCheckbox, NFormItem, NSelect, NSlider, NSpace } from 'naive-ui'
import Draggable from 'vuedraggable'
import _ from 'lodash'

type FacilityType =
  | 'Mfg'
  | 'Trade'
  | 'Control'
  | 'Power'
  | 'Reception'
  | 'Office'
  | 'Dorm';

type droneUsageType =
  | '_NotUse'
  | 'Money'
  | 'SyntheticJade'
  | 'CombatRecord'
  | 'PureGold'
  | 'OriginStone'
  | 'Chip';

interface InfrastConfiguration {
  mode: number, // 保留模式, 暂无意义
  facility: FacilityType[], // 换班基建
  drones: droneUsageType, // 无人机用途
  threshold: number, // 换班阈值
  replenish: boolean, // 自动源石补货
}

const droneUsageOptions: {
  value: droneUsageType;
  label: string;
}[] = [
  {
    value: '_NotUse', // _NotUse
    label: '不使用无人机'
  },
  {
    value: 'Money', // LMD
    label: '贸易站 - 龙门币'
  },
  {
    value: 'SyntheticJade', // Orumdum
    label: '贸易站 - 合成玉'
  },
  {
    value: 'CombatRecord', // 'Battle Record'
    label: '制造站 - 作战记录'
  },
  {
    value: 'PureGold', // 'Pure Gold',
    label: '制造站 - 赤金'
  },
  {
    value: 'OriginStone', // 'Originium Shard'
    label: '制造站 - 源石碎片'
  },
  {
    value: 'Chip', // Chip
    label: '制造站 - 芯片'
  }
]

const allFacilities: FacilityType[] = [
  'Mfg',
  'Trade',
  'Power',
  'Control',
  'Reception',
  'Office',
  'Dorm'
]

const props = defineProps<{
  configurations: InfrastConfiguration;
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as
  (key: string, value: any, index: number) => void
const configurationDisabled = inject('configurationDisabled') as {re: boolean, nre: boolean}

const facilities = computed(() => {
  const diff = _.difference(allFacilities, props.configurations.facility)
  return [...props.configurations.facility, ...diff].map(
    facility => ({
      name: facility,
      enabled: props.configurations.facility.includes(facility)
    })
  )
})
function handleUpdateConfiguration (key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function onFacilityEnableUpdate (name: string, enabled: boolean) {
  const facs = _.cloneDeep(facilities.value)
  const fac = facs.find(facility => facility.name === name)
  if (fac) {
    fac.enabled = enabled
  }
  const updated = facs.filter(facility => facility.enabled).map(facility => facility.name)
  handleUpdateConfiguration('facility', updated)
}

function onFacilitySortUpdate () {
  const updated = facilities.value.filter(facility => facility.enabled).map(facility => facility.name)
  handleUpdateConfiguration('facility', updated)
}
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
        <template #item="{element}">
          <NCheckbox
            :checked="element.enabled"
            :label="$t(`task.infrast.${element.name}`)"
            @update:checked="checked => onFacilityEnableUpdate(element.name, checked)"
          />
        </template>
      </Draggable>
    </NFormItem>
    <NSpace
      class="infra-left"
      vertical
    >
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
          @update:value="
            (value) => handleUpdateConfiguration('drones', value)
          "
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
          @update:value="
            (value) => handleUpdateConfiguration('threshold', value)
          "
        />
      </NFormItem>
      <NFormItem
        :show-label="false"
        size="small"
        :show-feedback="false"
      >
        <NCheckbox
          :disabled="configurationDisabled.re"
          :checked="props.configurations.replenish"
          @update:checked="
            (checked) =>
              handleUpdateConfiguration('replenish', checked)
          "
        >
          源石碎片自动补货
        </NCheckbox>
      </NFormItem>
    </NSpace>
  </div>
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
