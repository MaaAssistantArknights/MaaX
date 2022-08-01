<script setup lang="ts">
import { NScrollbar, useMessage } from 'naive-ui'
import version from '@/hooks/caller/version'
import { onMounted, ref, Ref } from 'vue'
import _ from 'lodash'
import DownloadModal from '@/components/DownloadModal.vue'

window.$message = useMessage()

const coreVersion: Ref<string | null> = ref('')

onMounted(async () => {
  coreVersion.value = await version.core()
})

</script>

<template>
  <NScrollbar class="main">
    <router-view name="Main" />
    <!-- <DownloadModal :show="_.isNil(coreVersion)" /> -->
  </NScrollbar>
</template>
