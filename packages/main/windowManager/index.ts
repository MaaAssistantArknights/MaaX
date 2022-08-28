import type { BrowserWindowConstructorOptions, BrowserWindow } from 'electron'
import { is } from 'electron-util'
import { join } from 'path'
import { Singleton } from '@common/function/singletonDecorator'
import useController from './control'
import useTheme from './theme'
import Storage from '@main/storageManager'

const createWindow = (options?: BrowserWindowConstructorOptions): BrowserWindow => {
  const storage = new Storage()
  const module = is.windows && storage.get('theme.acrylic')
    ? require('electron-acrylic-window')
    : require('electron')
  const Ctor = module.BrowserWindow
  return new Ctor(options)
}

@Singleton
class WindowManager implements Module {
  constructor () {
    const storage = new Storage()
    this.window_ = createWindow({
      transparent: true,
      frame: false,
      vibrancy: is.macos && storage.get('theme.acrylic') ? 'under-window' : 'appearance-based',
      width: 1024,
      height: 768,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        // 编译后的模块仍然是main/index.cjs
        preload: join(__dirname, '../preload/index.cjs'),
        sandbox: true,
        contextIsolation: true
      }
    })
    useController(this.window_)
    useTheme(this.window_)
  }

  public get name (): string {
    return 'WindowManager'
  }

  public get version (): string {
    return '1.0.0'
  }

  private readonly window_: BrowserWindow

  public getWindow (): BrowserWindow {
    return this.window_
  }

  public destoryWindow (): void {
    if (this.window_ !== null) {
      this.window_.destroy()
    }
  }
}

export default WindowManager
