import useLoggerHooks from './logger'
import useVersionHooks from './version'
import useEmulatorHooks from './emulator'
import useAsstHooks from './asst'
import useStorageHooks from './storage'
import useOsHooks from './os'
import usePathHooks from './path'
import useUnzipHooks from './unzip'

import { registerComponentManager } from '@main/componentManager'

export default function useHooks (): void {
  useLoggerHooks()
  useVersionHooks()
  useEmulatorHooks()
  useAsstHooks()
  useStorageHooks()
  useOsHooks()
  usePathHooks()
  useUnzipHooks()
  registerComponentManager()
}
