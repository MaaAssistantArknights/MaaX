import type { BrowserWindowConstructorOptions, BrowserWindow } from 'electron'
import { is } from 'electron-util'
import { join } from 'path'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class WindowFactory {
  private static create (
    options?: BrowserWindowConstructorOptions
  ): BrowserWindow {
    const module = is.windows
      ? require('electron-acrylic-window')
      : require('electron')
    const Ctor = module.BrowserWindow
    return new Ctor(options)
  }

  static getInstance (): BrowserWindow {
    if (this.instance_ == null) {
      this.instance_ = WindowFactory.create({
        transparent: true,
        frame: false,
        vibrancy: is.macos ? 'under-window' : 'appearance-based',
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
    }
    return this.instance_
  }

  static destory (): void {
    if (this.instance_ != null) {
      this.instance_.destroy()
    }
  }

  private static instance_: BrowserWindow | null = null;
}

export default WindowFactory
