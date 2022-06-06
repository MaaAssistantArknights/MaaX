import fs from 'fs'

import CoreLoader from '@main/coreLoader'
import CoreInstaller from '@main/componentManager/installers/core'

const coreLoader = new CoreLoader()

const componentCore: Component = {
  name: 'core',
  status: 'not-installed',
  installer: new CoreInstaller()
}

const installed = fs.existsSync(coreLoader.libPath)
if (installed) {
  componentCore.status = 'not-compatible'
}

const coreVersion = coreLoader.GetVersion()

if (coreVersion) {
  componentCore.status = 'installed'
}

export default componentCore
