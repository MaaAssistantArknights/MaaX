import logger from '@main/utils/logger'
import { getPlatform } from '@main/utils/os'
import { $ } from '@main/utils/shell'
import WindowManager from '@main/windowManager'

async function shutdownEmulator(pid: string): Promise<void> {
  logger.silly('Shutdown Emulator')
  const platform = getPlatform()

  if (platform === 'windows') {
    await $`taskkill /pid ${pid} /f`
  } else if (platform === 'linux') {
    await $`kill -9 ${pid}` // TODO: 未测试
  } else if (platform === 'macos') {
    await $`kill -9 ${pid}` // TODO: 未测试
  }
}

async function shutdownMAA(): Promise<void> {
  logger.silly('Shutdown MAA')

  const win = new WindowManager().getWindow()
  win.close()
}

async function shutdownComputer(): Promise<void> {
  logger.silly('Shutdown MAA')
  const platform = getPlatform()

  if (platform === 'windows') {
    $`shutdown -s -t 60`
  } else if (platform === 'linux') {
    $`shutdown -h -t 60` // TODO: 未测试
  } else {
    $`shutdown -h -t 60` // TODO: 未测试
  }
}

export default function useShutdownHooks(): void {
  globalThis.main.ScheduleRunner.shutdown = async ({ option, pid }) => {
    if (option === 'shutdownEmulator') {
      await shutdownEmulator(pid)
    } else if (option === 'shutdownAll') {
      await shutdownEmulator(pid)
      await shutdownMAA()
    } else if (option === 'shutdownComputer') {
      await shutdownComputer()
    }
  }
}
