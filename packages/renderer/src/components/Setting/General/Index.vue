<script lang="ts" setup>
import { NSelect, NFormItem, NSpace } from 'naive-ui'
import useSettingStore, { Locale } from '@/store/settings'
import { ref, inject } from 'vue'
import type { ResourceType } from '@type/game'
import { loadCoreResources } from '@/utils/core_functions'
import { showMessage } from '@/utils/message'

const settingStore = useSettingStore()

const coreSettingsDisabled = inject('coreSettingsDisabled') as { nre: boolean }

const localeOptions = [
  {
    label: '简体中文',
    value: Locale.zhCN,
  },
  {
    label: 'English',
    value: Locale.enUS,
  },
]

const clientOptions: { label: string; value: ResourceType }[] = [
  {
    label: '官服/Bilibili',
    value: 'CN',
  },
  {
    label: '国际服(YoStarEN)',
    value: 'YoStarEN',
  },
  {
    label: '日服(YoStarJP)',
    value: 'YoStarJP',
  },
  {
    label: '韩服(YoStarKR)',
    value: 'YoStarKR',
  },
  {
    label: '繁体服(txwy)',
    value: 'txwy',
  },
]

const dropdownCount = ref(0)
let timer = 0

function handleLanguageSelectClick() {
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

function handleChangeLocale(locale: Locale) {
  settingStore.changeLocale(locale)
}

async function handleChangeClientType(type: ResourceType) {
  const status = await loadCoreResources(type)
  if (status) {
    settingStore.changeClientType(type)
  }
  showMessage('修改' + (status ? '成功' : '失败, 请查看日志详细输出'), {
    type: status ? 'success' : 'error',
    duration: status ? 3000 : 0,
    closable: true,
  })
}
</script>

<template>
  <div id="general">
    <h2 class="title">通用</h2>
    <NSpace vertical>
      <NFormItem label="界面语言">
        <NSelect
          :value="settingStore.locale"
          :options="localeOptions"
          :style="{ width: '200px' }"
          @update:value="handleChangeLocale"
          @click="handleLanguageSelectClick"
        />
      </NFormItem>

      <NFormItem label="客户端类型">
        <NSelect
          :disabled="coreSettingsDisabled.nre || !settingStore.version.core.current"
          :value="settingStore.clientType"
          :options="clientOptions"
          :style="{ width: '200px' }"
          @update:value="handleChangeClientType"
        />
      </NFormItem>
    </NSpace>
  </div>
</template>
