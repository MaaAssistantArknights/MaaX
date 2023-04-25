import { ipcMainHandle, ipcMainOn } from '@main/utils/ipc-main'
import type { BrowserWindow } from 'electron'
import { ipcMain, dialog } from 'electron'

type DialogProperty =
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent'

export default function useController (window: BrowserWindow): void {
  ipcMainOn('main.WindowManager:closeWindow', () => {
    if (window.isClosable()) {
      window.close()
    }
  })

  ipcMainHandle('main.WindowManager:toggleMaximized', (event) => {
    if (!window.isMaximized() && window.isMaximizable()) {
      window.maximize()
      return true
    } else if (window.isMaximized()) {
      window.unmaximize()
      return false
    } else {
      return new Error('window is not maximizable')
    }
  })

  ipcMainHandle('main.WindowManager:minimize', (event) => {
    if (window.isMinimizable()) {
      window.minimize()
      return true
    } else {
      return false
    }
  })

  ipcMainHandle('main.WindowManager:isMaximized', (event) => {
    return window.isMaximized()
  })

  window.on('maximize', () => {
    window.webContents.send('renderer.WindowManager:updateMaximized', window.isMaximized())
  })

  window.on('unmaximize', () => {
    window.webContents.send('renderer.WindowManager:updateMaximized', window.isMaximized())
  })

  ipcMainHandle('main.WindowManager:openDialog', async (
    event,
    title: string,
    properties: DialogProperty[],
    filters: Electron.FileFilter[]
  ) => {
    return await dialog.showOpenDialog(window, {
      title: title,
      properties: properties,
      filters: filters
    })
  })
}
