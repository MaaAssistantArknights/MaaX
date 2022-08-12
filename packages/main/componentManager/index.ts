import { Singleton } from '@common/function/singletonDecorator'
import { ipcMainHandle } from '@main/utils/ipc-main'
import componentAdb from './components/adb'
import componentCore from './components/core'

const components: Record<ComponentType, Component> = {
  core: componentCore,
  adb: componentAdb
}

@Singleton
class ComponentManager implements Module {
  constructor () {
    ipcMainHandle('main.ComponentManager:getStatus',
      async (event, componentName: ComponentType) => {
        return components[componentName]?.status
      })

    ipcMainHandle('main.ComponentManager:install',
      async (event, componentName: ComponentType) => {
        components[componentName]?.installer?.install()
      })

    ipcMainHandle('main.ComponentManager:checkUpdate',
      async (event, componentName: ComponentType) => {
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
