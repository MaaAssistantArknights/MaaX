<script setup lang="ts">
import { NScrollbar, useThemeVars, useMessage } from 'naive-ui'
import version from '@/hooks/caller/version'
import { onMounted, ref, Ref } from 'vue'
import _ from 'lodash'
import DownloadModal from '@/components/DownloadModal.vue'

const themeVars = useThemeVars()
window.$message = useMessage()

const coreVersion: Ref<string | null | undefined> = ref('')

onMounted(async () => {
  // coreVersion.value = await version.core()
})

</script>

<template>
  <NScrollbar
    class="main"
    :style="{ backgroundColor: themeVars.bodyColor }"
  >
    <router-view name="Main" />
    <DownloadModal :show="_.isNil(coreVersion)" />
  </NScrollbar>
</template>
