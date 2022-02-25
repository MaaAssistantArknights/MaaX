import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";

import SideBarIndex from "@/layouts/sidebars/Index.vue";
import PageIndex from "@/layouts/pages/Index.vue";

import SideBarSetting from "@/layouts/sidebars/Setting.vue";
import PageSetting from "@/layouts/pages/Setting.vue";

import SideBarStart from "@/layouts/sidebars/Start.vue";
import PageStart from "@/layouts/pages/Start.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/device/:uuid",
    components: {
      Main: PageIndex,
      SideBar: SideBarIndex,
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
    path: "/start",
    components: {
      Main: PageStart,
      SideBar: SideBarStart,
    },
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
