import { ipcMainHandle } from '@main/utils/ipc-main'
import { getArch, getPlatform, getSystemInformation } from '@main/utils/os'

export default function useOsHooks (): void {
  ipcMainHandle('main.Util:getOsArch', (event) => getArch())
  ipcMainHandle('main.Util:getOsPlatform', (event) => getPlatform())
  ipcMainHandle('main.Util:getSystemInformation', (event) => getSystemInformation())
}