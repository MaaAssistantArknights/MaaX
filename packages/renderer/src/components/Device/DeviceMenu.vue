<script lang="ts" setup>
import { ref, computed, h } from 'vue'
import { NMenu, type MenuOption } from 'naive-ui';
import router from '@/router';

import type { Device } from '@type/device'
import DeviceCard from './DeviceCard.vue';
import useTaskStore from '@/store/tasks';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  device: Device
}>()
const taskStore = useTaskStore()

const routeUuid = computed(() => router.currentRoute.value.params.uuid as string | undefined)

const menuOptions: MenuOption[] = [{
  label: () => h(DeviceCard, { device: props.device }),
  key: props.device.uuid,
  // onClick: () => handleJumpToTask(d),
  children: [
    {
      label: () =>
        h(
          RouterLink,
          {
            to: `/task/${routeUuid}`,
            replace: true,
          },
          {
            default: () => '任务',
          }
        ),
      key: 'task',
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: `/task/${routeUuid}/copilot`,
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
            to: `/task/${routeUuid}/item`,
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
            to: `/task/${routeUuid}/oper`,
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
            to: `/task/${routeUuid}/recruit`,
            replace: true,
          },
          {
            default: () => '公招识别',
          }
        ),
      key: 'recruit',
    },
  ]
}]

function handleJumpToTask(device: Device) {
  if (!taskStore.getCurrentTaskGroup(device.uuid)) {
    taskStore.initDeviceTask(device.uuid)
  }
  taskStore.fixTaskList(device.uuid)
  router.push(`/task/${device.uuid}`)
}
</script>

<template>
  <NMenu :options="menuOptions" :root-indent="0" />
</template>
