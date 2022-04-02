<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton,
  // NSwitch,
  // NCheckbox,
  NModal,
  NForm,
  NFormItem,
  NInputNumber,
  NSpace
  // NAlert
} from 'naive-ui'
import LevelChoose from '../LevelChooseModal.vue'
import _ from 'lodash'

interface FightingConfiguration {
  medicine: number;
  stone: number;
  originite_prime: boolean;
  levels: Array<Level>;
  special: {
    times: number;
    type: 'current' | 'last';
  };
}

const props = defineProps<{
  configurations: FightingConfiguration;
}>()

const showModal = ref(false)

function handleConfigurationUpdate (key: string, value: any) {
  // FIXME: 对props写入
  _.set(props.configurations, key, value)
}

function handleMedicineUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleConfigurationUpdate('medicine', value)
}

function handleStoneUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleConfigurationUpdate('stone', value)
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
    <NSpace vertical>
      <NFormItem label="使用理智液数量">
        <!-- <NCheckbox
        :checked="props.configurations.medicine"
        @update:checked="
          (checked) => handleConfigurationUpdate('medicine', checked)
        "
        />-->
        <NInputNumber
          :value="props.configurations.medicine"
          :update-value-on-input="false"
          @update:value="handleMedicineUpdate"
        />
      </NFormItem>
      <!-- 不提供设置，Core暂不支持 -->
      <!-- <NFormItem>
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
      </NFormItem>-->
      <NFormItem label="使用源石数量">
        <!-- <NCheckbox
        :checked="props.configurations.originite_prime"
        @update:checked="
          (checked) => handleConfigurationUpdate('originite_prime', checked)
        "
        />-->
        <NInputNumber
          :value="props.configurations.stone"
          :update-value-on-input="false"
          @update:value="handleStoneUpdate"
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
    </NSpace>
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
