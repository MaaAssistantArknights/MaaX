type ComponentType =
  | 'Maa Core'
  | 'Maa Resource'
  | 'Maa Dependency'
  | 'Maa App'
  | 'Android Platform Tools'

type ComponentStatus =
  | 'not-installed'
  | 'not-compatible'
  | 'installing'
  | 'installed'
  | 'upgradable'
  | 'upgrading'

interface Component {
  type: ComponentType
  status: ComponentStatus
  installer?: import('packages/main/componentManager/componentInstaller').default
}

interface DownloadHandle {
  handleDownloadUpdate: (task: DownloadTask) => void
  handleDownloadCompleted: (task: DownloadTask) => void
  handleDownloadInterrupted: () => void
}

interface UnzipHandle {
  handleUnzipUpdate: (percent: number) => void
  handleUnzipCompleted: () => void
  handleUnzipInterrupted: () => void
}

interface Update {
  url: string
  version: string
  releaseDate: string
}
