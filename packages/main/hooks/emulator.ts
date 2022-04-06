import { ipcMain } from 'electron'
import { execFile } from 'child_process'
import { getEmulators, getDeviceUuid } from '@main/core/emulator'

export default function useEmulatorHooks (): void {
  ipcMain.handle('asst:getEmulators', async (event): Promise<Emulator[]> => {
    return await getEmulators()
  })
  ipcMain.handle(
    'asst:getDeviceUuid',
    async (event, arg): Promise<string | boolean> => {
      // const ret = getDeviceUuid(arg.address, arg.adb_path)
      const ret = await getDeviceUuid()
      console.log(ret)
      return ret
    }
  )

  ipcMain.handle('asst:startEmulator', async (event, arg) => {
    console.log(arg)
    execFile(
      arg.emulator_path,
      [arg.arg],
      (err: any, stdout: string, stderr: string) => {
        if (err) {
          console.log(err)
          return
        }

        console.log(`startEmu stdout:${stdout}`)
        console.log(`startEmu stderr:${stderr}`)
      }
    )
  })
}
