<script lang="ts" setup>
import {
  NSelect,
  NSwitch,
  NFormItem
} from 'naive-ui'
import useSettingStore, { Locale } from '@/store/settings'

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

function handleChangeLocale (locale: Locale) {
  settingStore.changeLocale(locale)
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
        />
      </NFormItem>
      <NFormItem
        :label-width="300"
        label="For Mizuki"
        label-placement="left"
      >
        <NSwitch />
      </NFormItem>
    </NSpace>
  </div>
</template>
