import { Singleton } from '@common/function/singletonDecorator'
import Storage from '@main/storageManager'
import { getPlatform } from '@main/utils/os'
import type { Module } from '@type/misc'
import { BrowserWindow } from 'electron'
import { join } from 'path'

import useController from './control'
import useTheme from './theme'

@Singleton
class WindowManager implements Module {
  constructor() {
    this.window_ = new BrowserWindow({
      backgroundColor: '#00000000',
      frame: getPlatform() === 'macos',
      icon: join(__dirname, '../renderer/assets/icon.png'),
      titleBarOverlay: true,
      // frameless和titleBarStyle: 'hidden'同时开，会显示窗口控制按钮
      titleBarStyle: 'hidden',
      width: 1024,
      height: 768,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        // 编译后的模块仍然是main/index.cjs
        preload: join(__dirname, '../preload/index.cjs'),
        sandbox: true,
        contextIsolation: true,
      },
    })
    useController(this.window_)
    useTheme(this.window_)
    if (getPlatform() === 'macos') {
      this.window_.setWindowButtonPosition({
        x: 12,
        y: 12,
      })
    }
    if (getPlatform() === 'windows') {
      this.window_.setTitleBarOverlay({
        color: '#00000000',
        symbolColor: '#FFFFFF',
      })
    }
    this.useVibrancy()
  }

  private useVibrancy() {
    const storage = new Storage()
    if (getPlatform() === 'macos' && storage.get('theme.acrylic')) {
      this.window_.setVibrancy('under-window')
    }
    if (getPlatform() === 'windows' && storage.get('theme.acrylic')) {
      this.window_.setBackgroundMaterial('mica')
    }
  }

  public get name(): string {
    return 'WindowManager'
  }

  public get version(): string {
    return '1.0.0'
  }

  private readonly window_: BrowserWindow

  public getWindow(): BrowserWindow {
    return this.window_
  }

  public destoryWindow(): void {
    if (this.window_ !== null) {
      this.window_.destroy()
    }
  }
}

export default WindowManager
