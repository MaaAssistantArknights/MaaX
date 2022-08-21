<script setup lang="ts">
import { NCheckbox, NFormItem, NSelect } from 'naive-ui'
import _ from 'lodash'

interface StartUpConfiguration {
  client_type: string; // 服务器
  start_game_enable: boolean; // 是否自动启动客户端
}

const serverOptions = [
  {
    value: 'CN',
    label: 'CN'
  },
  {
    value: 'BiliBili',
    label: 'BiliBili'
  }
]

const props = defineProps<{
  configurations: StartUpConfiguration;
}>()
</script>
<template>
  <div class="configuration-form">
    <NFormItem
      label="客户端类型"
      :show-label="true"
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NSelect
        :value="props.configurations.client_type"
        :options="serverOptions"
        @update:value="(value) => _.set(props.configurations, 'client_type', value)"
      />
    </NFormItem>
    <NFormItem
      size="small"
      label-align="left"
      label-placement="left"
      :show-feedback="false"
    >
      <NCheckbox
        :checked="props.configurations.start_game_enable"
        @update:checked="
          (checked) => _.set(props.configurations, 'start_game_enable', checked)
        "
      >
        自动启动客户端
      </NCheckbox>
    </NFormItem>
  </div>
</template>
