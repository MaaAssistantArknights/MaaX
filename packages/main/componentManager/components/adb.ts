import AdbInstaller from '@main/componentManager/installers/adb'
import type { Component } from '@type/componentManager'
import fs from 'fs'

import { infoPathOf } from '../utils/update'

export const getComponentAdb = async (): Promise<Component> => {
  const installer = new AdbInstaller()

  const componentAdb: Component = {
    type: 'Android Platform Tools',
    status: 'not-installed',
    installer,
  }

  const root = infoPathOf(installer.componentDir).installRoot
  const installed = fs.existsSync(root)
  if (installed) {
    componentAdb.status = 'installed'
  }

  return componentAdb
}
