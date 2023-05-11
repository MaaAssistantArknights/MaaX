<script setup lang="ts">
import { inject } from 'vue'
import { NFormItem, NInput, NSelect, NSpace, NTimePicker } from 'naive-ui'
import router from '@/router'
import useDeviceStore from '@/store/devices'
import type { GetConfig } from './types'
import { secondsToFormattedDuration, formattedDurationToSeconds } from '@/utils/time_picker'
import _ from 'lodash'

const deviceStore = useDeviceStore()

type EmulatorConfig = GetConfig<'Emulator'>

const props = defineProps<{
  configurations: EmulatorConfig
  taskIndex: number
}>()

const updateTaskConfigurations = inject('update:configuration') as (
  key: string,
  value: any,
  index: number
) => void

const configurationDisabled = inject('configurationDisabled') as {
  re: boolean
  nre: boolean
}

const routeUuid = router.currentRoute.value.params.uuid as string
</script>
<template>
  <div class="configuration-form">
    <NSpace vertical>
      <NFormItem
        label="等待模拟器启动"
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
            (value: string | null) =>
              _.set(
                props.configurations,
                'delay',
                formattedDurationToSeconds(value)
              )
          "
        />
      </NFormItem>
    </NSpace>
  </div>
</template>
