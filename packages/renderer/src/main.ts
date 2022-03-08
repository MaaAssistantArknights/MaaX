import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "./App.less";
import App from "./App.vue";

createApp(App)
  .use(createPinia())
  .use(router)
  .mount("#app")
  .$nextTick(() => {
    window.removeLoading();
    router.replace({ path: "/device" });
    // debug only
    window.onclick = (event) => {
      console.log("you clicked: ", event.target);
    };
  });
