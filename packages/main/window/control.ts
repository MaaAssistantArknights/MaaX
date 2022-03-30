import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

export default function useController (window: BrowserWindow) {
  ipcMain.on('window:close', () => {
    if (window.isClosable()) {
      window.close()
    }
  })

  ipcMain.handle('window:toggle-maximized', async (event) => {
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

  ipcMain.handle('window:minimize', async (event) => {
    if (window.isMinimizable()) {
      window.minimize()
      return true
    }
  })

  ipcMain.handle('window:is-maximized', async (event) => {
    return window.isMaximized()
  })

  window.on('maximize', () => {
    window.webContents.send('window:update-maximized', window.isMaximized())
  })

  window.on('unmaximize', () => {
    window.webContents.send('window:update-maximized', window.isMaximized())
  })
}
