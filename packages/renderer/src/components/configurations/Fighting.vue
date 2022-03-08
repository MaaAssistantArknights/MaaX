<script setup lang="ts">
import { ref } from "vue";
import { NButton, NSwitch, NCheckbox, NModal, NForm, NFormItem } from "naive-ui";
import LevelChoose from "../LevelChooseModal.vue";
import useTaskStore from "@/store/tasks";
import router from "@/router";

const taskStore = useTaskStore();

interface FightingConfiguration {
  medicine: boolean
  expiration_first: boolean
  originite_prime: boolean
  levels: Array<Level>
  special: {
    times: number;
    type: "current" | "last"
  }
}
const routeUuid = router.currentRoute.value.params.uuid as string;

const task = taskStore.deviceTasks[routeUuid].find(task => task.id === "fight");
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
        :levels="configuration.levels"
        :special="configuration.special"
        @update:special_type="(type) => configuration.special.type = type"
      />
    </NModal>
  </NForm>
</template>
