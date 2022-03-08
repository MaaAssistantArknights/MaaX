<script setup lang="ts">
import { ref } from "vue";
import { NInput, NAlert, NButton, NIcon, NText, NForm, NFormItem,useMessage } from "naive-ui";
import IconLink from "@/assets/icons/link.svg?component";

const message = useMessage();
const connectionString = ref("");

function handleCustomConnect(){
  // eslint-disable-next-line vue/max-len
  const ipPortRegexRule = RegExp(String.raw`(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[0-5]\d{4}|[1-9]\d{0,3})`);

  message.info(connectionString.value);

  const ret = ipPortRegexRule.test(connectionString.value);
  if(ret){
    message.info("正在连接");
  }
  else{
    message.error("设备地址格式不正确");
  }
}

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
            v-model:value="connectionString"
            placeholder="e.g. 127.0.0.1:5555"
          />
        </NFormItem>
        <!-- 保持空格，使button和input对齐 --> 
        <NFormItem label=" ">
          <NButton type="primary"
          class="operation"
          @click="handleCustomConnect"
          >
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