<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import useSettingStore from '@/store/settings'
import {
  NSpace,
  NIcon,
  NTooltip,
  NButton,
  NText,
  useThemeVars
} from 'naive-ui'
import IconBinary from '@/assets/icons/binary.svg?component'
import IconWindowUi from '@/assets/icons/window-ui.svg?component'

const themeVars = useThemeVars()

const settingStore = useSettingStore()

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

onMounted(async () => {
  settingStore.updateVersionInfo()
})
</script>

<template>
  <div id="version">
    <h2 class="title">当前版本</h2>
    <NTooltip :disabled="!needUpdate(versionCore)">
      <template #trigger>
        <div>
          <NButton quaternary :focusable="false" :type="needUpdate(versionCore) ? 'info' : 'default'">
            <NSpace justify="center" align="center">
              <NIcon size="18px" :color="themeVars.infoColor">
                <IconBinary />
              </NIcon>
              <NText type="info">Maa Core:</NText>
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
              <NIcon size="18px" :color="themeVars.infoColor">
                <IconWindowUi />
              </NIcon>
              <NText type="info">Maa App:</NText>
              <span>{{ versionString(versionUi) }}</span>
            </NSpace>
          </NButton>
        </div>
      </template>
      {{ `UI可更新至${versionUi.latest}，点击以更新` }}
    </NTooltip>
  </div>
</template>