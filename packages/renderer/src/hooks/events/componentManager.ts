import useComponentStore from '@/store/components'

export default function useComponentManagerEvents (): void {
  window.ipcRenderer.on(
    'renderer.ComponentManager:updateStatus',
    (event, data: { status: InstallerStatus, progress: number, type: ComponentType }) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress
      })
    }
  )

  window.ipcRenderer.on('renderer.ComponentManager:installDone',
    (event, data: {status: InstallerStatus, progress: number, type: ComponentType }) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'installed'
      })
    }
  )
}
