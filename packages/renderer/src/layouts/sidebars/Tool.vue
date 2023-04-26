<script setup lang="ts">
import { NButton, NIcon, NMenu, MenuOption } from 'naive-ui'
import { h, ref, Ref, computed } from 'vue'
import DeviceCard from '@/components/Device/DeviceCard.vue'
import useDeviceStore from '@/store/devices'
import router from '@/router'
import { RouterLink } from 'vue-router'
import IconChevronLeft from '@/assets/icons/chevron-left.svg?component'

const deviceStore = useDeviceStore()

const currentUuid = router.currentRoute.value.params.uuid as string
const currentDevice = computed(() =>
  deviceStore.devices.find(device => device.uuid !== currentUuid)
)

const menuActiveKey: Ref<string | null> = ref(null)
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: `/tool/${currentUuid}/copilot`,
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
          to: `/tool/${currentUuid}/recruit`,
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
    <NButton text style="font-size: 24px" @click="$router.back()">
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
