<script setup lang="ts">
import { NScrollbar, useThemeVars } from "naive-ui";

const themeVars = useThemeVars();
</script>

<template>
  <NScrollbar class="main" :style="{ backgroundColor: themeVars.bodyColor }">
    <router-view name="Main" />
  </NScrollbar>
</template>
