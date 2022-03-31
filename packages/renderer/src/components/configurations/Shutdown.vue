<script setup lang="ts">
import {
  NInputNumber,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NTimePicker,
  NSpace
} from 'naive-ui'
import _ from 'lodash'
import { secondsToFormattedDuration, formattedDurationToSeconds } from '@/utils/time_picker'

interface ShutdownConfiguration {
  option: string;
  delay: number; // 关闭延迟
}

const shutdownOptions = [
  {
    value: 'shutdownEmulator',
    label: '仅关闭模拟器'
  },
  {
    value: 'shutdownAll',
    label: '关闭模拟器和MAA'
  },
  {
    value: 'shutdownComputer',
    label: '关闭电脑'
  }
]

const props = defineProps<{
  configurations: ShutdownConfiguration;
}>()

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
    <NSpace vertical>
      <NFormItem label="关闭策略" :show-label="true">
        <NSelect
          :value="props.configurations.option"
          @update:value="(value) => _.set(props.configurations, 'option', value)"
          :options="shutdownOptions"
        />
      </NFormItem>

      <NFormItem label="关闭延迟">
        <NTimePicker
          :style="{ width: '100%' }"
          :default-formatted-value="
            secondsToFormattedDuration(props.configurations.delay)
          "
          :actions="['confirm']"
          @update:formatted-value="
            value =>
              _.set(props.configurations, 'delay', formattedDurationToSeconds(value))
          "
        />
      </NFormItem>
    </NSpace>
  </NForm>
</template>
