<script setup lang="ts">
import IconChevronLeft from '@/assets/icons/chevron-left.svg?component'
import DeviceCard from '@/components/Device/DeviceCard.vue'
import router from '@/router'
import useDeviceStore from '@/store/devices'
import { type MenuOption, NButton, NIcon, NMenu } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

const deviceStore = useDeviceStore()

const currentUuid = router.currentRoute.value.params.uuid as string
const currentDevice = computed(() =>
  deviceStore.devices.find(device => device.uuid === currentUuid)
)

const menuActiveKey = ref<string | null>(null)
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: `/tool/${currentUuid}/copilot`,
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
          to: `/tool/${currentUuid}/item`,
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
          to: `/tool/${currentUuid}/oper`,
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
          to: `/tool/${currentUuid}/recruit`,
          replace: true,
        },
        {
          default: () => '公招识别',
        }
      ),
    key: 'recruit',
  },
]
</script>

<template>
  <div>
    <NButton text style="font-size: 24px" @click="$router.replace(`/task/${currentUuid}`)">
      <NIcon>
        <IconChevronLeft />
      </NIcon>
    </NButton>
    <h2>当前设备</h2>
    <div class="current-device">
      <DeviceCard :device="currentDevice!" />
    </div>
    <h2>小工具</h2>
    <NMenu v-model:value="menuActiveKey" :options="menuOptions" />
  </div>
</template>
