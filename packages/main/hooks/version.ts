import { app } from 'electron'
import CoreLoader from '@main/coreLoader'
import { ipcMainHandle } from '@main/utils/ipc-main'

export default function useVersionHooks (): void {
  ipcMainHandle('main.Util:getUiVersion', (event) => {
    return app.getVersion()
  })

  ipcMainHandle('main.CoreLoader:getCoreVersion', (event) => {
    return (new CoreLoader()).GetCoreVersion()
  })
}
