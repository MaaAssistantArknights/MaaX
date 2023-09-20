<script setup lang="ts">
import About from '@/components/Setting/About'
import Advance from '@/components/Setting/Advance/Index.vue'
import Appearance from '@/components/Setting/Appearance'
import Clear from '@/components/Setting/Clear/Index.vue'
import Developer from '@/components/Setting/Developer'
import General from '@/components/Setting/General/Index.vue'
import Other from '@/components/Setting/Other/Index.vue'
import Report from '@/components/Setting/Report/Index.vue'
import Version from '@/components/Setting/Version'
import useDeviceStore from '@/store/devices'
import { NForm } from 'naive-ui'
import { computed, provide } from 'vue'

const deviceStore = useDeviceStore()

provide(
  'coreSettingsDisabled',
  computed(() => {
    return {
      nre: deviceStore.devices.some(device => device.status === 'tasking'),
    }
  })
)
</script>

<template>
  <NForm class="setting-form" label-width="250px" :show-feedback="false" label-placement="left">
    <General />
    <Report />
    <Version />
    <Advance />
    <Appearance />
    <Clear />
    <Other />
    <About />
    <div id="develop">
      <h2 class="title">开发者</h2>
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
  .title,
  .subtitle {
    text-align: left;
  }
}
</style>
