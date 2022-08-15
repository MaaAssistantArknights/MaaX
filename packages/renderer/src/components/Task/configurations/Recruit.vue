<script setup lang="ts">
import { NInputNumber, NCheckbox, NFormItem } from 'naive-ui'
import _ from 'lodash'

interface RecruitConfiguration {
  // refresh_normal_tags: boolean;
  // use_expedited_plan: boolean;
  // maximum_times_of_recruitments: number;
  // recognitions: {
  //   '3 Stars': boolean;
  //   '4 Stars': boolean;
  //   '5 Stars': boolean;
  // };

  refresh: boolean, // 自动刷新三星词条
  select: number[],
  confirm: number[],
  times: number,
  set_time: boolean,
  expedite: boolean,
  expedite_times: number,
  skip_robot: boolean
}

const props = defineProps<{
  configurations: RecruitConfiguration;
}>()

function handleConfirmUpdate (checked:boolean, value:number) {
  if (checked) {
    // props.configurations.select.push(value)
    _.set(props.configurations, 'select', [...props.configurations.select, value])
  } else {
    // props.configurations.select = props.configurations.select.filter(v => v !== value)
    _.set(props.configurations, 'select', props.configurations.select.filter(v => v !== value))
  }

  // console.log(confirmSet)
  // _.set(props.configurations, 'confirm', Array.from(confirmSet))
  console.log(props.configurations.confirm)
}

function handleRecruitTimesUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  _.set(props.configurations, 'times', value)
}

function handleExpediteUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  _.set(props.configurations, 'expedite_times', value)
}

</script>

<template>
  <div
    class="configuration-form"
  >
    <NFormItem
      label="招募次数"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NInputNumber
        :value="configurations.times"
        @update:value="handleRecruitTimesUpdate"
      />
    </NFormItem>

    <NFormItem
      label="使用加急许可"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.expedite"
        @update:checked="
          (checked) =>
            _.set(props.configurations, 'expedite', checked)
        "
      />
    </NFormItem>
    <NFormItem
      label="使用加急许可数量"
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
        :value="props.configurations.expedite_times"
        :update-value-on-input="false"
        @update:value="handleExpediteUpdate"
      />
    </NFormItem>
    <NFormItem
      label="自动刷新3星tag"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.refresh"
        @update:checked="
          (checked) =>
          {
            _.set(props.configurations, 'refresh', checked)
          }
        "
      />
    </NFormItem>
    <NFormItem
      label="跳过小车"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.skip_robot"
        @update:checked="
          (checked) =>
          {
            _.set(props.configurations, 'skip_robot', checked)
          }
        "
      />
    </NFormItem>
    <NFormItem
      label="自动确认3星"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.confirm.find(v => v === 3)"
        @update:checked="
          (checked) =>
          {
            handleConfirmUpdate(checked, 3)
          }
        "
      />
    </NFormItem>
    <NFormItem
      label="自动确认4星"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.confirm.find(v => v === 4)"
        @update:checked="
          (checked) =>
          {
            handleConfirmUpdate(checked, 4)
          }
        "
      />
    </NFormItem>
    <NFormItem
      label="自动确认5星"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="configurations.confirm.find(v => v === 5)"
        @update:checked="
          (checked) =>
          {
            handleConfirmUpdate(checked, 5)
          }
        "
      />
    </NFormItem>
  </div>
</template>
