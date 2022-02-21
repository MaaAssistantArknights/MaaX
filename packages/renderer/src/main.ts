import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import useTheme from "./utils/theme"

import "./App.less"

createApp(App).use(createPinia()).mount("#app").$nextTick(window.removeLoading)

useTheme()
