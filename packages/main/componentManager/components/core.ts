import fs from 'fs'

import { Assistant } from '@main/coreLoader'
import CoreInstaller from '@main/componentManager/installers/core'

const componentCore: Component = {
  name: 'core',
  status: 'not-installed',
  installer: new CoreInstaller()
}

const installed = fs.existsSync(Assistant.libPath)
if (installed) {
  componentCore.status = 'not-compatible'
}

const coreVersion = Assistant.getInstance()?.GetVersion()

if (coreVersion) {
  componentCore.status = 'installed'
}

export default componentCore
