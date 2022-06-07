// 通过ipcMain.handle定义的事件名称
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
  | 'componentManager:getStatus'
  | 'componentManager:install'
  | 'main.DeviceDetector:getAdbPath'
  | 'main.DeviceDetector:getAdbDevices'
  | 'main.DeviceDetector:getEmulators'
  // | 'main.deviceDetector:getDeviceUuid'
  | 'main.DeviceDetector:startEmulator'
  | 'logger:log'
  | 'logger:silly'
  | 'logger:debug'
  | 'logger:verbose'
  | 'logger:info'
  | 'logger:warn'
  | 'logger:error'
  | 'util:getOsArch'
  | 'util:getOsPlatform'
  | 'util:getAppPath'
  | 'util:getUiVersion'
  | 'storageManager:get'
  | 'storageManager:set'
  | 'storageManager:has'
  | 'windowManager:closeWindow'
  | 'windowManager:toggleMaximized'
  | 'windowManager:minimize'
  | 'windowManager:isMaximized'

// 通过ipcRenderer.on定义的事件名称
type IpcRendererHandleEvent =
  | 'windowManager:updateMaximized'
  | 'ui:message'
  | 'renderer.CoreLoader:callback'

interface IpcMainEvent<T> {
  name: IpcMainHandleEvent
  listener: (event: import('electron').IpcMainInvokeEvent, ...args: any[]) => Promise<T> | T | undefined
}

interface IpcRendererEvent<T> {
  name: IpcRendererHandleEvent
  listener: (event: import('electron').IpcRendererEvent, ...args: any[]) => Promise<T> | T | undefined
}
