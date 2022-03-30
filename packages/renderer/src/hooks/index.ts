import useCallbackEvents from './events/callback'
import useDeviceEvents from './events/devices'
import useTaskEvents from './events/tasks'
import useThemeEvents from './events/theme'
import useUiHooks from './events/ui'

export function initHook () {
  useDeviceEvents()
  useTaskEvents()
  useThemeEvents()
  useCallbackEvents()
  useUiHooks()
}
