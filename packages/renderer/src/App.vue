<script setup lang="ts">
import WindowController from './components/WindowController.vue';
import Main from './containers/Main.vue';
import SideBar from './containers/SideBar.vue';

import { ref } from 'vue';
import { NGlobalStyle, NConfigProvider, GlobalThemeOverrides, darkTheme } from 'naive-ui';

const theme = ref('maa-light');

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#f0f0f0',
    primaryColor: '#64619a',
    primaryColorHover: '#8380b0',
    primaryColorPressed: '#5a578b',
    primaryColorSuppl: '#8380b0',
    infoColor: '#66c7ff',
    infoColorHover: '#8ad4ff',
    infoColorPressed: '#42baff',
    infoColorSuppl: '#8ad4ff',
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
    errorColorSuppl: '#ff8f8f'
  },
}

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: '#0f0f0f',
    primaryColor: '#daf1e1',
    primaryColorHover: '#b9e4c6',
    primaryColorPressed: '#80cf98',
    primaryColorSuppl: '#b9e4c6',
    infoColor: '#66c7ff',
    infoColorHover: '#8ad4ff',
    infoColorPressed: '#42baff',
    infoColorSuppl: '#8ad4ff',
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
    errorColorSuppl: '#ff8f8f'
  },
}

window.ipcRenderer.on("theme:update", (_, updatedTheme) => {
  console.log('theme changed: ', updatedTheme)
  theme.value = updatedTheme;
});
</script>

<template>
  <NConfigProvider
    class="app-provider"
    :theme="theme === 'maa-light' ? null : darkTheme"
    :theme-overrides="theme === 'maa-light' ? lightThemeOverrides : darkThemeOverrides"
  >
    <NGlobalStyle />
    <WindowController />
    <SideBar />
    <Main />
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
}
</style>
