import { Singleton } from '@common/function/singletonDecorator'
import { ipcMainHandle } from '@main/utils/ipc-main'
import componentAdb from './components/adb'
import { getComponentCore } from './components/core'

@Singleton
class ComponentManager implements Module {
  constructor () {
    ipcMainHandle('main.ComponentManager:getStatus',
      async (event, componentName: ComponentType) => {
        return this.components_[componentName]?.status
      })

    ipcMainHandle('main.ComponentManager:install',
      async (event, componentName: ComponentType) => {
        this.components_[componentName]?.installer?.install()
      })

    ipcMainHandle('main.ComponentManager:checkUpdate',
      async (event, componentName: ComponentType) => {
        return this.components_[componentName]?.installer?.checkUpdate()
      })
  }

  public get name (): string {
    return 'ComponentManager'
  }

  public get version (): string {
    return '1.0.0'
  }

  // TODO: remove partial
  private readonly components_: Partial<Record<ComponentType, Component>> = {
    'Maa Core': getComponentCore(),
    'Android Platform Tools': componentAdb
  }
}

export default ComponentManager
