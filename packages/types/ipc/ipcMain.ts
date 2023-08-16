import type { Systeminformation } from 'systeminformation'
import type { Arch, Platform } from '@type/api/maa'
import type { ComponentType, ComponentStatus } from '@type/componentManager'
import type { DialogProperty, TouchMode } from '@type/misc'
import type { Device, Emulator } from '@type/device'
import type { ResourceType } from '@type/game'
import type { CalleeProxyObjectType, CallerProxyObjectType } from './utils'

export interface InitCoreParam {
  address: string
  uuid: string
  adb_path: string
  config: string
  touch_mode: TouchMode
}

export type IpcMainHandleEventTypeAutoRegister = {
  'main.CoreLoader:loadResource': (arg: { path: string }) => boolean
  'main.CoreLoader:getImage': (arg: { uuid: string }) => string
  'main.CoreLoader:getLibPath': () => string
  'main.CoreLoader:create': () => boolean
  'main.CoreLoader:createEx': (arg: { address: string }) => boolean
  'main.CoreLoader:destroy': (arg: { uuid: string }) => boolean
  'main.CoreLoader:connect': (arg: {
    address: string
    uuid: string
    adb_path: string
    config: string
  }) => boolean
  'main.CoreLoader:initCore': (arg: InitCoreParam) => boolean
  'main.CoreLoader:initCoreAsync': (arg: InitCoreParam) => void
  'main.CoreLoader:disconnectAndDestroy': (arg: { uuid: string }) => boolean
  'main.CoreLoader:appendTask': (arg: {
    uuid: string
    type: string
    params: Record<string, unknown>
  }) => number
  'main.CoreLoader:setTaskParams': (arg: {
    uuid: string
    task_id: number
    params: Record<string, unknown>
  }) => boolean
  'main.CoreLoader:start': (arg: { uuid: string }) => boolean
  'main.CoreLoader:stop': (arg: { uuid: string }) => boolean
  'main.CoreLoader:supportedStages': () => string[]
  'main.CoreLoader:changeTouchMode': (arg: { mode: TouchMode }) => boolean
  'main.CoreLoader:asyncScreencap': (arg: { uuid: string }) => void
  'main.CoreLoader:isCoreInited': (arg: { uuid: string }) => boolean
}

export type IpcMainHandleEventType = IpcMainHandleEventTypeAutoRegister & {
  'main.CoreLoader:load': () => boolean
  'main.CoreLoader:dispose': () => void
  // 'main.CoreLoader:getCorePath'
  'main.CoreLoader:getCoreVersion': () => string | null
  'main.CoreLoader:upgrade': () => Promise<void>
  'main.CoreLoader:updateTaskJson': (arg: { type: ResourceType; data: string }) => Promise<void>
  'main.ScheduleRunner:shutdown': (arg: {
    option: 'shutdownEmulator' | 'shutdownAll' | 'shutdownComputer'
    pid: string
  }) => Promise<void>
  'main.ComponentManager:getStatus': (
    componentName: ComponentType
  ) => Promise<ComponentStatus | undefined>
  'main.ComponentManager:install': (componentName: ComponentType) => Promise<void>
  'main.ComponentManager:upgrade': (componentName: ComponentType) => Promise<void>
  'main.ComponentManager:getAvailableMirrors': (componentName: ComponentType) => Promise<string[]>
  'main.DeviceDetector:getAdbPath': () => string
  'main.DeviceDetector:getAdbDevices': () => Promise<Device[]>
  'main.DeviceDetector:getEmulators': () => Promise<Emulator[]>
  'main.DeviceDetector:getDeviceUuid': (
    address: string,
    adbPath?: string
  ) => Promise<string | false>
  'main.DeviceDetector:startEmulator': (path: string) => Promise<void>
  'main.DeviceDetector:startEmulator2': (path: string) => Promise<void>
  'main.DeviceDetector:isDefaultAdbExists': () => boolean
  'main.Util:getOsArch': () => Arch
  'main.Util:getOsPlatform': () => Platform
  'main.Util:getAppPath': () => boolean
  'main.Util:getUiVersion': () => string
  'main.Util:getSystemInformation': () => Promise<Systeminformation.StaticData>
  'main.Util:getSystemStatus': () => boolean
  'main.Util:generateIdempotentKey': () => string
  'main.Util:isInDev': () => boolean
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
  'main.Util:GetCacheInfo': () => { log: number; download: number }
  'main.Util:openFolder': (type: 'core' | 'ui-log' | 'core-log') => void
  'main.Util:restart': () => void
  'main.Util:openExternal': (url: string) => void
  'main.Util:saveTempJson': (data: string) => string
  'main.Task:readInfrastConfig': (args: { filepath: string }) => string
  'main.StorageManager:get': (key: string) => any
  'main.StorageManager:set': (key: string, val: any) => boolean
  'main.StorageManager:has': (key: string) => boolean
  'main.AppearanceManager:themeUpdated': (isDark: boolean) => void
  'main.AppearanceManager:acrylicUpdated': (isAcrylic: boolean) => void
  'main.WindowManager:toggleMaximized': () => boolean | Error
  'main.WindowManager:minimize': () => boolean
  'main.WindowManager:isMaximized': () => boolean
  'main.WindowManager:openDialog': (
    title: string,
    properties: DialogProperty[],
    filters: Electron.FileFilter[]
  ) => Promise<Electron.OpenDialogReturnValue>
  'main.WindowManager:loaded': () => void
}

// 通过ipcMainHandle定义的事件名称
export type IpcMainHandleEvent = keyof IpcMainHandleEventType
export type IpcMainHandleEventProxy = CallerProxyObjectType<IpcMainHandleEventType, 'main'>
export type IpcMainHandleEventCalleeProxy = CalleeProxyObjectType<
  IpcMainHandleEventType,
  'main',
  Electron.IpcMainInvokeEvent
>
