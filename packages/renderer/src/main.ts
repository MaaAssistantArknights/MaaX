import App from '@/App.vue'
import { i18n } from '@/i18n'
import router from '@/router'
import { initialStore } from '@/store/initial'
import watcher from '@/store/plugin/watcher'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './App.less'
import { setupHookProxy } from './hooks'

setupHookProxy()

const pinia = createPinia()
pinia.use(watcher)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app').$nextTick(() => {
  initialStore().then(() => {
    router.replace({ path: '/device' })
    // debug only
    window.onclick = event => {
      console.log('you clicked: ', event.target)
    }
  })
})
