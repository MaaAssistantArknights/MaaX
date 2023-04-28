import fs from 'fs'

import CoreLoader from '@main/coreLoader'
import CoreInstaller from '@main/componentManager/installers/core'
import path from 'path'
import type { Component } from '@type/componentManager'
import { infoPathOf } from '../utils/update'

export const getComponentCore = async (): Promise<Component> => {
  const coreLoader = new CoreLoader()
  const installer = new CoreInstaller()

  const componentCore: Component = {
    type: 'Maa Core',
    status: 'not-installed',
    installer,
  }

  const installed = fs.existsSync(path.join(coreLoader.libPath, 'core_version'))
  if (installed) {
    componentCore.status = 'not-compatible'
  }

  const coreVersion = coreLoader.GetCoreVersion()

  if (coreVersion) {
    componentCore.status = 'installed'
    const ver = infoPathOf(installer.componentDir).currentVersion
    fs.writeFileSync(ver, coreVersion, 'utf-8') // always check version
    const update = await installer.checkUpdate()
    if (update.msg === 'haveUpdate') {
      componentCore.status = 'upgradable'
    }
  }
  return componentCore
}
