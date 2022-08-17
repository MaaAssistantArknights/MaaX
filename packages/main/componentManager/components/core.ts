import fs from 'fs'

import CoreLoader from '@main/coreLoader'
import CoreInstaller from '@main/componentManager/installers/core'

export const getComponentCore = (): Component => {
  const coreLoader = new CoreLoader()

  const componentCore: Component = {
    type: 'Maa Core',
    status: 'not-installed',
    installer: new CoreInstaller()
  }

  const installed = fs.existsSync(coreLoader.libPath)
  if (installed) {
    componentCore.status = 'not-compatible'
  }

  const coreVersion = coreLoader.GetCoreVersion()

  if (coreVersion) {
    componentCore.status = 'installed'
  }
  return componentCore
}
