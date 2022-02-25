<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NInputNumber, NCheckbox, NForm, NFormItem, NSelect, NSlider } from 'naive-ui';
import useTaskStore from '@/store/tasks';
import _ from 'lodash';
import Sortable from 'sortablejs';

const taskStore = useTaskStore();
const facilitiesRef: Ref<HTMLElement | null> = ref(null);

type InfrastType =
  | "ManufacturingStation"
  | "TradingStation"
  | "ControlCenter"
  | "PowerStation"
  | "MeetingRoom"
  | "Office"
  | "Dormitory"

interface InfrastConfiguration {
  facilities: Array<{
    name: InfrastType,
    enabled: boolean
  }>,
  drone_usage:
  | 'None'
  | 'LMD'
  | 'Orumdum'
  | 'Battle Record'
  | 'Pure Gold'
  | 'Originium Shared'
  | 'Chip';
  mood_limit: number;
}

const infrastTranslation = {
  "ManufacturingStation": "制造站",
  "TradingStation": "贸易站",
  "ControlCenter": "控制中枢",
  "PowerStation": "发电站",
  "MeetingRoom": "会客室",
  "Office": "办公室",
  "Dormitory": "宿舍",
}

const droneUsageOptions = [
  {
    value: 'None',
    label: '不使用无人机'
  },
  {
    value: 'LMD',
    label: '贸易站 - 龙门币'
  },
  {
    value: 'Orumdum',
    label: '贸易站 - 合成玉'
  },
  {
    value: 'Battle Record',
    label: '制造站 - 作战记录'
  },
  {
    value: 'Pure Gold',
    label: '制造站 - 赤金'
  },
  {
    value: 'Originium Shared',
    label: '制造站 - 源石碎片'
  },
  {
    value: 'Chip',
    label: '制造站 - 芯片'
  },
]

// Demo only
const demoDeviceUuid = '12345678-90abcdefg';
const task = taskStore.deviceTasks[demoDeviceUuid].find(task => task.id === 'infrast');
const configuration = task?.configurations as unknown as InfrastConfiguration;

function onFacilityEnableUpdate(name: string, enabled: boolean) {
  const facility = configuration.facilities.find(f => name === f.name);
  if (facility) {
    facility.enabled = enabled;
  }
}

onMounted(() => {
  if (facilitiesRef.value) {
    new Sortable(facilitiesRef.value, {
      swapThreshold: 1,
      animation: 150,
      store: {
        get() {
          return configuration.facilities.map(facility => facility.name);
        },
        set(sortable) {
          const sort = sortable.toArray();
          configuration.facilities =
            _.sortBy(configuration.facilities, facility => sort.findIndex(v => facility.name === v))
        }
      },
    })
  }
})
</script>

<template>
  <NForm
    class="configuration-form infrast-configuration"
    size="small"
    :show-feedback="false"
    :show-label="false"
  >
    <NFormItem>
      <div class="facilities" ref="facilitiesRef">
        <NCheckbox
          v-for="([id, name]) of Object.entries(infrastTranslation)"
          :key="id"
          :data-id="id"
          :value="id"
          :label="name"
          :checked="configuration.facilities.find(f => f.name === id)?.enabled"
          @update:checked="(enabled) => onFacilityEnableUpdate(id, enabled)"
        />
      </div>
    </NFormItem>
    <div class="infra-left">
      <NFormItem label="无人机用途" :show-label="true" :label-style="{ justifyContent: 'center' }">
        <NSelect v-model:value="configuration.drone_usage" :options="droneUsageOptions" />
      </NFormItem>
      <NFormItem label="进驻宿舍理智阈值" :show-label="true" :label-style="{ justifyContent: 'center' }">
        <NSlider v-model:value="configuration.mood_limit" :max="23" :min="0" />
      </NFormItem>
    </div>
  </NForm>
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