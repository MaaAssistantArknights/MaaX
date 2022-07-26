import { Singleton } from '@common/function/singletonDecorator'
import { ipcMainHandle } from '@main/utils/ipc-main'
import componentAdb from './components/adb'
import componentCore from './components/core'

const components: Record<ComponentName, Component> = {
  core: componentCore,
  adb: componentAdb
}

@Singleton
class ComponentManager implements Module {
  constructor () {
    ipcMainHandle('main.componentManager:getStatus',
      async (event, componentName: ComponentName) => {
        return components[componentName]?.status
      })

    ipcMainHandle('main.componentManager:install',
      async (event, componentName: ComponentName) => {
        components[componentName]?.installer?.install()
      })

    ipcMainHandle('main.componentManager:checkUpdate',
      async (event, componentName: ComponentName) => {
        return components[componentName]?.installer?.checkUpdate()
      })
  }

  public get name (): string {
    return 'ComponentManager'
  }

  public get version (): string {
    return '1.0.0'
  }
}

export default ComponentManager
