import { Singleton } from '@common/function/singletonDecorator'
import { ipcMainHandle } from '@main/utils/ipc-main'
import { getComponentAdb } from './components/adb'
import { getComponentCore } from './components/core'
import CoreLoader from '@main/coreLoader'
import type { Module } from '@type/misc'
import type { Component, ComponentType } from '@type/componentManager'

@Singleton
class ComponentManager implements Module {
  private readonly updater: Record<ComponentType, () => Promise<Component>> = {
    'Maa App': async () => ({ type: 'Maa App', status: 'installed' }),
    'Maa Core': getComponentCore,
    'Android Platform Tools': getComponentAdb,
  }

  private readonly components: Partial<Record<ComponentType, Component>> = {}

  public get name(): string {
    return 'ComponentManager'
  }

  public get version(): string {
    return '1.0.0'
  }

  constructor() {
    ipcMainHandle(
      'main.ComponentManager:getStatus',
      async (event, componentName: ComponentType) => {
        this.components[componentName] = await this.updater[componentName]()
        return this.components[componentName]?.status
      }
    )

    ipcMainHandle('main.ComponentManager:install', async (event, componentName: ComponentType) => {
      // 按理说这个时候应该没有Core才会进入install, 但是先留着吧
      if (componentName === 'Maa Core') {
        const coreLoader = new CoreLoader()
        // coreLoader.dispose()
      }
      this.components[componentName] = await this.updater[componentName]()
      this.components[componentName]?.installer?.install()
    })

    ipcMainHandle('main.ComponentManager:upgrade', async (event, componentName: ComponentType) => {
      // 安装文件时，需要dispose core，否则无法写入
      // TODO core 卸载炸了
      if (componentName === 'Maa Core') {
        // const coreLoader = new CoreLoader()
        // MAA 4.13后无法正常卸载
        // coreLoader.dispose()
        // return
      }
      this.components[componentName]?.installer?.install()
    })
  }
}

export default ComponentManager
