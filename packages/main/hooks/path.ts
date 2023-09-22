import { moveComponentBaseDir } from '@main/componentManager/utils/path'
import { openExternal, openFolder, saveTempJson } from '@main/utils/path'

export default function usePathHooks(): void {
  globalThis.main.Util = {
    openFolder,
    openExternal,
    saveTempJson,
    moveComponentBaseDir,
  }
}
