import fs from 'fs'
import path from 'path'

import DependencyInstaller from '../installers/dependency'
import { getAppBaseDir } from '@main/utils/path'

export const getComponentDependency = async (): Promise<Component> => {
  const componentDependency: Component = {
    type: 'Maa Dependency',
    status: 'not-installed',
    installer: new DependencyInstaller()
  }

  const versionFile = path.join(getAppBaseDir(), 'core/dep_version')

  if (fs.existsSync(versionFile)) {
    componentDependency.status = 'installed'
  }

  return componentDependency
}
