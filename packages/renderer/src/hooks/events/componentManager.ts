import useComponentStore from '@/store/components'

import asst from '../caller/asst'

export default function useComponentManagerEvents(): void {
  const componentStore = useComponentStore()
  window.renderer.ComponentManager = {
    updateStatus({ status, progress, type }) {
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
      })
    },
    installDone({ status, progress, type }) {
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'installed',
      })
      asst.load(false)
    },
    downloadUpgradeDone({ status, progress, type }) {
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'need-restart',
      })
    },
    installInterrupted({ status, progress, type }) {
      componentStore.updateComponentStatus(type, {
        installerStatus: status,
        installerProgress: progress,
        componentStatus: 'not-installed',
      })
    },
  }
}
