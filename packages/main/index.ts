import { app, BrowserWindow, shell } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { is } from 'electron-util'

import useTheme from './utils/theme'
import useDebug from './utils/debug'
import Window from './window/factory'
import useController from './window/control'

import useHooks from './hooks'

import { registerDownloadService } from './downloader'
import logger from './utils/logger'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (is.windows) app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

async function createWindow (): Promise<void> {
  const win = new Window().get()
  if (app.isPackaged || !is.development) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const host = process.env.VITE_DEV_SERVER_HOST
    const port = process.env.VITE_DEV_SERVER_PORT
    const url = `http://${host ?? 'localhost'}:${port ?? '3344'}`
    win.loadURL(url)
  }

  useController(win)
  useTheme(win)
  useHooks()
  registerDownloadService(win)
  if (is.development) {
    logger.warn('You are in development mode')
    useDebug(win)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  // const win = new Window().get();
  // win = null;
  app.quit()
})

app.on('second-instance', () => {
  const win = new Window().get()

  // Focus on the main window if the user tried to open another
  if (win?.isMinimized()) win?.restore()
  win?.focus()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length > 0) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
