import { ipcMainHandle } from '@main/utils/ipc-main'
import componentAdb from './components/adb'
import componentCore from './components/core'

const components: Record<ComponentName, Component> = {
  core: componentCore,
  adb: componentAdb
}

export default function registerComponentManager (): void {
  ipcMainHandle({
    name: 'componentManager:getStatus',
    listener: async (event, componentName: ComponentName) => {
      return components[componentName]?.status
    }
  })

  ipcMainHandle({
    name: 'componentManager:install',
    listener: async (event, componentName: ComponentName) => {
      components[componentName]?.installer?.install()
    }
  })
}
