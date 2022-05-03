import { ipcMainHandle } from '@main/utils/ipc-main'
import componentAdb from './components/adb'
import componentCore from './components/core'

const components: Record<ComponentName, Component> = {
  core: componentCore,
  adb: componentAdb
}

export const registerComponentManager = (): void => {
  ipcMainHandle('componentManager:getStatus',
    async (event, componentName: ComponentName) => {
      return components[componentName]?.status
    })

  ipcMainHandle('componentManager:install',
    async (event, componentName: ComponentName) => {
      components[componentName]?.installer?.install()
    })
}
