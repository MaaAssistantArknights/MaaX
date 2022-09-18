<script setup lang="ts">
import {
  NForm,
  NSpace,
  NSelect
} from 'naive-ui'

import useSettingStore, { Locale } from '@/store/settings'
import Developer from '@/components/Setting/Developer'
import Version from '@/components/Setting/Version'
import Appearance from '@/components/Setting/Appearance'
import About from '@/components/Setting/About'
import Clear from '@/components/Setting/Clear/Index.vue'
import Report from '@/components/Setting/Report/Index.vue'

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
  <NForm
    class="setting-form"
    :label-width="150"
    :show-feedback="false"
  >
    <div id="general">
      <h2 class="title">
        通用
      </h2>
      <NSpace
        justify="center"
        align="center"
      >
        <div>语言</div>
        <NSelect
          :value="settingStore.locale"
          :options="localeOptions"
          :style="{ width: '200px' }"
          @update:value="handleChangeLocale"
        />
      </NSpace>
    </div>

    <Report />
    <Version />
    <Appearance />
    <Clear />
    <About />
    <div id="develop">
      <h2 class="title">
        开发者
      </h2>
      <Developer />
    </div>
  </NForm>
</template>

<style lang="less" scoped>
.setting-form {
  text-align: center;
}

#appearance {
  text-align: center;
}
</style>

<style lang="less">
.setting-form {
  .title, .subtitle {
    text-align: left;
  }
}
</style>
