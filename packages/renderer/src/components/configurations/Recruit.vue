<script setup lang="ts">
import { NInputNumber, NCheckbox, NForm, NFormItem } from 'naive-ui';
import useTaskStore from '@/store/tasks';

const taskStore = useTaskStore();

interface RecruitConfiguration {
  refresh_normal_tags: boolean;
  use_expedited_plan: boolean;
  maximum_times_of_recruitments: number,
  recognitions: {
    '3 Stars': boolean,
    '4 Stars': boolean,
    '5 Stars': boolean,
  };
}

// Demo only
const demoDeviceUuid = '12345678-90abcdefg';

const task = taskStore.deviceTasks[demoDeviceUuid].find(task => task.id === 'recruit');
const configuration = task?.configurations as unknown as RecruitConfiguration;

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
      <NCheckbox v-model:checked="configuration.refresh_normal_tags" />
    </NFormItem>
    <NFormItem label="使用加急许可">
      <NCheckbox v-model:checked="configuration.use_expedited_plan" />
    </NFormItem>
    <NFormItem label="招募次数">
      <NInputNumber
        v-model:value="configuration.maximum_times_of_recruitments"
        :min="1"
      />
    </NFormItem>
    <NFormItem label="自动确认3星">
      <NCheckbox v-model:checked="configuration.recognitions['3 Stars']" />
    </NFormItem>
    <NFormItem label="自动确认4星">
      <NCheckbox v-model:checked="configuration.recognitions['4 Stars']" />
    </NFormItem>
    <NFormItem label="自动确认5星">
      <NCheckbox v-model:checked="configuration.recognitions['5 Stars']" />
    </NFormItem>
  </NForm>
</template>
