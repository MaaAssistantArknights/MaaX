<script setup lang="ts">
import { inject } from 'vue'
import { NFormItem, NSpace, NTimePicker, NButton } from 'naive-ui'
import router from '@/router'
import useDeviceStore from '@/store/devices'
import useTaskStore from '@/store/tasks'
import { secondsToFormattedDuration, formattedDurationToSeconds } from '@/utils/time_picker'
import _ from 'lodash'
import { showMessage } from '@/utils/message'
import type { GetConfig } from './types'

const deviceStore = useDeviceStore()
const taskStore = useTaskStore()

type IdleConfig = GetConfig<'Idle'>

const props = defineProps<{
  configurations: IdleConfig
  taskIndex: number
}>()

const configurationDisabled = inject('configurationDisabled') as {
  re: boolean
  nre: boolean
}
const routeUuid = router.currentRoute.value.params.uuid as string

// function handleSkipSchedule () {
//   const device = deviceStore.getDevice(routeUuid)
//   if (device?.status !== 'tasking') {
//     show('设备不在任务中，不要瞎点!', { type: 'info', duration: 3000, closable: true })
//   } else if (!taskStore.getTask(routeUuid, task => task.task_id === props.taskIndex)?.enable) {
//     show('任务已被禁用，不要瞎点!', { type: 'info', duration: 3000, closable: true })
//   } else {
//     // TODO: skip schedule( set timeout to 0 )
//   }
// }
</script>
<template>
  <div class="configuration-form">
    <NSpace vertical>
      <NFormItem
        label="下个任务前等待"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NTimePicker
          :disabled="configurationDisabled.nre"
          :style="{ width: '100%' }"
          :default-formatted-value="secondsToFormattedDuration(props.configurations.delay)"
          :actions="['confirm']"
          @update:formatted-value="
            value => _.set(props.configurations, 'delay', formattedDurationToSeconds(value))
          "
        />
      </NFormItem>
      <NFormItem
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <!-- <NButton
          quaternary
          type="primary"
          :focusable="false"
          @click="handleSkipSchedule"
        >
          提前触发
        </NButton> -->
      </NFormItem>
    </NSpace>
  </div>
</template>
