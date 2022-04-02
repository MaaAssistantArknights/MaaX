<script setup lang="ts">
import {
  // NInputNumber,
  // NCheckbox,
  NForm,
  NFormItem,
  // NInput,
  NSelect
} from 'naive-ui'
import _ from 'lodash'

interface GameConfiguration {
  server: string; // 服务器
}

const serverOptions = [
  {
    value: 'CN',
    label: '官服'
  },
  {
    value: 'BILIBILI',
    label: 'BiliBili服'
  },
  {
    value: 'JP',
    label: '日服'
  },
  {
    value: 'GLOBAL',
    label: '国际服'
  },
  {
    value: 'CN_WSA',
    label: '官服 - WSA'
  },
  {
    value: 'BILIBILI_WSA',
    label: 'BiliBili服 - WSA'
  },
  {
    value: 'JP_WSA',
    label: '日服 - WSA'
  },
  {
    value: 'GLOBAL_WSA',
    label: '国际服 - WSA'
  }
]

const props = defineProps<{
  configurations: GameConfiguration;
}>()
</script>
<template>
  <NForm
    class="configuration-form"
    size="small"
    :show-feedback="false"
    :label-align="'left'"
    :label-placement="'left'"
    :label-width="'auto'"
  >
    <NFormItem label="服务器" :show-label="true">
      <NSelect
        :value="props.configurations.server"
        @update:value="(value) => _.set(props.configurations, 'server', value)"
        :options="serverOptions"
      />
    </NFormItem>
  </NForm>
</template>
