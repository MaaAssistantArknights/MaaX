import { ipcMainHandle } from '@main/utils/ipc-main'
import { updateUA, updatePenguinUA } from '@main/utils/ua'

export default function useUAHooks() {
  ipcMainHandle('main.Util:updateUA', (event, args) => {
    updateUA(args.urls, args.UA)
  })
  ipcMainHandle('main.Util:updatePenguinUA', (event, args) => {
    updatePenguinUA(args.UA)
  })
}
