<script setup lang="ts">
import { computed } from 'vue'
import { NForm, NFormItem, NInput, NSpace, NIcon, NTooltip, NButton, NSwitch, NImage } from 'naive-ui'
import _ from 'lodash'
import IconBinary from '@/assets/icons/binary.svg?component'
import IconWindowUi from '@/assets/icons/window-ui.svg?component'

import useSettingStore from '@/store/settings'

const settingStore = useSettingStore()

const versionCore = computed(() => settingStore.version.core)
const versionUi = computed(() => settingStore.version.ui)

function needUpdate (version: { current?: string, latest?: string }) {
  if (!version.latest || !version.current) {
    return false
  }
  return version.current !== version.latest
}

function versionString (version: { current?: string, latest?: string }) {
  let str = version.current || '未知'
  if (needUpdate(version)) {
    str += ` -> ${version.latest}`
  }
  return str
}

</script>

<template>
  <NForm class="setting-form" :label-width="150" :show-feedback="false">
    <div id="penguin-report">
      <h2 class="title">企鹅物流数据上报</h2>
      <NSpace justify="center" align="center">
        <span>
          企鹅数据汇报ID
          <br />(仅数字部分)
        </span>
        <NInput v-model:value="settingStore.reportId" :placeholder="''" />
      </NSpace>
    </div>

    <div id="version">
      <h2 class="title">当前版本</h2>
      <NTooltip :disabled="!needUpdate(versionCore)">
        <template #trigger>
          <div>
            <NButton
              quaternary
              :focusable="false"
              :type="needUpdate(versionCore) ? 'info' : 'default'"
            >
              <NSpace justify="center" align="center">
                <NIcon size="18px">
                  <IconBinary />
                </NIcon>
                <span>{{ versionString(versionCore) }}</span>
              </NSpace>
            </NButton>
          </div>
        </template>
        {{ `Core可更新至${versionCore.latest}，点击以更新` }}
      </NTooltip>
      <NTooltip :disabled="!needUpdate(versionUi)">
        <template #trigger>
          <div>
            <NButton
              quaternary
              :focusable="false"
              :type="needUpdate(versionUi) ? 'info' : 'default'"
            >
              <NSpace justify="center" align="center">
                <NIcon size="18px">
                  <IconWindowUi />
                </NIcon>
                <span>{{ versionString(versionUi) }}</span>
              </NSpace>
            </NButton>
          </div>
        </template>
        {{ `UI可更新至${versionUi.latest}，点击以更新` }}
      </NTooltip>
    </div>

    <div id="appearance">
      <h2 class="title">外观</h2>
      <NSpace vertical justify="center" align="center">
        <NFormItem label="背景随主题变换" label-placement="left">
          <NSwitch
            :value="settingStore.appearance.bgDifferenceWithTheme"
            @update:value="(value) => settingStore.setAppearance({
              ...settingStore.appearance,
              bgDifferenceWithTheme: value
            })"
          />
        </NFormItem>
        <NSpace>
          <NFormItem
            label="背景图片"
            label-placement="top"
            :label-style="{ justifyContent: 'center' }"
          >
            <NImage
              :width="100"
              :preview-disabled="true"
              src="https://user-images.githubusercontent.com/18511905/148931479-23aef436-2fc1-4c1e-84c9-bae17be710a5.png"
            />
          </NFormItem>
          <NFormItem
            v-show="settingStore.appearance.bgDifferenceWithTheme"
            label="深色背景图片"
            label-placement="top"
            :label-style="{ justifyContent: 'center' }"
          >
            <NImage
              :width="100"
              :preview-disabled="true"
              src="https://user-images.githubusercontent.com/18511905/148931479-23aef436-2fc1-4c1e-84c9-bae17be710a5.png"
            />
          </NFormItem>
        </NSpace>
      </NSpace>
    </div>

    <div id="develop">
      <h2 class="title">开发者</h2>
    </div>
  </NForm>
</template>

<style lang="less" scoped>
.setting-form {
  text-align: center;
}

.title {
  text-align: left;
}

#appearance {
  text-align: center;
}
</style>
