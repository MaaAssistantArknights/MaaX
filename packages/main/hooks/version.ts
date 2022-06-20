import { app, ipcMain } from 'electron'
import CoreLoader from '@main/coreLoader'
import { ipcMainHandle } from '@main/utils/ipc-main'

export default function useVersionHooks (): void {
  ipcMainHandle('main.Util:getUiVersion', async (event) => {
    return app.getVersion()
  })

  ipcMainHandle('main.CoreLoader:getCoreVersion', async (event) => {
    return (new CoreLoader()).GetVersion()
  })
}
