<script setup lang="ts">
import { ref } from "vue";
import {
  NButton,
  NSwitch,
  NCheckbox,
  NModal,
  NForm,
  NFormItem,
} from "naive-ui";
import LevelChoose from "../LevelChooseModal.vue";
import _ from "lodash";

interface FightingConfiguration {
  medicine: boolean;
  expiration_first: boolean;
  originite_prime: boolean;
  levels: Array<Level>;
  special: {
    times: number;
    type: "current" | "last";
  };
}
// const routeUuid = router.currentRoute.value.params.uuid as string;

// const task = taskStore.deviceTasks[routeUuid].find(task => task.id === 'fight');
// const configurations = task?.configurations as unknown as FightingConfiguration;

const props = defineProps<{
  configurations: FightingConfiguration;
}>();

const showModal = ref(false);

function handleConfigurationUpdate(key: string, value: any) {
  // FIXME: 对props写入
  _.set(props.configurations, key, value);
}
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
    <NFormItem label="可用理智液">
      <NCheckbox
        :checked="props.configurations.medicine"
        @update:checked="
          (checked) => handleConfigurationUpdate('medicine', checked)
        "
      />
    </NFormItem>
    <NFormItem v-if="false">
      <!-- 不提供设置，Core暂不支持 -->
      <NButton
        quaternary
        @click="() => handleConfigurationUpdate('expiration_first', false)"
        :focusable="false"
        :disabled="!props.configurations.medicine"
      >理智回复量优先</NButton>
      <NSwitch
        :value="props.configurations.expiration_first"
        @update:value="
          (value) => handleConfigurationUpdate('expiration_first', value)
        "
        :disabled="!props.configurations.medicine"
      />
      <NButton
        quaternary
        @click="() => handleConfigurationUpdate('expiration_first', true)"
        :focusable="false"
        :disabled="!props.configurations.medicine"
      >过期时间优先</NButton>
    </NFormItem>
    <NFormItem label="可用源石">
      <NCheckbox
        :checked="props.configurations.originite_prime"
        @update:checked="
          (checked) => handleConfigurationUpdate('originite_prime', checked)
        "
      />
    </NFormItem>
    <NFormItem>
      <NButton
        quaternary
        type="primary"
        @click="showModal = true"
        :focusable="false"
      >关卡选择...</NButton>
    </NFormItem>
    <NModal
      v-model:show="showModal"
      display-directive="show"
      title="关卡选择"
      role="dialog"
      aria-modal="true"
    >
      <LevelChoose
        :levels="props.configurations.levels"
        :special="props.configurations.special"
        @update:special_type="
          (type) => handleConfigurationUpdate('special.type', type)
        "
      />
    </NModal>
  </NForm>
</template>
