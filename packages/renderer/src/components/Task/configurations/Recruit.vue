<script setup lang="ts">
import { NInputNumber, NCheckbox, NFormItem } from 'naive-ui'
import _ from 'lodash'
import { inject } from 'vue'

interface RecruitConfiguration {
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
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as
  (key: string, value: any, index: number) => void

function handleUpdateConfiguration (key: string, value: any) {
  updateTaskConfigurations(key, value, props.taskIndex)
}

function handleConfirmUpdate (checked: boolean, value: number) {
  if (checked) {
    handleUpdateConfiguration('confirm', _.uniq([...props.configurations.confirm, value]))
  } else {
    handleUpdateConfiguration('confirm', _.uniq(props.configurations.confirm.filter(v => v !== value)))
  }
}

function handleRecruitTimesUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleUpdateConfiguration('times', value)
}

function handleExpediteUpdate (value: number | null) {
  if (value === null) value = 6
  if (value < 0) value = 999
  if (value > 999) value = 0
  handleUpdateConfiguration('expedite_times', value)
}

</script>

<template>
  <div class="configuration-form">
    <NFormItem
      label="招募次数"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NInputNumber :value="configurations.times" @update:value="handleRecruitTimesUpdate" />
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
            handleUpdateConfiguration('expedite', checked)
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
          (checked) => {
            handleUpdateConfiguration('refresh', checked)
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
          (checked) => {
            handleUpdateConfiguration('skip_robot', checked)
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
        :checked="configurations.confirm.includes(3)"
        @update:checked="
          (checked) => {
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
        :checked="configurations.confirm.includes(4)"
        @update:checked="
          (checked) => {
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
        :checked="configurations.confirm.includes(5)"
        @update:checked="
          (checked) => {
            handleConfirmUpdate(checked, 5)
          }
        "
      />
    </NFormItem>
  </div>
</template>
