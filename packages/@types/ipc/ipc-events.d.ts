// 通过ipcMain.handle定义的事件名称
type IpcMainHandleEvent =
  | 'coreLoader:getCorePath'
  | 'coreLoader:getCoreVersion'
  | 'coreLoader:loadResource'
  | 'coreLoader:create'
  | 'coreLoader:createEx'
  | 'coreLoader:destroy'
  | 'coreLoader:connect'
  | 'coreLoader:createExAndConnect'
  | 'coreLoader:disconnectAndDestroy'
  | 'coreLoader:appendTask'
  | 'coreLoader:setTaskParams'
  | 'coreLoader:start'
  | 'coreLoader:stop'
  | 'coreLoader:supportedStages'
  | 'coreLoader:load'
  | 'coreLoader:dispose'
  | 'componentManager:getStatus'
  | 'componentManager:install'
  | 'main.DeviceDetector:getAdbPath'
  | 'main.DeviceDetector:getAdbDevices'
  | 'main.DeviceDetector:getEmulators'
  // | 'main.deviceDetector:getDeviceUuid'
  | 'main.deviceDetector:startEmulator'
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

interface IpcMainEvent<T> {
  name: IpcMainHandleEvent
  listener: (event: import('electron').IpcMainInvokeEvent, ...args: any[]) => Promise<T> | T | undefined
}

interface IpcRendererEvent<T> {
  name: IpcRendererHandleEvent
  listener: (event: import('electron').IpcRendererEvent, ...args: any[]) => Promise<T> | T | undefined
}
