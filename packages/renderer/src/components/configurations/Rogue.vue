<script setup lang="ts">
import { ref } from 'vue';
import { NForm, NFormItem, NButton, NModal, NSelect, NCard } from 'naive-ui';
import useTaskStore from '@/store/tasks';
import router from '@/router';

type Strategies = 'ToTheEnd' | 'AfterFirstLevel' | 'AfterMoney'

interface RogueConfiguration {
  strategy: Strategies;
  operators: Array<string>;
}

const strategyOptions: Array<{
  label: string,
  value: Strategies
}> = [
    {
      label: '尽可能往后打',
      value: 'ToTheEnd'
    }, {
      label: '刷源石锭投资，第一层商店后退出',
      value: 'AfterFirstLevel'
    }, {
      label: '刷源石锭投资，投资后退出',
      value: 'AfterMoney'
    }
  ];

const routeUuid = router.currentRoute.value.params.uuid as string;
const taskStore = useTaskStore();
const task = taskStore.deviceTasks[routeUuid].find(task => task.id === 'rogue');
const configuration = task?.configurations as unknown as RogueConfiguration;
const showModal = ref(false);

</script>

<template>
  <NForm
    class="configuration-form rogue-configuration"
    size="small"
    :show-feedback="false"
    :label-align="'left'"
    :label-placement="'top'"
    :label-width="'150px'"
  >
    <NFormItem label="通关策略">
      <NSelect
        v-model:value="configuration.strategy"
        :options="strategyOptions"
      />
    </NFormItem>
    <NFormItem :show-label="false">
      <NButton
        quaternary
        type="primary"
        @click="showModal = true"
        :focusable="false"
      >招募干员顺序...</NButton>
    </NFormItem>
    <NModal
      v-model:show="showModal"
      title="招募干员顺序"
      role="dialog"
      aria-modal="true"
    >
      <NCard
        style="width: 600px;"
        role="dialog"
        aria-modal="true"
        title="招募干员顺序"
      ></NCard>
    </NModal>
  </NForm>
</template>

<style lang="less" scoped>
</style>