import { Singleton } from '@common/function/singletonDecorator'
import { ipcMainHandle } from '@main/utils/ipc-main'
import { getComponentAdb } from './components/adb'
import { getComponentCore } from './components/core'
import { getComponentDependency } from './components/dependency'
import { getComponentResource } from './components/resource'

@Singleton
class ComponentManager implements Module {
  constructor () {
    ipcMainHandle('main.ComponentManager:getStatus',
      async (event, componentName: ComponentType) => {
        this.components_[componentName] = this.update[componentName]()
        return this.components_[componentName]?.status
      })

    ipcMainHandle('main.ComponentManager:install',
      async (event, componentName: ComponentType) => {
        this.components_[componentName] = this.update[componentName]()
        this.components_[componentName]?.installer?.install()
      })

    ipcMainHandle('main.ComponentManager:checkUpdate',
      async (event, componentName: ComponentType) => {
        this.components_[componentName] = this.update[componentName]()
        return this.components_[componentName]?.installer?.checkUpdate()
      })
  }

  public get name (): string {
    return 'ComponentManager'
  }

  public get version (): string {
    return '1.0.0'
  }

  private readonly update: Record<ComponentType, () => Component> = {
    'Maa App': () => ({ type: 'Maa App', status: 'installed' }),
    'Maa Core': getComponentCore,
    'Android Platform Tools': getComponentAdb,
    'Maa Dependency': getComponentDependency,
    'Maa Resource': getComponentResource
  }

  private readonly components_: Partial<Record<ComponentType, Component>> = {}
}

export default ComponentManager
