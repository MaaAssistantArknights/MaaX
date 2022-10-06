<script setup lang="ts">
import {
  NForm
} from 'naive-ui'

import Developer from '@/components/Setting/Developer'
import Version from '@/components/Setting/Version'
import Appearance from '@/components/Setting/Appearance'
import About from '@/components/Setting/About'
import Clear from '@/components/Setting/Clear/Index.vue'
import Report from '@/components/Setting/Report/Index.vue'
import General from '@/components/Setting/General/Index.vue'

</script>

<template>
  <NForm
    class="setting-form"
    :label-width="150"
    :show-feedback="false"
  >
    <General />
    <Report />
    <Version />
    <Appearance />
    <Clear />
    <About />
    <div id="develop">
      <h2 class="title">
        开发者
      </h2>
      <Developer />
    </div>
  </NForm>
</template>

<style lang="less" scoped>
.setting-form {
  text-align: center;
}

#appearance {
  text-align: center;
}
</style>

<style lang="less">
.setting-form {
  .title, .subtitle {
    text-align: left;
  }
}
</style>
