import fs from 'fs'
import path from 'path'
import { app } from 'electron'

import DependencyInstaller from '../installers/dependency'

export const getComponentDependency = (): Component => {
  const componentCore: Component = {
    type: 'Maa Dependency',
    status: 'not-installed',
    installer: new DependencyInstaller()
  }

  const versionFile = path.join(app.getPath('appData'), app.getName(), 'core/dep_version')

  if (fs.existsSync(versionFile)) {
    componentCore.status = 'installed'
  }

  return componentCore
}
