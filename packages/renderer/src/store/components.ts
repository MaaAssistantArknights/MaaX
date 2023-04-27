import type { ComponentType, ComponentStatus } from '@type/componentManager'
import type { InstallerStatus } from '@type/misc'
import { defineStore } from 'pinia'

export type ComponentStoreState = {
  [K in ComponentType]: {
    componentStatus: ComponentStatus
    installerStatus: InstallerStatus
    installerProgress: number
  }
}

export interface ComponentStoreAction {
  updateComponentStatus: (
    component: ComponentType,
    status: Partial<{
      componentStatus: ComponentStatus
      installerStatus: InstallerStatus
      installerProgress: number
    }>
  ) => void
}

const useComponentStore = defineStore<
  'component',
  ComponentStoreState,
  {},
  ComponentStoreAction
>('component', {
  state: () => {
    return {
      'Maa Core': {
        componentStatus: 'not-installed',
        installerStatus: 'pending',
        installerProgress: 0,
      },
      'Android Platform Tools': {
        componentStatus: 'not-installed',
        installerStatus: 'pending',
        installerProgress: 0,
      },
      'Maa App': {
        componentStatus: 'not-installed',
        installerStatus: 'pending',
        installerProgress: 0,
      },
    }
  },
  actions: {
    updateComponentStatus(component, status) {
      this[component] = { ...this[component], ...status }
    },
  },
})

export default useComponentStore
