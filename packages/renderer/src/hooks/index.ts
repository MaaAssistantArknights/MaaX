import useCallbackEvents from './events/callback'
import useComponentManagerEvents from './events/componentManager'
import useDeviceEvents from './events/devices'
import useTaskEvents from './events/tasks'
import useThemeEvents from './events/theme'
import useUiHooks from './events/ui'

export function initHook (): void {
  useDeviceEvents()
  useTaskEvents()
  useThemeEvents()
  useCallbackEvents()
  useUiHooks()
  useComponentManagerEvents()
}
