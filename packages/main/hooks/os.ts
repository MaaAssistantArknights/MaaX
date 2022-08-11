import { ipcMainHandle } from '@main/utils/ipc-main'
import { getArch, getPlatform, getSystemInformation, getSystemStatus } from '@main/utils/os'

export default function useOsHooks (): void {
  ipcMainHandle('main.Util:getOsArch', async (event) => getArch())
  ipcMainHandle('main.Util:getOsPlatform', async (event) => getPlatform())
  ipcMainHandle('main.Util:getSystemInformation', async (event) => await getSystemInformation())
  ipcMainHandle('main.Util:getSystemStatus', async (event) => await getSystemStatus())
}
