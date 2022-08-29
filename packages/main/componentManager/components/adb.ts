import fs from 'fs'
import path from 'path'

import AdbInstaller from '@main/componentManager/installers/adb'
import { getAppBaseDir } from '@main/utils/path'

export const getComponentAdb = async (): Promise<Component> => {
  const componentAdb: Component = {
    type: 'Android Platform Tools',
    status: 'not-installed',
    installer: new AdbInstaller()
  }

  const installed = fs.existsSync(path.join(getAppBaseDir(), 'platform-tools'))
  if (installed) {
    componentAdb.status = 'installed'
  }

  return componentAdb
}
