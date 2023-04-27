import type Installer from '@main/componentManager/componentInstaller'

export type ComponentType = 'Maa Core' | 'Maa App' | 'Android Platform Tools'

export type ComponentStatus =
  | 'not-installed'
  | 'not-compatible'
  | 'installing'
  | 'installed'
  | 'upgradable'
  | 'upgrading'
  | 'need-restart'

export interface Component {
  type: ComponentType
  status: ComponentStatus
  installer?: Installer
}

export interface Update {
  url: string
  version: string
  releaseDate: string
}
