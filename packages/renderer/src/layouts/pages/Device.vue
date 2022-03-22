<script setup lang="ts">
import { ref } from "vue";
import { NInput, NAlert, NButton, NIcon, NText, NForm, NFormItem, useMessage } from "naive-ui";
import useDeviceStore from "@/store/devices";
import { uuidV4 } from "@common/uuid";
import IconLink from "@/assets/icons/link.svg?component";
import _ from "lodash";

const message = useMessage();
const connectionString = ref("");
const deviceStore = useDeviceStore();

function connectionStringChecker(cs: string) {
  let [ip, port] = cs.split(":");
  if (!port) {
    // adb默认端口
    port = "5555";
  }
  if (!_.isNumber(port) || Number(port) <= 0x0000 || Number(port) >= 0xffff) {
    return false;
  }
  return ip.split(".").every((v, i, a) => Number(v) && a.length === 4);
}

function handleCustomConnect() {
  console.log(connectionString.value);
  if (connectionStringChecker(connectionString.value)) {
    // message.loading("正在连接");
    if (deviceStore.devices.find(dev => dev.connectionString === connectionString.value)) {
      message.info("设备已经存在了哦");
      return;
    }
    deviceStore.mergeSearchResult([
      {
        uuid: uuidV4(),
        connectionString: connectionString.value,
        name: "default",
        adbPath: "adb"
      }
    ]);
  }
  else {
    message.error("设备地址不对哦，检查一下吧");
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
          <NButton
            type="primary"
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