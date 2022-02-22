<script setup lang="ts">
import { ref, Ref } from 'vue';
import { NInput, NSpace, NIcon } from 'naive-ui';
import IconBinary from '@/assets/icons/binary.svg?component';
import IconWindowUi from '@/assets/icons/window-ui.svg?component';

interface SettingState {
  penguin: string
}

const settings: Ref<SettingState> = ref({
  penguin: ''
})

</script>

<template>
  <div class="setting-form">
    <div id="penguin-report">
      <h2 class="title">企鹅物流数据上报</h2>
      <NSpace justify="center" align="center">
        <span>
          企鹅数据汇报ID
          <br />(仅数字部分)
        </span>
        <n-input v-model:value="settings.penguin" placeholder=""/>
      </NSpace>
    </div>

    <div id="version">
      <h2 class="title">当前版本</h2>
      <NSpace justify="center" align="center">
        <NIcon size="18px"><IconBinary /></NIcon>
        <span>v3.0.1 -> v3.0.2</span>
      </NSpace>
      <NSpace justify="center" align="center">
        <NIcon size="18px"><IconWindowUi /></NIcon>
        <span>v1.0.0</span>
      </NSpace>
    </div>

    <div id="develop">
      <h2 class="title">开发者</h2>
    </div>
  </div>
</template>

<style lang="less" scoped>
.setting-form {
  text-align: center;
}

.title {
  text-align: left;
}
</style>