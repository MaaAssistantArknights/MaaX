import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from '@/router'
import App from '@/App.vue'
import watcher from '@/store/plugin/watcher'
import { initialStore } from '@/store/initial'

import './App.less'

const pinia = createPinia()
pinia.use(watcher)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app').$nextTick(() => {
  initialStore().then(() => {
    router.replace({ path: '/device' })
    // debug only
    window.onclick = (event) => {
      console.log('you clicked: ', event.target)
    }
  })
})
