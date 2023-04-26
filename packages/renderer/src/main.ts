import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from '@/router'
import App from '@/App.vue'
import watcher from '@/store/plugin/watcher'
import { initialStore } from '@/store/initial'
import { i18n } from '@/i18n'

import './App.less'

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
