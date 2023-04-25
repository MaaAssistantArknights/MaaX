<script setup lang="ts">
import { NScrollbar, useMessage, useDialog } from 'naive-ui'
import asst from '@/hooks/caller/asst'
import { onMounted } from 'vue'

window.$message = useMessage()
window.$dialog = useDialog()

onMounted(async () => {
  await asst.upgradeCore()
  await asst.load()
})

</script>

<template>
  <NScrollbar class="main">
    <router-view name="Main" />
  </NScrollbar>
</template>
