<script setup lang="ts">
import { NForm, NFormItem, NInput, NSelect, NSpace } from 'naive-ui'
import _ from 'lodash'

interface EmulatorConfiguration {
  emulator_path: string; // 模拟器路径
  arg: string; // 额外参数，用于启动指定模拟器
  delay: 30 | 60 | 120 | 300 | 600; // 等待模拟器启动完成的延迟
}

const delayOptions = [
  {
    value: 30,
    label: '30秒 - 不建议'
  },
  {
    value: 60,
    label: '一分钟'
  },
  {
    value: 120,
    label: '两分钟'
  },
  {
    value: 300,
    label: '五分钟'
  },
  {
    value: 600,
    label: '十分钟'
  }
]

const props = defineProps<{
  configurations: EmulatorConfiguration;
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
      <NFormItem label="模拟器路径">
        <NInput
          :value="configurations.emulator_path"
          @update:value="
            (value) => _.set(props.configurations, 'emulator_path', value)
          "
        />
      </NFormItem>

      <NFormItem label="启动参数">
        <NInput
          :value="configurations.arg"
          @update:value="
            (value) => _.set(props.configurations, 'arg', value)
          "
        />
      </NFormItem>

      <NFormItem label="启动后延迟" :show-label="true">
        <NSelect
          :value="props.configurations.delay"
          @update:value="(value) => _.set(props.configurations, 'delay', value)"
          :options="delayOptions"
        />
      </NFormItem>
    </NSpace>
  </NForm>
</template>
