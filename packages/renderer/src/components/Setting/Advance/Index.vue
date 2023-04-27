<script lang="ts" setup>
import { inject } from 'vue'
import { NSelect, NFormItem, NSpace, NButton } from 'naive-ui'
import { showMessage } from '@/utils/message'
import { confirm } from '@/utils/dialog'
import useSettingStore from '@/store/settings'
import { TouchMode } from '@type/misc'
import { changeTouchMode } from '@/utils/core_functions'

const settingStore = useSettingStore()

const touchModeOptions = [
  {
    label: 'Minitouch(默认)',
    value: TouchMode.minitouch,
  },
  {
    label: 'MaaTouch(实验功能)',
    value: TouchMode.maatouch,
  },
  {
    label: 'Adb(兼容模式)',
    value: TouchMode.adb,
  },
]

async function handleChangeTouchMode(mode: TouchMode) {
  settingStore.setTouchMode(mode)
  const ret = await changeTouchMode(mode)
  showMessage(ret ? '修改成功' : '修改失败, 请查看log输出', {
    type: 'info',
    duration: 3000,
    closable: true,
  })
}

async function removeAllConfigDialog() {
  confirm({
    title: '重置所有配置',
    content: '重置所有配置将重启程序，你确定？',
    positiveText: '确定',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: async () => {
      await window.ipcRenderer.invoke('main.Util:RemoveAllConfig')
    },
  })
}

const coreSettingsDisabled = inject('coreSettingsDisabled') as { nre: boolean }

// function forceRepaceAdb () {

// }
</script>

<template>
  <div id="general">
    <h2 class="title">进阶设置</h2>
    <div id="advance_setting" class="border">
      <NSpace vertical justify="center" size="large">
        <NFormItem label="触控模式">
          <NSelect
            :value="settingStore.touchMode"
            :options="touchModeOptions"
            :style="{ width: '200px' }"
            :disabled="coreSettingsDisabled.nre"
            @update:value="handleChangeTouchMode"
          />
        </NFormItem>
        <NFormItem label="强制替换ADB">
          <NButton type="error" :disabled="coreSettingsDisabled.nre">
            强制替换ADB
          </NButton>
        </NFormItem>
        <NFormItem label="重置所有配置">
          <NButton
            type="error"
            :disabled="coreSettingsDisabled.nre"
            @click="removeAllConfigDialog"
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
