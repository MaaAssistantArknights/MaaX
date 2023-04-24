import { ipcMainHandle } from '@main/utils/ipc-main'
import { openFolder } from '@main/utils/path'

export default function usePathHooks (): void {
  ipcMainHandle('main.Util:openFolder', async (event, type) => openFolder(type))
}
