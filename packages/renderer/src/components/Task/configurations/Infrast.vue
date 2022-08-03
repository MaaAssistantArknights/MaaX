<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { NCheckbox, NFormItem, NSelect, NSlider, NSpace } from 'naive-ui'
import _ from 'lodash'
import Sortable from 'sortablejs'

const facilitiesRef: Ref<HTMLElement | null> = ref(null)

// type InfrastType =
//   | 'ManufacturingStation'
//   | 'TradingStation'
//   | 'ControlCenter'
//   | 'PowerStation'
//   | 'MeetingRoom'
//   | 'Office'
//   | 'Dormitory';

// interface InfrastConfiguration {
//   facilities: Array<{
//     name: InfrastType;
//     enabled: boolean;
//   }>;
//   replenish: boolean;
//   drone_usage:
//   | 'None'
//   | 'LMD'
//   | 'Orumdum'
//   | 'Battle Record'
//   | 'Pure Gold'
//   | 'Originium Shard'
//   | 'Chip';
//   mood_limit: number;
// }

type facilityType =
  | 'Mfg'
  | 'Trade'
  | 'Control'
  | 'Power'
  | 'Reception'
  | 'Office'
  | 'Dorm';

const facilityOptions = {
  Mfg: '制造站',
  Trade: '贸易站',
  Power: '发电站',
  Control: '控制中枢',
  Reception: '会客室',
  Office: '办公室',
  Dormitory: '宿舍'
}

type droneUsageType =
  | '_NotUse'
  | 'Money'
  | 'SyntheticJade'
  | 'CombatRecord'
  | 'PureGold'
  | 'OriginStone'
  | 'Chip';

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

interface InfrastConfiguration {
  mode: number, // 保留模式, 暂无意义
  facility: facilityType[], // 换班基建
  drones: droneUsageType, // 无人机用途
  threshold: number, // 换班阈值
  replenish: boolean, // 自动源石补货
}

// const infrastTranslation = {
//   ManufacturingStation: '制造站',
//   TradingStation: '贸易站',
//   ControlCenter: '控制中枢',
//   PowerStation: '发电站',
//   MeetingRoom: '会客室',
//   Office: '办公室',
//   Dormitory: '宿舍'
// }

const props = defineProps<{
  configurations: InfrastConfiguration;
}>()

function onFacilityEnableUpdate (name: facilityType, enabled: boolean) {
  const facilitySet = new Set(props.configurations.facility)
  if (enabled) {
    facilitySet.add(name)
  } else {
    facilitySet.delete(name)
  }
  _.set(props.configurations, 'facility', Array.from(facilitySet))
}

let sortable: Sortable | undefined

onMounted(() => {
  if (facilitiesRef.value && !sortable) {
    sortable = new Sortable(facilitiesRef.value, {
      swapThreshold: 1,
      animation: 150,
      store: {
        get () {
          return props.configurations.facility.map(
            (facility) => facility
          )
        },
        set (sortable) {
          const sort = sortable.toArray()
          _.set(
            props.configurations,
            'facilities',
            _.sortBy(props.configurations.facility, (facility) =>
              sort.findIndex((v) => facility === v)
            )
          )
        }
      }
    })
  }
})
</script>

<template>
  <div class="configuration-form infrast-configuration">
    <NFormItem :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
       :show-feedback="false">
      <div class="facilities" ref="facilitiesRef">
        <NCheckbox
          v-for="[id, name] of Object.entries(facilityOptions)"
          :key="id"
          :data-id="id"
          :value="id"
          :label="name"
          :checked="
            configurations.facility.includes(id as facilityType)
          "
          @update:checked="(enabled) => onFacilityEnableUpdate(id as facilityType, enabled)"
        />
      </div>
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
          :value="props.configurations.drones"
          @update:value="
            (value) => _.set(props.configurations, 'drones', value)
          "
          :options="droneUsageOptions"
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
          :value="props.configurations.threshold"
          @update:value="
            (value) => _.set(props.configurations, 'threshold', value)
          "
          :max="23"
          :min="0"
        />
      </NFormItem>
      <NFormItem :show-label="false"
      size="small"
       :show-feedback="false">
        <NCheckbox
          :checked="props.configurations.replenish"
          @update:checked="
            (checked) =>
              _.set(props.configurations, 'replenish', checked)
          "
        >源石碎片自动补货</NCheckbox>
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
