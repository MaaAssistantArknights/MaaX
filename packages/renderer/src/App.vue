<script setup lang="ts">
import WindowController from "./components/WindowController.vue";
import Main from "./containers/Main.vue";
import SideBar from "./containers/SideBar.vue";

import {
  NGlobalStyle,
  NConfigProvider,
  NMessageProvider,
  GlobalThemeOverrides,
  darkTheme,
  zhCN, dateZhCN,
  ThemeCommonVars,
} from "naive-ui";
import useThemeStore from "@/store/theme";

import { initHook } from "./hooks";
initHook();

const themeStore = useThemeStore();

// check core available
// window.ipcRenderer.sendSync("version:core");

const commonThemeOverrides: Partial<ThemeCommonVars> = {
  infoColor: "#66c7ff",
  infoColorHover: "#8ad4ff",
  infoColorPressed: "#42baff",
  infoColorSuppl: "#8ad4ff",
  successColor: "#87cf3a",
  successColorHover: "#b2e080",
  successColorPressed: "#7ac02f",
  successColorSuppl: "#b2e080",
  warningColor: "#e1d460",
  warningColorHover: "#ece399",
  warningColorPressed: "#dccd45",
  warningColorSuppl: "#ece399",
  errorColor: "#ff6b6b",
  errorColorHover: "#ff8f8f",
  errorColorPressed: "#ff4747",
  errorColorSuppl: "#ff8f8f"
};

const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    hoverColor: "rgba(243,243,245,.6)",
    bodyColor: "#f0f0f0",
    primaryColor: "#64619a",
    primaryColorHover: "#8380b0",
    primaryColorPressed: "#5a578b",
    primaryColorSuppl: "#8380b0",
    ...commonThemeOverrides
  },
};

const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: "#0f0f0f",
    primaryColor: "#daf1e1",
    primaryColorHover: "#b9e4c6",
    primaryColorPressed: "#80cf98",
    primaryColorSuppl: "#b9e4c6",
    ...commonThemeOverrides
  },
};
</script>

<template>
  <NConfigProvider
    class="app-provider"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="themeStore.theme === 'maa-light' ? null : darkTheme"
    :theme-overrides="themeStore.theme === 'maa-light' ?
    lightThemeOverrides : darkThemeOverrides"
  >
    <NMessageProvider>
      <NGlobalStyle />
      <WindowController />
      <SideBar />
      <Main />
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
}
</style>
