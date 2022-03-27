<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import _ from "lodash";
import {
  NForm,
  NFormItem,
  NButton,
  NModal,
  NSelect,
  NCard,
  NImage,
  NSkeleton,
  NScrollbar,
  NInputNumber,
  NSpace,
  NTimePicker,
  NAvatar,
} from "naive-ui";
import gamedataApi from "@/api/gamedata";
import { getOperatorAvatar, getSkillImage } from "@/utils/game_image";
import {
  secondsToFormattedDuration,
  formattedDurationToSeconds,
} from "@/utils/time_picker";

type Strategies = "ToTheEnd" | "AfterFirstLevel" | "AfterMoney"

interface RogueConfiguration {
  strategy: Strategies
  operators: Array<string>
  duration: number
}

const strategyOptions: Array<{
  label: string
  value: Strategies
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
  configurations: RogueConfiguration
}>();

const showModal = ref(false);

const operators: Ref<any[]> = ref([]);
const allSkills: Ref<any> = ref();

onMounted(async () => {
  operators.value = Object.values(
    (await gamedataApi.getAllOperators()) as Object
  ).filter((operator) => operator.nationId !== null);

  operators.value.forEach(async (operator) => {
    operator.image = await getOperatorAvatar(operator.name);
  });

  allSkills.value = await gamedataApi.getAllSkills() as any;
  Object.keys(allSkills.value).forEach(async key => {
    allSkills.value[key].name = allSkills.value[key].levels[0].name;
    try {
      allSkills.value[key].image = await getSkillImage(allSkills.value[key].name);
    } catch (e) {
      allSkills.value[key].image = null;
    }
  });
  

});
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
    <NSpace vertical>
      <NFormItem label="运行时间">
        <NTimePicker
          :style="{ width: '100%' }"
          :default-formatted-value="
            secondsToFormattedDuration(props.configurations.duration)
          "
          :actions="['confirm']"
          @update:formatted-value="
            (value) =>
              _.set(
                props.configurations,
                'duration',
                formattedDurationToSeconds(value)
              )
          "
        />
      </NFormItem>

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
    </NSpace>
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
      >
        <NScrollbar :style="{ maxHeight: '600px' }">
          <NSpace
            :align="'center'"
            v-for="operator in operators.reverse()"
            :key="operator.name"
            class="operator-row"
          >
            <!-- <span>{{ operator.name }}</span> -->
            <NAvatar :src="operator.image" :size="48" />
            <NSpace class="operator-skills">
              <NAvatar
                v-for="(skill, index) in operator.skills"
                :key="index"
                :src="allSkills[skill.skillId].image"
              />
            </NSpace>
          </NSpace>
        </NScrollbar>
      </NCard>
    </NModal>
  </NForm>
</template>

<style lang="less" scoped>
.operator-row {
  display: flex;
  justify-content: space-between;
}

.operator-skills {
  flex: 1;
}
</style>
