<script setup lang="ts">
import { computed } from "vue";
import { NInput, NSpace, NIcon, NTooltip, NButton } from "naive-ui";
import IconBinary from "@/assets/icons/binary.svg?component";
import IconWindowUi from "@/assets/icons/window-ui.svg?component";

import useSettingStore from "@/store/settings";

const settingStore = useSettingStore();

const versionCore = computed(() => settingStore.version.core);
const versionUi = computed(() => settingStore.version.ui);

function needUpdate(version: { current: string, latest?: string }) {
  if (!version.latest) {
    return false;
  }
  return version.current !== version.latest;
}

function versionString(version: { current: string, latest?: string }) {
  let str = version.current;
  if (needUpdate(version)) {
    str += ` -> ${version.latest}`;
  }
  return str;
}

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
        <n-input v-model:value="settingStore.reportId" :placeholder="''" />
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