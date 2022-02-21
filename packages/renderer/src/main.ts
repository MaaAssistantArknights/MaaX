import { createApp } from "vue"
import { createPinia } from "pinia"
import useTheme from "./utils/theme"
import router from "./router"

import "./App.less"
import App from "./App.vue"

createApp(App)
  .use(createPinia())
  .use(router)
  .mount("#app")
  .$nextTick(window.removeLoading)

useTheme()
