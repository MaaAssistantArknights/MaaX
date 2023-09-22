import useAsstHooks from './asst'
import useClearHooks from './clear'
import useOsHooks from './os'
import usePathHooks from './path'
import useShutdownHooks from './shutdown'
import useStorageHooks from './storage'
import useTaskHooks from './task'
import useVersionHooks from './version'

export default function useHooks(): void {
  useVersionHooks()
  useAsstHooks()
  useStorageHooks()
  useOsHooks()
  useShutdownHooks()
  useClearHooks()
  useTaskHooks()
  usePathHooks()
}
