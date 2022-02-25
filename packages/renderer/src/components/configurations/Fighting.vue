<script setup lang="ts">
import { ref } from 'vue';
import { NButton, NSwitch, NCheckbox, NModal, NForm, NFormItem } from 'naive-ui';
import LevelChoose from '../LevelChoose.vue';
import useTaskStore from '@/store/tasks';

const taskStore = useTaskStore();

interface FightingConfiguration {
  medicine: boolean
  expiration_first: boolean
  originite_prime: boolean
  levels: []
}

// Demo only
const demoDeviceUuid = '12345678-90abcdefg';

const task = taskStore.deviceTasks[demoDeviceUuid].find(task => task.id === 'fight');
const configuration = task?.configurations as unknown as FightingConfiguration;

const showModal = ref(false);

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
      <NCheckbox v-model:checked="configuration.medicine" />
    </NFormItem>
    <NFormItem>
      <NButton
        quaternary
        @click="configuration.expiration_first = false"
        :focusable="false"
        :disabled="!configuration.medicine"
      >理智回复量优先</NButton>
      <NSwitch
        v-model:value="configuration.expiration_first"
        :disabled="!configuration.medicine"
      />
      <NButton
        quaternary
        @click="configuration.expiration_first = true"
        :focusable="false"
        :disabled="!configuration.medicine"
      >过期时间优先</NButton>
    </NFormItem>
    <NFormItem label="可用源石">
      <NCheckbox v-model:checked="configuration.originite_prime" />
    </NFormItem>
    <NFormItem>
      <NButton
        quaternary
        type="primary"
        @click="showModal = true"
        :focusable="false"
      >关卡选择</NButton>
    </NFormItem>
    <NModal
      v-model:show="showModal"
      title="关卡选择"
      role="dialog"
      aria-modal="true"
    >
      <LevelChoose :levels="configuration.levels" />
    </NModal>
  </NForm>
</template>
