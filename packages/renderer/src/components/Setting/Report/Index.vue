<script lang="ts" setup>
import useSettingStore from '@/store/settings'
import { NSpace, NTooltip, NInput, NFormItem } from 'naive-ui'

const settingStore = useSettingStore()

function onlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}
</script>

<template>
  <div id="statistics-report">
    <h2 class="title">数据上报</h2>
    <NSpace vertical justify="center">
      <NFormItem label="企鹅物流汇报ID">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput
              v-model:value="settingStore.penguinReportId"
              :allow-input="onlyAllowNumber"
              :placeholder="''"
              :style="{ width: '200px' }"
            />
          </template>
          汇报ID仅包含数字, 不正确的ID会在首次汇报结果时候自动替换
        </NTooltip>
      </NFormItem>
      <NFormItem label="一图流汇报ID">
        <NTooltip trigger="hover">
          <template #trigger>
            <NInput
              v-model:value="settingStore.yituliuReportId"
              :allow-input="onlyAllowNumber"
              :placeholder="''"
              :style="{ width: '200px' }"
            />
          </template>
          如不填将默认使用企鹅物流汇报ID, 汇报ID仅包含数字, 不正确的ID会在首次汇报结果时候自动替换
        </NTooltip>
      </NFormItem>
    </NSpace>
  </div>
</template>
