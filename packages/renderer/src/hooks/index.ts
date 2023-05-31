import type {
  IpcMainHandleEvent,
  IpcMainHandleEventProxy,
  IpcMainHandleEventType,
  IpcRendererOnEvent,
  IpcRendererOnEventType,
} from '@type/ipc'
import useCallbackEvents from './events/callback'
import useComponentManagerEvents from './events/componentManager'
import useDeviceEvents from './events/devices'
import useThemeEvents from './events/theme'
import useUiHooks from './events/ui'
import { ipcRenderer } from 'electron'
import { createCalleeProxy, createCallerProxy } from '@type/ipc/utils'

export function initHook(): void {
  useDeviceEvents()
  useThemeEvents()
  useCallbackEvents()
  useUiHooks()
  useComponentManagerEvents()
}

export function setupHookProxy() {
  window.main = createCallerProxy<IpcMainHandleEventType, 'main'>('main', (key, ...args) => {
    window.ipcRenderer.invoke(key, ...args)
  })
  window.renderer = createCalleeProxy<IpcRendererOnEventType, 'renderer'>(
    'renderer',
    (key, func) => {
      window.ipcRenderer.on(key, func)
    },
    key => {
      window.ipcRenderer.removeAllListeners(key)
    }
  )
}
