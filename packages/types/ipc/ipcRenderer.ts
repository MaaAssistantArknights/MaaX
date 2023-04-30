import type { ComponentType } from '@type/componentManager'
import type { Callback } from '@type/task/callback'
import type { DeviceStatus, NativeDevice } from '@type/device'
import type { InstallerStatus } from '@type/misc'
import type { MessageOptions } from 'naive-ui'

export type IpcRendererOnEventType = {
  'renderer.WindowManager:updateMaximized': (isMaximized: boolean) => void
  'renderer.WindowManager:loaded': () => void
  'renderer.WindowManager:showMessage': (arg: { message: string; options: MessageOptions }) => void
  'renderer.CoreLoader:callback': (arg: Callback) => void
  'renderer.DeviceDetector:searched': (devices: NativeDevice[]) => void
  'renderer.DeviceDetector:changeStatus': (uuid: string, status: DeviceStatus) => void
  'renderer.AppearanceManager:systemThemeUpdated': (theme: 'maa-dark' | 'maa-light') => void
  // 'renderer.DownloadModal:updateStatus': () => void
  'renderer.ComponentManager:updateStatus': (arg: {
    type: ComponentType
    status: InstallerStatus
    progress: number
  }) => void
  'renderer.ComponentManager:installInterrupted': (arg: {
    type: ComponentType
    status: 'exception'
    progress: 0
  }) => void
  'renderer.ComponentManager:installDone': (arg: {
    type: ComponentType
    status: 'done'
    progress: 0
  }) => void
  'renderer.ComponentManager:downloadUpgradeDone': (arg: {
    type: ComponentType
    status: InstallerStatus
    progress: 0
  }) => void
  'renderer.Device:getScreenshot': (arg: { uuid: string }) => void
}

// 通过ipcRenderer.on定义的事件名称
export type IpcRendererOnEvent = keyof IpcRendererOnEventType
