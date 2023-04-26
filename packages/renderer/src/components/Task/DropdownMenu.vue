<script lang="ts" setup>
import { NDropdown, NIcon } from 'naive-ui'
import { h } from 'vue'
import SettingsIcon from '@/assets/icons/settings.svg'
import InProgressIcon from '@/assets/icons/in-progress.svg'

const props = defineProps<{
  x: number
  y: number
  show: boolean
}>()

const emit = defineEmits<{
  (event: 'select', key: string): void
  (event: 'update:show', value: boolean): void
}>()

const options = [
  {
    label: '配置面板',
    key: 'configuration-panel',
    icon: () => h(NIcon, null, { default: () => h(SettingsIcon) }),
  },
  {
    label: '进度面板',
    key: 'result-panel',
    icon: () => h(NIcon, null, { default: () => h(InProgressIcon) }),
  },
  // {
  //   type: 'divider',
  //   key: 'divider1'
  // }
]

const handleClickOutside = () => {
  emit('update:show', false)
}

const handleSelect = (key: string) => {
  emit('select', key)
  emit('update:show', false)
}
</script>

<template>
  <NDropdown
    placement="bottom-start"
    trigger="manual"
    :show="props.show"
    :x="props.x"
    :y="props.y"
    :options="options"
    @clickoutside="handleClickOutside"
    @select="handleSelect"
  />
</template>

<style lang="less" scoped></style>
