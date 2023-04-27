import useComponentStore from '@/store/components'
import asst from '../caller/asst'
import type { ComponentType } from '@type/componentManager'
import type { InstallerStatus } from '@type/misc'

export default function useComponentManagerEvents(): void {
  window.ipcRenderer.on(
    'renderer.ComponentManager:updateStatus',
    (
      event,
      data: { status: InstallerStatus; progress: number; type: ComponentType }
    ) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
      })
    }
  )

  window.ipcRenderer.on(
    'renderer.ComponentManager:installDone',
    (
      event,
      data: { status: InstallerStatus; progress: number; type: ComponentType }
    ) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'installed',
      })
      asst.load(false)
    }
  )

  window.ipcRenderer.on(
    'renderer.ComponentManager:downloadUpgradeDone',
    (
      event,
      data: { status: InstallerStatus; progress: number; type: ComponentType }
    ) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'need-restart',
      })
    }
  )

  window.ipcRenderer.on(
    'renderer.ComponentManager:installInterrupted',
    (
      event,
      data: { status: InstallerStatus; progress: number; type: ComponentType }
    ) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'not-installed',
      })
    }
  )
}
