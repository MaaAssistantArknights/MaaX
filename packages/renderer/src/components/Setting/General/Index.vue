<script lang="ts" setup>
import {
  NSelect,
  NFormItem,
  NSpace
} from 'naive-ui'
import useSettingStore, { Locale } from '@/store/settings'
import { ref } from 'vue'

const settingStore = useSettingStore()

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

</script>

<template>
  <div id="general">
    <h2 class="title">
      通用
    </h2>
    <NSpace vertical>
      <NFormItem
        label="界面语言"
      >
        <NSelect
          :value="settingStore.locale"
          :options="localeOptions"
          :style="{ width: '200px' }"
          @update:value="handleChangeLocale"
          @click="handleLanguageSelectClick"
        />
      </NFormItem>
    </NSpace>
  </div>
</template>
