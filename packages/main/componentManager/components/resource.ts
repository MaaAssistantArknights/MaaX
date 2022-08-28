import fs from 'fs'
import path from 'path'

import { getAppBaseDir } from '@main/utils/path'
import ResourceInstaller from '../installers/resource'

export const getComponentResource = (): Component => {
  const componentResource: Component = {
    type: 'Maa Resource',
    status: 'not-installed',
    installer: new ResourceInstaller()
  }

  const versionFile = path.join(getAppBaseDir(), 'core/resource_version')

  if (fs.existsSync(versionFile)) {
    componentResource.status = 'installed'
  }

  return componentResource
}
