<script lang="ts" setup>
import {
  NSelect,
  NSwitch,
  NFormItem,
  NTooltip,
  NSpace
} from 'naive-ui'
import useSettingStore, { Locale } from '@/store/settings'
import useDeviceStore from '@/store/devices'
import { loadCoreResources } from '@/utils/load_extra_resources'
import { ref } from 'vue'

const settingStore = useSettingStore()
const deviceStore = useDeviceStore()

const localeOptions = [
  {
    label: '简体中文',
    value: Locale.zhCN
  },
  {
    label: 'English',
    value: Locale.enUS
  }
]

const dropdownCount = ref(0)
let timer = 0

function handleLanguageSelectClick () {
  if (timer) {
    clearTimeout(timer)
  }
  dropdownCount.value += 1
  if (dropdownCount.value === 5) {
    settingStore.toggleMonsters()
  }
  timer = window.setTimeout(() => {
    dropdownCount.value = 0
  }, 1000)
}

function handleChangeLocale (locale: Locale) {
  settingStore.changeLocale(locale)
}

async function handleChangeForMizuki (value: boolean) {
  settingStore.setForMizuki(value)
  await loadCoreResources()
}

function canChangeForMizuki () {
  // 有任务进行中, 禁止修改此选项
  return deviceStore.devices.some(device => device.status === 'tasking')
}

</script>

<template>
  <div id="general">
    <h2 class="title">
      通用
    </h2>
    <NSpace
      vertical
      justify="center"
    >
      <NFormItem
        :label-width="300"
        label="语言"
        label-placement="left"
      >
        <NSelect
          :value="settingStore.locale"
          :options="localeOptions"
          :style="{ width: '200px' }"
          @update:value="handleChangeLocale"
          @click="handleLanguageSelectClick"
        />
      </NFormItem>
      <NFormItem
        :label-width="300"
        label="For Mizuki"
        label-placement="left"
      >
        <NTooltip trigger="hover" :disabled="!canChangeForMizuki()">
          <template #trigger>
            <NSwitch
              :value="settingStore.forMizuki"
              :disabled="canChangeForMizuki()"
              @update:value="handleChangeForMizuki"
            />
          </template>
          这个选项无法在有任务进行中修改
        </NTooltip>
      </NFormItem>
    </NSpace>
  </div>
</template>
