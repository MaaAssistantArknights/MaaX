<script lang="ts" setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import useSettingStore from '@/store/settings'
import { NSpace, NIcon, NTooltip, NButton, NText, useThemeVars } from 'naive-ui'
import IconBinary from '@/assets/icons/binary.svg?component'
import IconWindowUi from '@/assets/icons/window-ui.svg?component'
import DownloadModal from './DownloadModal.vue'

const themeVars = useThemeVars()

const settingStore = useSettingStore()

const versionCore = computed(() => settingStore.version.core)
const versionUi = computed(() => settingStore.version.ui)
const show = ref(false)

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

function showDownloadModal() {
  show.value = true
}

const route = useRoute()

onMounted(async () => {
  if (route.query.requireInstallComponent) {
    // 已经在Device页面做过更新
    show.value = true
  } else {
    settingStore.updateVersionInfo()
  }
})
</script>

<template>
  <div id="version">
    <h2 class="title">版本信息</h2>
    <NSpace vertical>
      <NTooltip :disabled="!needUpdate(versionCore)" :width="'trigger'">
        <template #trigger>
          <NButton
            quaternary
            :focusable="false"
            :type="needUpdate(versionCore) ? 'info' : 'default'"
            @click="showDownloadModal"
          >
            <NSpace justify="center" align="center">
              <NIcon size="18px" :color="themeVars.infoColor">
                <IconBinary />
              </NIcon>
              <NText type="info"> Maa Core: </NText>
              <span>{{ versionString(versionCore) }}</span>
            </NSpace>
          </NButton>
        </template>
        {{ `Core可更新至${versionCore.latest}，点击以更新` }}
      </NTooltip>
      <NTooltip :disabled="!needUpdate(versionUi)" :width="'trigger'">
        <template #trigger>
          <NButton
            quaternary
            :focusable="false"
            :type="needUpdate(versionUi) ? 'info' : 'default'"
            @click="showDownloadModal"
          >
            <NSpace justify="center" align="center">
              <NIcon size="18px" :color="themeVars.infoColor">
                <IconWindowUi />
              </NIcon>
              <NText type="info"> Maa App: </NText>
              <span>v{{ versionString(versionUi) }}</span>
            </NSpace>
          </NButton>
        </template>
        {{ `UI可更新至${versionUi.latest}，点击以更新` }}
      </NTooltip>
    </NSpace>

    <DownloadModal v-model:show="show" />
  </div>
</template>
