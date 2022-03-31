<script setup lang="ts">
import IconChevronLeft from '@/assets/icons/chevron-left.svg?component'
import { NButton, NIcon, NAnchor, NAnchorLink } from 'naive-ui'
</script>

<template>
  <div>
    <NButton text style="font-size: 24px" @click="$router.back()">
      <NIcon>
        <IconChevronLeft />
      </NIcon>
    </NButton>
    <h2>设置</h2>
    <NAnchor
      class="setting-anchor"
      offset-target=".main"
      type="block"
      :bound="80"
    >
      <NAnchorLink title="企鹅物流数据上报" href="#penguin-report" />
      <NAnchorLink title="当前版本" href="#version" />
      <NAnchorLink title="开发者" href="#develop" />
    </NAnchor>
  </div>
</template>
