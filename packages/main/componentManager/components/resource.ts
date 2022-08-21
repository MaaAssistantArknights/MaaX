import fs from 'fs'
import path from 'path'
import { app } from 'electron'

import ResourceInstaller from '../installers/resource'

export const getComponentResource = (): Component => {
  const componentCore: Component = {
    type: 'Maa Resource',
    status: 'not-installed',
    installer: new ResourceInstaller()
  }

  const versionFile = path.join(app.getPath('appData'), app.getName(), 'core/resource/version')

  if (fs.existsSync(versionFile)) {
    componentCore.status = 'installed'
  }

  return componentCore
}
