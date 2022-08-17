<script setup lang="ts">
import { NScrollbar, useMessage } from 'naive-ui'
import version from '@/hooks/caller/version'
import asst from '@/hooks/caller/asst'
import { onMounted, ref, Ref } from 'vue'

window.$message = useMessage()

const coreVersion: Ref<string | null> = ref('')

onMounted(async () => {
  await asst.load()
  coreVersion.value = await version.core()
  if (!coreVersion.value) {
    window.$message.error('Maa Core未安装或者不兼容，请到设置页面安装Maa Core')
  }
})

</script>

<template>
  <NScrollbar class="main">
    <router-view name="Main" />
  </NScrollbar>
</template>
