import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router"

import SideBarIndex from "@/layouts/sidebars/Index.vue"
import PageIndex from "@/layouts/pages/Index.vue"

import SideBarSetting from "@/layouts/sidebars/Setting.vue"
import PageSetting from "@/layouts/pages/Setting.vue"

import SideBarStart from "@/layouts/sidebars/Start.vue"
import PageStart from "@/layouts/pages/Start.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    components: {
      default: PageIndex,
      SideBar: SideBarIndex,
    },
  },
  {
    path: "/settings",
    components: {
      default: PageSetting,
      SideBar: SideBarSetting,
    },
  },
  {
    path: "/start",
    components: {
      default: PageStart,
      SideBar: SideBarStart,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
