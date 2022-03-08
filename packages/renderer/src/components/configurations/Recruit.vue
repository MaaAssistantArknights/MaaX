<script setup lang="ts">
import { NInputNumber, NCheckbox, NForm, NFormItem } from "naive-ui";
import _ from "lodash";

interface RecruitConfiguration {
  refresh_normal_tags: boolean;
  use_expedited_plan: boolean;
  maximum_times_of_recruitments: number;
  recognitions: {
    "3 Stars": boolean;
    "4 Stars": boolean;
    "5 Stars": boolean;
  };
}

const props = defineProps<{
  configurations: RecruitConfiguration;
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
    <NFormItem label="自动刷新3星tag">
      <NCheckbox
        :checked="props.configurations.refresh_normal_tags"
        @update:checked="
          (checked) =>
            _.set(props.configurations, 'refresh_normal_tags', checked)
        "
      />
    </NFormItem>
    <NFormItem label="使用加急许可">
      <NCheckbox
        :checked="configurations.use_expedited_plan"
        @update:checked="
          (checked) =>
            _.set(props.configurations, 'use_expedited_plan', checked)
        "
      />
    </NFormItem>
    <NFormItem label="招募次数">
      <NInputNumber
        :value="configurations.maximum_times_of_recruitments"
        @update:value="
          (value) =>
            _.set(props.configurations, 'maximum_times_of_recruitments', value)
        "
        :min="1"
      />
    </NFormItem>
    <NFormItem label="自动确认3星">
      <NCheckbox
        :checked="configurations.recognitions['3 Stars']"
        @update:checked="
          (checked) =>
            _.set(props.configurations, ['recognitions', '3 Stars'], checked)
        "
      />
    </NFormItem>
    <NFormItem label="自动确认4星">
      <NCheckbox
        :checked="configurations.recognitions['4 Stars']"
        @update:checked="
          (checked) =>
            _.set(props.configurations, ['recognitions', '4 Stars'], checked)
        "
      />
    </NFormItem>
    <NFormItem label="自动确认5星">
      <NCheckbox
        :checked="configurations.recognitions['5 Stars']"
        @update:checked="
          (checked) =>
            _.set(props.configurations, ['recognitions', '5 Stars'], checked)
        "
      />
    </NFormItem>
  </NForm>
</template>
