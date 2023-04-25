<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NInput, NAlert, NButton, NIcon, NText, NForm, NFormItem, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useDeviceStore from '@/store/devices'
import useSettingStore from '@/store/settings'
// import { uuidV4 } from "@common/uuid";
import IconLink from '@/assets/icons/link.svg?component'
import _ from 'lodash'
import { showMessage } from '@/utils/message'

const address = ref('')
const deviceStore = useDeviceStore()
const dialog = useDialog()
const { t } = useI18n()

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
  return ip.split('.').length === 4 && ip.split('.').every((v, i, a) => {
    if (a.length !== 4) {
      return false
    }
    const n = Number(v)
    if (isNaN(Number(v))) {
      return false
    }
    return n >= 0 && n <= 255
  })
}

async function handleCustomConnect() {
  console.log(address.value)
  if (addressChecker(address.value)) {
    const loading = showMessage('正在连接', { type: 'loading', duration: 0 })
    if (deviceStore.devices.find(dev => dev.address === address.value)) {
      loading.destroy()
      showMessage('设备已经存在了哦', { type: 'warning', duration: 5000 })
      return
    }
    const uuid = await window.ipcRenderer.invoke('main.DeviceDetector:getDeviceUuid', address.value)
    if (!(uuid as string | false)) {
      loading.destroy()
      showMessage('连接失败，检查一下地址吧', { type: 'error', duration: 5000 })
      return
    }
    deviceStore.mergeSearchResult([
      {
        uuid: uuid as string,
        address: address.value,
        name: 'General'
      }
    ])
    loading.destroy()
  } else {
    showMessage('设备地址不对哦，检查一下吧', { type: 'error', duration: 5000 })
  }
}

const router = useRouter()
const settingStore = useSettingStore()

onMounted(async () => {
  // 检查是否没有正确安装组件
  await settingStore.updateVersionInfo()
  if (!settingStore.version.core.current && settingStore.hintCoreNotInstalled) {
    dialog.info({
      title: t('Common.hint'),
      content: t('componentManager.notInstalled',
        { componentType: t('download["Maa Core"]') }
      ),
      positiveText: t('Common.goNow'),
      negativeText: t('Common.dontShowAgain'),
      onPositiveClick: () => {
        router.push({
          path: '/settings',
          query: {
            requireInstallComponent: 1
          }
        })
      },
      onNegativeClick: () => {
        settingStore.dontShowCoreNotInstalled()
      }
    })
  }
})
</script>

<template>
  <div>
    <NAlert title="连接一个设备 / 模拟器以继续" type="info" closable>
      <NText tag="div" :depth="3">
        1. 双击可用设备快速连接
      </NText>
      <NText tag="div" :depth="3">
        2. 连接到自定义设备地址
      </NText>
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
