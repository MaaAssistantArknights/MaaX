import fs from 'fs'
import path from 'path'

import { getAppBaseDir } from '@main/utils/path'
import ResourceInstaller from '../installers/resource'

export const getComponentResource = async (): Promise<Component> => {
  const componentResource: Component = {
    type: 'Maa Resource',
    status: 'not-installed',
    installer: new ResourceInstaller()
  }

  const versionFile = path.join(getAppBaseDir(), 'core/resource_version')

  if (fs.existsSync(versionFile)) {
    componentResource.status = 'installed'
    const update = await componentResource.installer.CheckUpdate()
    if (update) {
      componentResource.status = 'upgradable'
    }
  }

  return componentResource
}
