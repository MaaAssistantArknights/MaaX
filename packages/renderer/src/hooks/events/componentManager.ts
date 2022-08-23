import useComponentStore from '@/store/components'
import { useI18n } from 'vue-i18n'
import asst from '../caller/asst'

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
      asst.load(false)
    }
  )

  window.ipcRenderer.on('renderer.ComponentManager:installInterrupted',
    (event, data: {status: InstallerStatus, progress: number, type: ComponentType }) => {
      const componentStore = useComponentStore()
      const { status, progress, type } = data
      const { t } = useI18n()
      const typename = t(`download["${type}"]`)
      window.$message.error(`${typename}安装失败`)
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'not-installed'
      })
    })
}
