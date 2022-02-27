<script setup lang="ts">
import { ref } from 'vue';
import { NInput, NAlert, NButton, NIcon, NText, NForm, NFormItem } from 'naive-ui';
import IconLink from '@/assets/icons/link.svg?component';

const connectionString = ref('');
</script>

<template>
  <div>
    <NAlert title="连接一个设备 / 模拟器以继续" type="info" closable>
      <NText tag="div" :depth="3">1. 双击可用设备快速连接</NText>
      <NText tag="div" :depth="3">2. 连接到自定义设备地址</NText>
    </NAlert>
    <div class="form-connect">
      <NForm
        class="form-connect-inner"
        :label-width="150"
        :label-placement="'left'"
        :label-align="'right'"
      >
        <NFormItem label="模拟器 / 设备地址">
          <NInput
            v-model="connectionString"
            placeholder="e.g. 127.0.0.1:5555"
          />
        </NFormItem>
        <!-- 保持空格，使button和input对齐 -->
        <NFormItem label=" ">
          <NButton type="primary">
            <span>连接</span>
            <NIcon size="24px">
              <IconLink />
            </NIcon>
          </NButton>
        </NFormItem>
      </NForm>
    </div>
  </div>
</template>

<style lang="less" scoped>
.form-connect {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}
.form-connect-inner {
  min-width: 300px;
  width: 50%;
}
</style>