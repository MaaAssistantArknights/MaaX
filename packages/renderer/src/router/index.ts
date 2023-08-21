import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import SideBarTask from '@/layouts/sidebars/Task.vue'
import PageTask from '@/layouts/pages/Task.vue'

import SideBarSetting from '@/layouts/sidebars/Setting.vue'
import PageSetting from '@/layouts/pages/Setting.vue'

import SideBarDevice from '@/layouts/sidebars/Device.vue'
import PageDevice from '@/layouts/pages/Device.vue'

import ToolCopilot from '@/components/Tool/Copilot.vue'
import ToolItem from '@/components/Tool/Item.vue'
import ToolOperBox from '@/components/Tool/OperBox.vue'
import ToolRecruit from '@/components/Tool/Recruit.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/task/:uuid',
    children: [
      {
        path: '',
        components: {
          Main: PageTask,
          SideBar: SideBarTask,
        },
      },
      {
        path: 'copilot',
        components: {
          Main: ToolCopilot,
          SideBar: SideBarTask,
        },
      },
      {
        path: 'item',
        components: {
          Main: ToolItem,
          SideBar: SideBarTask,
        },
      },
      {
        path: 'oper',
        components: {
          Main: ToolOperBox,
          SideBar: SideBarTask,
        },
      },
      {
        path: 'recruit',
        components: {
          Main: ToolRecruit,
          SideBar: SideBarTask,
        },
      },
    ],
  },
  {
    path: '/settings',
    components: {
      Main: PageSetting,
      SideBar: SideBarSetting,
    },
  },
  {
    path: '/device',
    components: {
      Main: PageDevice,
      SideBar: SideBarDevice,
    },
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
