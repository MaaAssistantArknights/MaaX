import fs from 'fs'

import CoreLoader from '@main/coreLoader'
import CoreInstaller from '@main/componentManager/installers/core'
import path from 'path'

export const getComponentCore = async (): Promise<Component> => {
  const coreLoader = new CoreLoader()

  const componentCore: Component = {
    type: 'Maa Core',
    status: 'not-installed',
    installer: new CoreInstaller()
  }

  const installed = fs.existsSync(path.join(coreLoader.libPath, 'core_version'))
  if (installed) {
    componentCore.status = 'not-compatible'
  }

  const coreVersion = coreLoader.GetCoreVersion()

  if (coreVersion) {
    componentCore.status = 'installed'
    const update = await componentCore.installer.CheckUpdate()
    if (update) {
      componentCore.status = 'upgradable'
    }
  }
  return componentCore
}
