import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";

import SideBarTask from "@/layouts/sidebars/Task.vue";
import PageTask from "@/layouts/pages/Task.vue";

import SideBarSetting from "@/layouts/sidebars/Setting.vue";
import PageSetting from "@/layouts/pages/Setting.vue";

import SideBarDevice from "@/layouts/sidebars/Device.vue";
import PageDevice from "@/layouts/pages/Device.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/task/:uuid",
    components: {
      Main: PageTask,
      SideBar: SideBarTask,
    },
  },
  {
    path: "/settings",
    components: {
      Main: PageSetting,
      SideBar: SideBarSetting,
    },
  },
  {
    path: "/device",
    components: {
      Main: PageDevice,
      SideBar: SideBarDevice,
    },
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
