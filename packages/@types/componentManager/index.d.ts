type ComponentType =
  | 'Maa Resource'
  | 'Maa Core'
  | 'Maa Bundle'
  | 'Maa Dependency'
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
