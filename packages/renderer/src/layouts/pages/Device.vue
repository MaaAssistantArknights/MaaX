<script setup lang="ts">
// import { uuidV4 } from "@common/uuid";
import IconLink from '@/assets/icons/link.svg?component'
import useDeviceStore from '@/store/devices'
import useSettingStore from '@/store/settings'
import { showMessage } from '@/utils/message'
import type { Device } from '@type/device'
import _ from 'lodash'
import { NAlert, NButton, NForm, NFormItem, NIcon, NInput, NText, useDialog } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const address = ref('')
const deviceStore = useDeviceStore()
const settingStore = useSettingStore()
const touchMode = computed(() => settingStore.touchMode)

function addressChecker(cs: string) {
  let [ip, port] = cs.split(':')
  if (!port) {
    // adb默认端口
    port = '5555'
  }

  if (isNaN(Number(port)) || Number(port) <= 0x0000 || Number(port) >= 0xffff) {
    console.log(`is_number: ${_.isNumber(port)}`)
    return false
  }
  return (
    ip.split('.').length === 4 &&
    ip.split('.').every((v, i, a) => {
      if (a.length !== 4) {
        return false
      }
      const n = Number(v)
      if (isNaN(Number(v))) {
        return false
      }
      return n >= 0 && n <= 255
    })
  )
}

async function handleCustomConnect() {
  console.log(address.value)
  if (addressChecker(address.value)) {
    const loading = showMessage('正在连接', { type: 'loading', duration: 0 })
    if (deviceStore.devices.find(dev => dev.address === address.value)) {
      loading.destroy()
      showMessage('设备已经存在了哦, 请点击左侧连接按钮吧', { type: 'warning', duration: 5000 })
      return
    }
    const uuid = await window.main.DeviceDetector.getDeviceUuid(address.value)
    if (!(uuid as string | false)) {
      loading.destroy()
      showMessage('连接失败，检查一下地址吧', { type: 'error', duration: 5000 })
      return
    }
    await deviceStore.mergeSearchResult([
      {
        uuid: uuid as string,
        address: address.value,
        name: 'General',
      },
    ])
    const device = deviceStore.getDevice(uuid as string)
    if (device) {
      deviceStore.updateDeviceStatus(device.uuid, 'connecting')
      await window.main.CoreLoader.initCoreAsync({
        address: device.address,
        uuid: device.uuid,
        adb_path: device.adbPath,
        config: 'General',
        touch_mode: touchMode.value,
      })
    }
    loading.destroy()
  } else {
    showMessage('设备地址不对哦，检查一下吧', { type: 'error', duration: 5000 })
  }
}
</script>

<template>
  <div>
    <NAlert title="连接一个设备 / 模拟器以继续" type="info" closable>
      <NText tag="div" :depth="3"> 1. 双击可用设备快速连接 </NText>
      <NText tag="div" :depth="3"> 2. 连接到自定义设备地址 </NText>
    </NAlert>
    <div class="form-connect">
      <NForm
        class="form-connect-inner"
        :label-width="150"
        :label-placement="'left'"
        :label-align="'right'"
      >
        <NFormItem label="模拟器 / 设备地址">
          <NInput v-model:value="address" placeholder="e.g. 127.0.0.1:5555" />
        </NFormItem>
        <!-- 保持空格，使button和input对齐 -->
        <NFormItem label=" ">
          <NButton type="primary" class="operation" @click="handleCustomConnect">
            <span>添加</span>
            <NIcon size="24px">
              <IconLink />
            </NIcon>
          </NButton>
        </NFormItem>
      </NForm>
      <!-- <NButton @click="install">安装</NButton> -->
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
