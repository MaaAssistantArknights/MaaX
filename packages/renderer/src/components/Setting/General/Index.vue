<script lang="ts" setup>
import {
  NSelect,
  NFormItem,
  NTooltip,
  NSpace
} from 'naive-ui'
import useSettingStore, { Locale, RogueTheme } from '@/store/settings'
import { loadCoreResources } from '@/utils/load_extra_resources'
import { ref, inject } from 'vue'

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

const rogueOptions = [
  {
    label: '傀影',
    value: RogueTheme.Phantom
  },
  {
    label: '水月',
    value: RogueTheme.Mizuki
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

async function handleChangeRogueTheme (theme: RogueTheme) {
  settingStore.changeRogueTheme(theme)
  await loadCoreResources()
}

const coreSettingsDisabled = inject('coreSettingsDisabled') as { nre: boolean }

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
      <NFormItem label="肉鸽主题">
        <NTooltip trigger="hover" :disabled="!coreSettingsDisabled.nre">
          <template #trigger>
            <NSelect
              :value="settingStore.rogueTheme"
              :options="rogueOptions"
              :style="{ width: '200px' }"
              :disabled="coreSettingsDisabled.nre"
              @update:value="handleChangeRogueTheme"
            />
          </template>
          这个选项无法在有任务进行中修改
        </NTooltip>
      </NFormItem>
    </NSpace>
  </div>
</template>
