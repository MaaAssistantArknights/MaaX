import { $ } from '@main/utils/shell'
import { is } from 'electron-util'
import WindowManager from '@main/windowManager'
import logger from '@main/utils/logger'
import { ipcMainHandle } from '@main/utils/ipc-main'

async function shutdownEmulator (pid: string): Promise<void> {
  logger.debug('Shutdown Emulator')

  if (is.windows) {
    await $`taskkill /pid ${pid} /f`
  } else if (is.linux) {
    await $`kill -9 ${pid}` // TODO: 未测试
  } else if (is.macos) {
    await $`kill -9 ${pid}` // TODO: 未测试
  }
}

async function shutdownMAA (): Promise<void> {
  logger.debug('Shutdown MAA')

  const win = new WindowManager().getWindow()
  win.close()
}

async function shutdownComputer (): Promise<void> {
  logger.debug('Shutdown MAA')

  if (is.windows) {
    $`shutdown -s -t 60`
  } else if (is.linux) {
    $`shutdown -h -t 60` // TODO: 未测试
  } else {
    $`shutdown -h -t 60` // TODO: 未测试
  }
}

export default function useShutdownHooks (): void {
  ipcMainHandle('main.ScheduleRunner:shutdown', async (event, arg) => {
    if (arg.option === 'shutdownEmulator') {
      await shutdownEmulator(arg.pid)
    } else if (arg.option === 'shutdownAll') {
      await shutdownEmulator(arg.pid)
      await shutdownMAA()
    } else if (arg.option === 'shutdownComputer') {
      await shutdownComputer()
    }
  })
}
