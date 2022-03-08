<script setup lang="ts">
import { ref } from "vue";
import _ from "lodash";
import { NForm, NFormItem, NButton, NModal, NSelect, NCard } from "naive-ui";

type Strategies = "ToTheEnd" | "AfterFirstLevel" | "AfterMoney";

interface RogueConfiguration {
  strategy: Strategies;
  operators: Array<string>;
}

const strategyOptions: Array<{
  label: string;
  value: Strategies;
}> = [
  {
    label: "尽可能往后打",
    value: "ToTheEnd",
  },
  {
    label: "刷源石锭投资，第一层商店后退出",
    value: "AfterFirstLevel",
  },
  {
    label: "刷源石锭投资，投资后退出",
    value: "AfterMoney",
  },
];

const props = defineProps<{
  configurations: RogueConfiguration;
}>();

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
        :value="props.configurations.strategy"
        :options="strategyOptions"
        @update:value="
          (value) => _.set(props.configurations, 'strategy', value)
        "
      />
    </NFormItem>
    <NFormItem :show-label="false">
      <NButton
        quaternary
        type="primary"
        @click="showModal = true"
        :focusable="false"
      >干员招募顺序...</NButton>
    </NFormItem>
    <NModal
      v-model:show="showModal"
      title="干员招募顺序"
      display-directive="show"
      role="dialog"
      aria-modal="true"
    >
      <NCard
        style="width: 600px"
        role="dialog"
        aria-modal="true"
        title="干员招募顺序"
      ></NCard>
    </NModal>
  </NForm>
</template>

<style lang="less" scoped></style>
