type ComponentName =
  | 'core'
  | 'adb'

type ComponentStatus =
  | 'not-installed'
  | 'not-compatible'
  | 'installing'
  | 'installed'
  | 'upgradable'
  | 'upgrading'

interface Component {
  name: ComponentName
  status: ComponentStatus
  installer?: import('packages/main/componentManager/componentInstaller').default
}
