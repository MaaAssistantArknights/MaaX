<script setup lang="ts">
import { NScrollbar, useMessage } from 'naive-ui'
import asst from '@/hooks/caller/asst'
import { onMounted } from 'vue'

window.$message = useMessage()

onMounted(asst.load)

</script>

<template>
  <NScrollbar class="main">
    <router-view name="Main" />
  </NScrollbar>
</template>
