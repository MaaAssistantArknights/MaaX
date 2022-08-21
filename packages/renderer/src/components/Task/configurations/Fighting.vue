<script setup lang="ts">
import { ref } from 'vue'
import {
  NButton,
  // NSwitch,
  // NCheckbox,
  NModal,
  NFormItem,
  NInputNumber,
  NSpace,
  NSelect
  // NAlert
} from 'naive-ui'
import LevelChoose from '../LevelChooseModal.vue'
import _ from 'lodash'

// interface FightingConfiguration {
//   medicine: number;
//   stone: number;
//   originite_prime: boolean;
//   levels: Array<Level>;
//   special: {
//     times: number;
//     type: 'current' | 'last';
//   };
// }

interface FightingConfiguration {
  stage: string;
  medicine: number;
  stone: number;
  times: number;
  drops: {};
  report_to_penguin: boolean;
  penguin_id: string;
  server: string;
  client_type: string;
}

// FIXME: 不应该硬编码(
// 最好也整成图片的选择形式?
const supportStages = [
  { label: '当前关卡', value: '' },
  { label: '上次作战', value: 'LastBattle' },
  { label: 'LE-5', value: 'LE-5' },
  { label: 'LE-7', value: 'LE-7' },
  { label: 'LE-8', value: 'LE-8' },
  { label: '1-7', value: '1-7' },
  { label: '龙门币-6/5', value: 'CE-6' },
  { label: '经验-6/5', value: 'LS-6' },
  { label: '红票-5', value: 'AP-5' },
  { label: '技能-5', value: 'CA-5' }
]

const props = defineProps<{
  configurations: FightingConfiguration;
}>()

const showModal = ref(false)

function handleConfigurationUpdate (key: string, value: any) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  _.set(props.configurations, key, value)
}

function handleMedicineUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleConfigurationUpdate('medicine', value)
}

function handleTimesUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleConfigurationUpdate('times', value)
}

function handleStoneUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleConfigurationUpdate('stone', value)
}

</script>

<template>
  <div class="configuration-form">
    <NSpace vertical>
      <NFormItem
        label="选择关卡"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :value="props.configurations.stage"
          :options="supportStages"
          @update:value="(value) => _.set(props.configurations, 'stage', value)"
        />
      </NFormItem>
      <NFormItem
        label="作战次数"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <!-- <NCheckbox
        :checked="props.configurations.medicine"
        @update:checked="
          (checked) => handleConfigurationUpdate('medicine', checked)
        "
        />-->
        <NInputNumber
          :value="props.configurations.times"
          :update-value-on-input="false"
          @update:value="handleTimesUpdate"
        />
      </NFormItem>
      <NFormItem
        label="使用理智液数量"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
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
      <NFormItem
        label="使用源石数量"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
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
      <NFormItem
        :show-feedback="false"
        :show-label="false"
      >
        <NButton
          quaternary
          type="primary"
          :focusable="false"
          @click="showModal = true"
        >
          掉落物选择...
        </NButton>
      </NFormItem>
    </NSpace>
    <!-- TODO: 关卡选择修改为掉落选择 -->
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
  </div>
</template>
