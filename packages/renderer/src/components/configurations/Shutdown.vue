<script setup lang="ts">
import {
  NInputNumber,
  NCheckbox,
  NForm,
  NFormItem,
  NInput,
  NSelect,
} from "naive-ui";
import _ from "lodash";

interface ShutdownConfiguration {
  option: string;
  delay: number; // 关闭延迟
}

const shutdownOptions = [
  {
    value: "shutdownEmulator",
    label: "仅关闭模拟器",
  },
  {
    value: "shutdownAll",
    label: "关闭模拟器和MAA",
  },
  {
    value: "shutdownWindows",
    label: "关闭Windows",
  },
];

const props = defineProps<{
  configurations: ShutdownConfiguration;
}>();
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
    <NFormItem label="关闭策略" :show-label="true">
      <NSelect
        :value="props.configurations.option"
        @update:value="(value) => _.set(props.configurations, 'option', value)"
        :options="shutdownOptions"
      />
    </NFormItem>

    <NFormItem label="关闭延迟">
      <NInputNumber
        :value="configurations.delay"
        @update:value="(value) => _.set(props.configurations, 'delay', value)"
      />
    </NFormItem>
  </NForm>
</template>
