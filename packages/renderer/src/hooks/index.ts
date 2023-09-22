import type {
  IpcMainHandleEvent,
  IpcMainHandleEventProxy,
  IpcMainHandleEventType,
  IpcRendererOnEvent,
  IpcRendererOnEventType,
} from '@type/ipc'
import { createCalleeProxy, createCallerProxy } from '@type/ipc/utils'
import { ipcRenderer } from 'electron'

import useCallbackEvents from './events/callback'
import useComponentManagerEvents from './events/componentManager'
import useDeviceEvents from './events/devices'
import useThemeEvents from './events/theme'
import useUiHooks from './events/ui'

export function initHook(): void {
  useDeviceEvents()
  useThemeEvents()
  useCallbackEvents()
  useUiHooks()
  useComponentManagerEvents()
}

export function setupHookProxy() {
  window.main = createCallerProxy<IpcMainHandleEventType, 'main'>('main', (key, ...args) => {
    return window.ipcRenderer.invoke(key, ...args)
  })
  window.renderer = createCalleeProxy<
    IpcRendererOnEventType,
    'renderer',
    Electron.IpcRendererEvent
  >(
    'renderer',
    (key, func) => {
      window.ipcRenderer.on(key, func)
    },
    key => {
      window.ipcRenderer.offAll(key)
    },
    (key, func) => {
      window.ipcRenderer.off(key, func)
    }
  )
}
