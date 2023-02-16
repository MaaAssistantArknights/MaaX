<script lang="ts" setup>
import {
  NSelect,
  NFormItem,
  NSpace,
  NButton
} from 'naive-ui'
import { show } from '@/utils/message'
import useSettingStore, { TouchMode } from '@/store/settings'

const settingStore = useSettingStore()

const touchModeOptions = [
  {
    label: 'Minitouch(默认)',
    value: TouchMode.minitouch
  },
  {
    label: 'MaaTouch(实验功能)',
    value: TouchMode.maatouch
  },
  {
    label: 'Adb(兼容模式)',
    value: TouchMode.adb
  }
]

function handleChangeTouchMode (mode: TouchMode) {
  settingStore.setTouchMode(mode)
  show('将在下一次启动后生效', { type: 'info', duration: 3000, closable: true })
}

// function forceRepaceAdb () {

// }

</script>

<template>
  <div id="general">
    <h2 class="title">
      进阶设置
    </h2>
    <div id="advance_setting" class="border">
      <NSpace
        vertical
        justify="center"
        size="large"
      >
        <NFormItem
          label="触控模式"
        >
          <NSelect
            :value="settingStore.touchMode"
            :options="touchModeOptions"
            :style="{ width: '200px' }"
            @update:value="handleChangeTouchMode"
          />
        </NFormItem>
        <NFormItem
          label="强制替换ADB"
        >
          <NButton
            type="warning"
          >
            强制替换ADB
          </NButton>
        </NFormItem>
        <NFormItem
          label="重置所有配置"
        >
          <NButton
            type="warning"
          >
            重置所有配置
          </NButton>
        </NFormItem>
      </NSpace>
    </div>
  </div>
</template>

<style>
.border {
  /* GitHub DangerZone color */
  border: 1px solid rgba(248, 81, 73, 0.4);
  padding-top: 15px;
  padding-bottom: 15px;
  border-radius: 10px;
}

</style>
