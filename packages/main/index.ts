import { app, BrowserWindow, shell } from 'electron'
import { release } from 'os'
import { join } from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { getPlatform, isInDev } from '@main/utils/os'

import useDebug from '@main/utils/debug'
import logger from '@main/utils/logger'
import useHooks from '@main/hooks'

// modules
import WindowManager from '@main/windowManager'
import StorageManager from '@main/storageManager'
import ComponentManager from '@main/componentManager'
import CoreLoader from '@main/coreLoader'
import DeviceDetector from '@main/deviceDetector'
import DownloadManager from './downloadManager'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (getPlatform() === 'windows') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

async function createApp (): Promise<void> {
  const win = new WindowManager().getWindow()
  if (app.isPackaged || !isInDev()) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const host = process.env.VITE_DEV_SERVER_HOST
    const port = process.env.VITE_DEV_SERVER_PORT
    const url = `http://${host ?? 'localhost'}:${port ?? '3344'}`
    win.loadURL(url)
  }
  const modulesCtor = [
    WindowManager,
    StorageManager,
    CoreLoader,
    DeviceDetector,
    DownloadManager,
    ComponentManager
  ]

  for (const Ctor of modulesCtor) {
    try {
      const m = new Ctor()
      logger.info(`module ${m.name}-v${m.version} loaded.`)
    } catch (e) {
      logger.error(`module ${Ctor.name} load failed!`)
    }
  }
  useHooks()
  if (isInDev()) {
    logger.warn('You are in development mode')
    useDebug(win)
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createApp)

app.on('window-all-closed', () => {
  // const win = new Window().get();
  // win = null;
  app.quit()
})

app.on('will-quit', () => {
  const tokenPath = join(app.getPath('temp'), 'clearConfigToken')
  const exist = fs.existsSync(tokenPath)
  if (exist) {
    fs.rmSync(tokenPath)
    //仅能对正式环境使用
    if (!isInDev()) {
      const pid = process.pid.toString()
      const appPath = join(app.getPath('appData'), app.getName())
      const exePath = process.argv[0]
      // const out = fs.openSync('./out.log', 'a')
      // const err = fs.openSync('./out.log', 'a')
      const subprocess = spawn('cmd.exe', ['/c', join(__dirname, 'clearAppConfig.bat'), appPath, pid, exePath], {
        detached: true,
        stdio: ['ignore']
        // stdio: ['ignore', out, err]
      })
      subprocess.unref()
      // app.relaunch()
      app.exit()
    }
  }
})

app.on('second-instance', () => {
  const win = new WindowManager().getWindow()

  // Focus on the main window if the user tried to open another
  if (win?.isMinimized()) win?.restore()
  win?.focus()
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length > 0) {
    allWindows[0].focus()
  } else {
    createApp()
  }
})
