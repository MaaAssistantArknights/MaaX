<script setup lang="ts">
import WindowController from '@/components/WindowController.vue'
import Main from '@/containers/Main.vue'
import SideBar from '@/containers/SideBar.vue'
import GlobalNotifier from '@/components/GlobalNotifier.vue'

import {
  NGlobalStyle,
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  GlobalThemeOverrides,
  darkTheme,
  ThemeCommonVars,
} from 'naive-ui'
import { naiveUiLocale } from '@/i18n'
import useThemeStore from '@/store/theme'
import useSettingStore, { Locale } from '@/store/settings'
import { initHook } from '@/hooks'
import { onMounted, computed } from 'vue'
import { transparentize } from 'color2k'

// initialStore()

const themeStore = useThemeStore()
const settingStore = useSettingStore()

// check core available
// window.ipcRenderer.invoke("version:core");

const commonThemeOverrides: Partial<ThemeCommonVars> = {
  infoColor: '#42baff',
  infoColorHover: '#66c7ff',
  infoColorPressed: '#42baff',
  infoColorSuppl: '#66c7ff',
  successColor: '#87cf3a',
  successColorHover: '#b2e080',
  successColorPressed: '#7ac02f',
  successColorSuppl: '#b2e080',
  warningColor: '#e1d460',
  warningColorHover: '#ece399',
  warningColorPressed: '#dccd45',
  warningColorSuppl: '#ece399',
  errorColor: '#ff6b6b',
  errorColorHover: '#ff8f8f',
  errorColorPressed: '#ff4747',
  errorColorSuppl: '#ff8f8f',
}

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    hoverColor: 'rgba(243,243,245,.6)',
    bodyColor: '#f0f0f0',
    primaryColor: '#64619a',
    primaryColorHover: '#8380b0',
    primaryColorPressed: '#5a578b',
    primaryColorSuppl: '#8380b0',
    ...commonThemeOverrides,
  },
}

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#0f0f0f',
    primaryColor: '#daf1e1',
    primaryColorHover: '#b9e4c6',
    primaryColorPressed: '#80cf98',
    primaryColorSuppl: '#b9e4c6',
    ...commonThemeOverrides,
  },
}

const style = computed(() => {
  const bg =
    themeStore.bgFollowTheme && themeStore.currentTheme === 'maa-dark'
      ? themeStore.bgDark
      : themeStore.bgLight
  const bodyColor =
    themeStore.currentTheme === 'maa-dark' ? '#0f0f0f' : '#f0f0f0'
  return {
    '--inner-bg': `url(${bg.url})`,
    '--inner-opacity': bg.opacity,
    background: transparentize(bodyColor, 1 - themeStore.themeColorOpacity),
  }
})

onMounted(() => {
  initHook()
  settingStore.changeLocale(Locale.zhCN)
})
</script>

<template>
  <NConfigProvider
    class="app-provider"
    :locale="naiveUiLocale[`N${settingStore.locale}`]"
    :date-locale="naiveUiLocale[`NDate${settingStore.locale}`]"
    :theme="themeStore.currentTheme === 'maa-light' ? null : darkTheme"
    :theme-overrides="
      themeStore.currentTheme === 'maa-light'
        ? lightThemeOverrides
        : darkThemeOverrides
    "
    :style="style"
  >
    <div class="background" />
    <NMessageProvider>
      <NDialogProvider>
        <GlobalNotifier>
          <NGlobalStyle />
          <WindowController />
          <SideBar />
          <Main />
        </GlobalNotifier>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.app-provider {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  position: relative;
}

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: var(--inner-bg);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: var(--inner-opacity);
}

.n-message-wrapper {
  z-index: 20;
}
</style>
