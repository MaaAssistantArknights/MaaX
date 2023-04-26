type __PropertyArray = Electron.OpenDialogOptions['properties']
type __CleanUndefined<T> = T extends undefined ? never : T

type DialogProperty = __CleanUndefined<__PropertyArray> extends (infer T)[] ? T : never

type IpcMainHandleEventType__AutoRegister = {
  'main.CoreLoader:loadResource': (arg: { path: string }) => boolean
  'main.CoreLoader:getImage': (arg: { uuid: string }) => string
  'main.CoreLoader:getLibPath': () => string
  'main.CoreLoader:create': () => boolean
  'main.CoreLoader:createEx': (arg: { address: string }) => boolean
  'main.CoreLoader:destroy': (arg: { uuid: string }) => boolean
  'main.CoreLoader:connect': (arg: { address: string, uuid: string, adb_path: string, config: string }) => boolean
  'main.CoreLoader:initCore': (arg: InitCoreParam) => boolean
  'main.CoreLoader:initCoreAsync': (arg: InitCoreParam) => number
  'main.CoreLoader:disconnectAndDestroy': (arg: { uuid: string }) => boolean
  'main.CoreLoader:appendTask': (arg: { uuid: string, type: string, params: Record<string, unknown>}) => number
  'main.CoreLoader:setTaskParams': (arg: { uuid: string, task_id: number, params: Record<string, unknown> }) => boolean
  'main.CoreLoader:start': (arg: { uuid: string }) => boolean
  'main.CoreLoader:stop': (arg: { uuid: string }) => boolean
  'main.CoreLoader:supportedStages': () => string[]
  'main.CoreLoader:changeTouchMode': (arg: { mode: TouchMode }) => boolean
  'main.CoreLoader:asyncScreencap': (arg: { uuid: string }) => number | boolean
  // WARN: 该方法尚未实现
  'main.CoreLoader:getScreencap': (arg: { uuid: string }) => Promise<{ screenshot: string }>
}

type IpcMainHandleEventType = IpcMainHandleEventType__AutoRegister & {
  'main.CoreLoader:load': () => boolean
  'main.CoreLoader:dispose': () => void
  // 'main.CoreLoader:getCorePath'
  'main.CoreLoader:getCoreVersion': () => string | null
  'main.CoreLoader:upgrade': () => Promise<void>

  'main.ScheduleRunner:shutdown': (arg: { option: 'shutdownEmulator' | 'shutdownAll' | 'shutdownComputer', pid: string }) => Promise<void>
  'main.ComponentManager:getStatus': (componentName: ComponentType) => Promise<ComponentStatus | undefined>
  'main.ComponentManager:install': (componentName: ComponentType) => Promise<void>
  'main.DeviceDetector:getAdbPath': () => string
  'main.DeviceDetector:getAdbDevices': () => Promise<Device[]>
  'main.DeviceDetector:getEmulators': () => Promise<Emulator[]>
  'main.DeviceDetector:getDeviceUuid': (address: string, adbPath?: string) => Promise<string | false>
  'main.DeviceDetector:startEmulator': (path: string) => Promise<void>
  'main.DeviceDetector:startEmulator2': (path: string) => Promise<void>
  'main.DeviceDetector:isDefaultAdbExists': () => boolean
  'main.Util:getOsArch': () => Api.Maa.Arch
  'main.Util:getOsPlatform': () => Api.Maa.Platform
  'main.Util:getAppPath': () => boolean
  'main.Util:getUiVersion': () => string
  'main.Util:getSystemInformation': () => Promise<Systeminformation.StaticData>
  'main.Util:getSystemStatus': () => boolean
  'main.Util:LogSilly': (...params: any[]) => void
  'main.Util:LogDebug': (...params: any[]) => void
  'main.Util:LogTrace': (...params: any[]) => void
  'main.Util:LogInfo': (...params: any[]) => void
  'main.Util:LogWarn': (...params: any[]) => void
  'main.Util:LogError': (...params: any[]) => void
  'main.Util:LogFatal': (...params: any[]) => void
  'main.Util:CleanLogs': () => void
  'main.Util:CleanDownloadCache': () => void
  'main.Util:RemoveAllConfig': () => void
  'main.Util:GetCacheInfo': () => { log: number, download: number }
  'main.Util:openFolder': (type: 'core' | 'ui-log' | 'core-log') => void
  'main.Util:restart': () => void
  'main.Task:readInfrastConfig': (args: { filepath: string }) => string
  'main.StorageManager:get': (key: string) => any
  'main.StorageManager:set': (key: string, val: any) => boolean
  'main.StorageManager:has': (key: string) => boolean
  'main.AppearanceManager:themeUpdated': (isDark: boolean) => void
  'main.WindowManager:toggleMaximized': () => boolean | Error
  'main.WindowManager:minimize': () => boolean
  'main.WindowManager:isMaximized': () => boolean
  'main.WindowManager:openDialog': (title: string, properties: DialogProperty[], filters: Electron.FileFilter[]) => Promise<Electron.OpenDialogReturnValue>
  'main.WindowManager:loaded': () => void
}

// 通过ipcMainHandle定义的事件名称
type IpcMainHandleEvent = keyof IpcMainHandleEventType

type IpcMainOnEventType = {
  'main.WindowManager:closeWindow': () => void
}

// 通过send调用的事件
type IpcMainOnEvent = keyof IpcMainOnEventType

/* ********* */

type IpcRendererOnEventType = {
  'renderer.WindowManager:updateMaximized': (isMaximized: boolean) => void
  'renderer.WindowManager:loaded': () => void
  'renderer.WindowManager:showMessage': (arg: { message: string, options: MessageOptions }) => void
  'renderer.CoreLoader:callback': (arg: Callback) => void
  'renderer.DeviceDetector:searched': (devices: NativeDevice[]) => void
  'renderer.DeviceDetector:changeStatus': (uuid: string, status: DeviceStatus) => void
  'renderer.AppearanceManager:systemThemeUpdated': (theme: 'maa-dark' | 'maa-light') => void
  // 'renderer.DownloadModal:updateStatus': () => void
  'renderer.ComponentManager:updateStatus': (arg: { type: ComponentType, status: InstallerStatus, progress: number }) => void
  'renderer.ComponentManager:installInterrupted': (arg: { type: ComponentType, status: 'exception', progress: 0 }) => void
  'renderer.ComponentManager:installDone': (arg: { type: ComponentType, status: InstallerStatus, progress: 0 }) => void
  'renderer.ComponentManager:downloadUpgradeDone': (arg: { type: ComponentType, status: InstallerStatus, progress: 0 }) => void
  'renderer.Device:getScreenshot': (arg: { uuid: string }) => void
}

// 通过ipcRenderer.on定义的事件名称
type IpcRendererOnEvent = keyof IpcRendererOnEventType
