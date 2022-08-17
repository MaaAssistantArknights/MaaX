import fs from 'fs'
import path from 'path'
import { app } from 'electron'

import AdbInstaller from '@main/componentManager/installers/adb'

export const getComponentAdb = (): Component => {
  const componentCore: Component = {
    type: 'Android Platform Tools',
    status: 'not-installed',
    installer: new AdbInstaller()
  }

  const installed = fs.existsSync(path.join(app.getPath('appData'), app.getName(), 'platform-tools'))
  if (installed) {
    componentCore.status = 'installed'
  }

  return componentCore
}
