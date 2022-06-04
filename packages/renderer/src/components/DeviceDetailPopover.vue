<script lang="ts" setup>
import { NPopover, NImage, NInput, NIcon } from 'naive-ui'
import useDeviceStore from '@/store/devices'

const deviceStore = useDeviceStore()

const props = defineProps<{
  uuid: string;
}>()

const emit = defineEmits(['update:show'])
</script>

<template>
  <NPopover>
    <template #trigger>
      <slot></slot>
    </template>
  </NPopover>
</template>
