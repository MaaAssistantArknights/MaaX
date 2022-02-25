<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NInputNumber, NCheckbox, NForm, NFormItem, NCheckboxGroup } from 'naive-ui';
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

// Demo only
const demoDeviceUuid = '12345678-90abcdefg';
const task = taskStore.deviceTasks[demoDeviceUuid].find(task => task.id === 'infrast');
const configuration = task?.configurations as unknown as InfrastConfiguration;

function onFacilitiesUpdate(facilities: (string | number)[]) {
  for (const facility of configuration.facilities) {
    if (facilities.find(name => name === facility.name)) {
      facility.enabled = true;
    } else {
      facility.enabled = false;
    }
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
          onFacilitiesUpdate(sort);
        }
      },
    })
  }
})
</script>

<template>
  <NForm
    class="configuration-form"
    size="small"
    :show-feedback="false"
    :label-align="'left'"
    :label-placement="'left'"
    :label-width="'auto'"
  >
    <NFormItem>
      <NCheckboxGroup
        :value="configuration.facilities.map(facility => facility.name)"
        @update:value="onFacilitiesUpdate"
      >
        <div class="facilities" ref="facilitiesRef">
          <NCheckbox
            v-for="([id, name]) of Object.entries(infrastTranslation)"
            :key="id"
            :data-id="id"
            :value="id"
            :label="name"
          />
        </div>
      </NCheckboxGroup>
    </NFormItem>
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
</style>