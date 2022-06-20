// 通过ipcMainHandle定义的事件名称
type IpcMainHandleEvent =
  | 'main.CoreLoader:load'
  | 'main.CoreLoader:dispose'
  | 'main.CoreLoader:getCorePath'
  | 'main.CoreLoader:getCoreVersion'
  | 'main.CoreLoader:loadResource'
  | 'main.CoreLoader:create'
  | 'main.CoreLoader:createEx'
  | 'main.CoreLoader:destroy'
  | 'main.CoreLoader:connect'
  | 'main.CoreLoader:createExAndConnect'
  | 'main.CoreLoader:disconnectAndDestroy'
  | 'main.CoreLoader:appendTask'
  | 'main.CoreLoader:setTaskParams'
  | 'main.CoreLoader:start'
  | 'main.CoreLoader:stop'
  | 'main.CoreLoader:supportedStages'
  | 'main.ScheduleRunner:shutdown'
  | 'main.componentManager:getStatus'
  | 'main.componentManager:install'
  | 'main.DeviceDetector:getAdbPath'
  | 'main.DeviceDetector:getAdbDevices'
  | 'main.DeviceDetector:getEmulators'
  | 'main.deviceDetector:getDeviceUuid'
  | 'main.DeviceDetector:startEmulator'
  | 'main.Util:getOsArch'
  | 'main.Util:getOsPlatform'
  | 'main.Util:getAppPath'
  | 'main.Util:getUiVersion'
  | 'main.StorageManager:get'
  | 'main.StorageManager:set'
  | 'main.StorageManager:has'
  | 'main.WindowManager:closeWindow'
  | 'main.WindowManager:toggleMaximized'
  | 'main.WindowManager:minimize'
  | 'main.WindowManager:isMaximized'
  | 'main.WindowManager:openDialog'
  | 'main.WindowManager:loaded'

// 通过ipcRenderer.on定义的事件名称
type IpcRendererHandleEvent =
  | 'renderer.WindowManager:updateMaximized'
  | 'renderer.WindowManager:loaded'
  | 'renderer.WindowManager:showMessage'
  | 'renderer.CoreLoader:callback'
  | 'renderer.DeviceDetector:searched'
  | 'renderer.DeviceDetector:changeStatus'
  | 'renderer.TaskManager:changeStatus'
  | 'renderer.AppearanceManager:themeUpdated'

interface IpcMainEvent<T> {
  name: IpcMainHandleEvent
  listener: (event: import('electron').IpcMainInvokeEvent, ...args: any[]) => Promise<T> | T | undefined
}

interface IpcRendererEvent<T> {
  name: IpcRendererHandleEvent
  listener: (event: import('electron').IpcRendererEvent, ...args: any[]) => Promise<T> | T | undefined
}
