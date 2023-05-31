import { openFolder } from '@main/utils/path'

export default function usePathHooks(): void {
  globalThis.main.Util.openFolder = openFolder
}
