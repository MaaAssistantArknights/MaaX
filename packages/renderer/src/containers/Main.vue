<script setup lang="ts">
import { NScrollbar, useThemeVars, useMessage } from "naive-ui";

const themeVars = useThemeVars();
window.$message = useMessage();
</script>

<template>
  <NScrollbar class="main" :style="{ backgroundColor: themeVars.bodyColor }">
    <router-view name="Main" />
  </NScrollbar>
</template>
