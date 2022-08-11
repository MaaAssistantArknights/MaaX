<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import {
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NIcon,
  NTooltip,
  NButton,
  NSwitch,
  NImage,
  NSlider,
  NSelect,
  NInputNumber
} from 'naive-ui'
import _ from 'lodash'
import IconBinary from '@/assets/icons/binary.svg?component'
import IconWindowUi from '@/assets/icons/window-ui.svg?component'

import useSettingStore, { Locale } from '@/store/settings'
import useThemeStore from '@/store/theme'
import Developer from '@/components/Setting/Developer.vue'

const settingStore = useSettingStore()
const themeStore = useThemeStore()

const versionCore = computed(() => settingStore.version.core)
const versionUi = computed(() => settingStore.version.ui)

function needUpdate(version: { current?: string; latest?: string }) {
  if (!version.latest || !version.current) {
    return false
  }
  return version.current !== version.latest
}

function versionString(version: { current?: string; latest?: string }) {
  let str = version.current || '未知'
  if (needUpdate(version)) {
    str += ` -> ${version.latest}`
  }
  return str
}

const bgPreviewWidth = ref(0)

function handleWindowResize() {
  bgPreviewWidth.value = window.innerWidth - 352
}

async function openBgFileSelector(): Promise<URL | undefined> {
  const { filePaths } = await window.ipcRenderer.invoke(
    'main.WindowManager:openDialog',
    '选择背景图片',
    ['openFile'],
    [
      { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  )
  if (filePaths?.length <= 0) {
    return undefined
  }
  return new URL(filePaths[0])
}

async function handleLightBgSelect() {
  const url = await openBgFileSelector()
  themeStore.updateBgLight({ url: url?.href, opacity: themeStore.bgLight.opacity })
}

async function handleDarkBgSelect() {
  const url = await openBgFileSelector()
  themeStore.updateBgDark({ url: url?.href, opacity: themeStore.bgDark.opacity })
}

function handleUpdateBgLightOpacity(value: number | null) {
  themeStore.updateBgLight({ url: themeStore.bgLight.url, opacity: value ?? 1 })
}

function handleUpdateBgDarkOpacity(value: number | null) {
  themeStore.updateBgDark({ url: themeStore.bgDark.url, opacity: value ?? 1 })
}

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

function handleChangeLocale(locale: Locale) {
  settingStore.changeLocale(locale)
}

onMounted(() => {
  handleWindowResize()
  window.addEventListener('resize', _.throttle(handleWindowResize, 16))
})
</script>

<template>
  <NForm class="setting-form" :label-width="150" :show-feedback="false">
    <div id="general">
      <h2 class="title">通用</h2>
      <NSpace justify="center" align="center">
        <div>语言</div>
        <NSelect :value="settingStore.locale" @update:value="handleChangeLocale" :options="localeOptions"
          :style="{ width: '200px' }" />
      </NSpace>
    </div>
    <div id="penguin-report">
      <h2 class="title">企鹅物流数据上报</h2>
      <NSpace justify="center" align="center">
        <span>
          企鹅数据汇报ID
          <br />(仅数字部分)
        </span>
        <NInput v-model:value="settingStore.reportId" :placeholder="''" />
      </NSpace>
    </div>

    <div id="version">
      <h2 class="title">当前版本</h2>
      <NTooltip :disabled="!needUpdate(versionCore)">
        <template #trigger>
          <div>
            <NButton quaternary :focusable="false" :type="needUpdate(versionCore) ? 'info' : 'default'">
              <NSpace justify="center" align="center">
                <NIcon size="18px">
                  <IconBinary />
                </NIcon>
                <span>{{ versionString(versionCore) }}</span>
              </NSpace>
            </NButton>
          </div>
        </template>
        {{ `Core可更新至${versionCore.latest}，点击以更新` }}
      </NTooltip>
      <NTooltip :disabled="!needUpdate(versionUi)">
        <template #trigger>
          <div>
            <NButton quaternary :focusable="false" :type="needUpdate(versionUi) ? 'info' : 'default'">
              <NSpace justify="center" align="center">
                <NIcon size="18px">
                  <IconWindowUi />
                </NIcon>
                <span>{{ versionString(versionUi) }}</span>
              </NSpace>
            </NButton>
          </div>
        </template>
        {{ `UI可更新至${versionUi.latest}，点击以更新` }}
      </NTooltip>
    </div>

    <div id="appearance">
      <h2 class="title">外观</h2>
      <NSpace vertical justify="center" align="center">
        <NFormItem label="主题色不透明度" label-placement="left">
          <NSlider :value="themeStore.themeColorOpacity" :min="0" :max="1" :step="0.01"
            @update:value="(value) => themeStore.updateColorOpacity(value)"
            :format-tooltip="(value) => `${Math.floor(value * 100)}%`" :style="{ width: '300px' }" />
        </NFormItem>
        <NFormItem label="开启亚克力效果（重启应用生效）" label-placement="left" label-width="210">
          <NSwitch :value="themeStore.acrylic" @update:value="(value) => themeStore.updateAcrylic(value)" />
        </NFormItem>
        <NFormItem label="背景随主题变换" label-placement="left">
          <NSwitch :value="themeStore.bgFollowTheme" @update:value="(value) => themeStore.updateBgFollowTheme(value)" />
        </NFormItem>
        <NSpace vertical align="center">
          <NFormItem label="背景图片" label-placement="top" :label-style="{ justifyContent: 'center' }"
            @click="handleLightBgSelect">
            <NImage class="background-preview" :width="bgPreviewWidth" :preview-disabled="true"
              :src="themeStore.bgLight.url" alt="选择图片" />
          </NFormItem>
          <NFormItem label="不透明度" label-placement="left">
            <NInputNumber :value="themeStore.bgLight.opacity" :min="0" :max="1" :step="0.01"
              @update:value="handleUpdateBgLightOpacity" :format="(value) => `${Math.floor((value ?? 0) * 100)}%`"
              :parse="(input) => Number(input.replace('%', '')) / 100" />
          </NFormItem>
          <NFormItem v-show="themeStore.bgFollowTheme" label="深色背景图片" label-placement="top"
            :label-style="{ justifyContent: 'center' }" @click="handleDarkBgSelect">
            <NImage class="background-preview" :width="bgPreviewWidth" :preview-disabled="true"
              :src="themeStore.bgDark.url" alt="选择图片" />
          </NFormItem>
          <NFormItem v-show="themeStore.bgFollowTheme" label="不透明度" label-placement="left">
            <NInputNumber :value="themeStore.bgDark.opacity" :min="0" :max="1" :step="0.01"
              @update:value="handleUpdateBgDarkOpacity" :format="(value) => `${Math.floor((value ?? 0) * 100)}%`"
              :parse="(input) => Number(input.replace('%', '')) / 100" />
          </NFormItem>
        </NSpace>
      </NSpace>
    </div>
    <div id="develop">
      <h2 class="title">开发者</h2>
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