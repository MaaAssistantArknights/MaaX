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
