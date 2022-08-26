<script setup lang="ts">
import {
  NFormItem,
  NSelect,
  NTimePicker,
  NSpace,
  NButton
} from 'naive-ui'
import _ from 'lodash'
import {
  secondsToFormattedDuration,
  formattedDurationToSeconds
} from '@/utils/time_picker'
// import useTaskIdStore from '@/store/taskId'
import router from '@/router'
import { show } from '@/utils/message'
import logger from '@/hooks/caller/logger'

/**
 * 关机策略处理流程:
 *   在配置中有一个enable选项，初始始终为关闭，且在ui上不显示。
 *   当开启关闭子任务且任务链开始后，将enable设置为true,
 *   当在任意时期点击取消关闭任务时，将enable设置为false,
 *   当全部任务完成时，触发回调并检测enable是否为true, 如果开启则进行关闭操作
 */

interface ShutdownConfiguration {
  option: string;
  delay: number; // 关闭延迟
  enable: boolean // 是否启用关闭策略，这个配置在UI上不展示，当启用关机任务时标记为true，点击取消关机后标记为false
}

const routeUuid = router.currentRoute.value.params.uuid as string
// const taskIdStore = useTaskIdStore()

const shutdownOptions = [
  {
    value: 'shutdownEmulator',
    label: '关闭模拟器'
  },
  {
    value: 'shutdownAll',
    label: '关闭模拟器和MAA'
  },
  {
    value: 'shutdownComputer',
    label: '关闭计算机'
  }
]

function handleCancelShutdown () {
  // const taskId = taskIdStore.getTaskId(routeUuid, 'shutdown')
  logger.debug('cancel shutdown task on uuid', routeUuid)
  // logger.debug('cancel task_id', taskId?.[0])
  // taskId?.forEach((id) => {
  //   clearInterval(id)
  // })
  show('已取消定时任务', { type: 'success' })
}

const props = defineProps<{
  configurations: ShutdownConfiguration;
}>()
</script>
<template>
  <div
    class="configuration-form"
  >
    <NSpace vertical>
      <NFormItem
        label="关闭策略"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NSelect
          :value="props.configurations.option"
          :options="shutdownOptions"
          @update:value="
            (value) => _.set(props.configurations, 'option', value)
          "
        />
      </NFormItem>

      <NFormItem
        label="关闭延迟"
        :show-label="true"
        size="small"
        label-align="left"
        label-placement="left"
        :show-feedback="false"
      >
        <NTimePicker
          :style="{ width: '100%' }"
          :default-formatted-value="
            secondsToFormattedDuration(props.configurations.delay)
          "
          :actions="['confirm']"
          @update:formatted-value="
            (value) =>
              _.set(
                props.configurations,
                'delay',
                formattedDurationToSeconds(value)
              )
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
        <NButton
          quaternary
          type="primary"
          :focusable="false"
          @click="handleCancelShutdown"
        >
          取消定时
        </NButton>
      </NFormItem>
    </NSpace>
  </div>
</template>
