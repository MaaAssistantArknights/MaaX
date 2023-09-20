<script lang="ts" setup>
import router from '@/router'
import useTaskStore from '@/store/tasks'
import type { Device } from '@type/device'
import { type MenuOption, NMenu } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

import DeviceCard from './DeviceCard.vue'

const props = defineProps<{
  device: Device
}>()
const taskStore = useTaskStore()

const uuid = computed(() => props.device.uuid)

const menuOptions: MenuOption[] = [
  {
    label: () => h(DeviceCard, { device: props.device }),
    key: props.device.uuid,
    // onClick: () => handleJumpToTask(d),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: `/task/${uuid.value}`,
              replace: true,
            },
            {
              default: () => '一键长草',
            }
          ),
        key: 'task',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: `/task/${uuid.value}/copilot`,
              replace: true,
            },
            {
              default: () => 'MAA Copilot',
            }
          ),
        key: 'copilot',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: `/task/${uuid.value}/item`,
              replace: true,
            },
            {
              default: () => '仓库识别',
            }
          ),
        key: 'item',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: `/task/${uuid.value}/oper`,
              replace: true,
            },
            {
              default: () => '干员识别',
            }
          ),
        key: 'oper',
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: `/task/${uuid.value}/recruit`,
              replace: true,
            },
            {
              default: () => '公招识别',
            }
          ),
        key: 'recruit',
      },
    ],
  },
]

function handleJumpToTask(device: Device) {
  if (!taskStore.getCurrentTaskGroup(device.uuid)) {
    taskStore.initDeviceTask(device.uuid)
  }
  taskStore.fixTaskList(device.uuid)
  router.push(`/task/${device.uuid}`)
}
</script>

<template>
  <NMenu :options="menuOptions" :root-indent="0" :indent="48" />
</template>

<style lang="less" scoped>
.n-menu :deep(.n-menu-item-content::before) {
  left: 0;
}
</style>
