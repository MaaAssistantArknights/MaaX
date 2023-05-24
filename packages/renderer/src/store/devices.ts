import { defineStore } from 'pinia'
import logger from '@/hooks/caller/logger'
import { runStartEmulator } from '@/utils/task_runner'
import { showMessage } from '@/utils/message'
import type { Device, NativeDevice, DeviceStatus } from '@type/device'

export interface DeviceState {
  devices: Device[]
  lastUpdate: number | null
}

export interface DeviceAction {
  mergeSearchResult: (devices: NativeDevice[]) => void
  updateDeviceStatus: (uuid: string, status: DeviceStatus) => void
  removeNotInUseDevice: () => void
  updateDeviceUuid: (oldUuid: string, newUuid: string) => void
  updateDeviceDisplayName: (uuid: string, displayName: string) => void
  updateCommandLine: (uuid: string, commandLine: string) => void
  getDevice: (uuid: string) => Device | undefined
  deleteDevice: (uuid: string) => void
  wakeUpDevice: (uuid: string) => Promise<boolean>
}

const useDeviceStore = defineStore<'device', DeviceState, {}, DeviceAction>('device', {
  state: () => {
    return {
      devices: [],
      lastUpdate: null,
    }
  },
  actions: {
    async mergeSearchResult(devices) {
      const defaultAdbPath = await window.ipcRenderer.invoke('main.DeviceDetector:getAdbPath')
      this.lastUpdate = Date.now()
      for (const device of devices) {
        const origin = this.devices.find(dev => dev.uuid === device.uuid)
        if (origin == null) {
          // 不存在该设备，则添加
          this.devices.push({
            status: 'available',
            config: 'General',
            adbPath: defaultAdbPath,
            ...device,
          })
        } else if (['disconnected', 'unknown', 'available'].includes(origin.status)) {
          // 曾今连过，更新
          logger.debug(`uuid ${origin.uuid}  origin status: ${origin.status}`)
          origin.status = 'available'
          origin.pid = device.pid
          origin.adbPath = device.adbPath ?? defaultAdbPath
          origin.address = device.address
          // origin.displayName = device.displayName
          origin.commandLine = device.commandLine
        }
      }
    },
    updateDeviceStatus(uuid, status) {
      const origin = this.devices.find(dev => dev.uuid === uuid)
      if (origin != null) {
        logger.info('change device status', origin.uuid, origin.status, '->', status)
        origin.status = status
      }
    },
    removeNotInUseDevice() {
      this.devices.forEach(v => (v.status = 'connected'))
    },
    updateDeviceUuid(oldUuid, newUuid) {
      console.log(`old uuid: ${oldUuid}`)
      const origin = this.devices.find(dev => dev.uuid === oldUuid)
      console.log(`new uuid: ${newUuid}`)
      if (origin != null) {
        origin.uuid = newUuid
      }
    },
    updateDeviceDisplayName(uuid, displayName) {
      const origin = this.devices.find(dev => dev.uuid === uuid)
      if (origin != null) {
        if (displayName === '') {
          displayName = origin.uuid // 如果为空，则使用uuid
        }
        origin.displayName = displayName
      }
    },
    updateCommandLine(uuid, commandLine) {
      const origin = this.devices.find(dev => dev.uuid === uuid)
      if (origin != null) {
        origin.commandLine = commandLine
      }
    },
    deleteDevice(uuid) {
      const index = this.devices.findIndex(d => d.uuid === uuid)
      this.devices.splice(index, 1)
    },
    getDevice(uuid) {
      return this.devices.find(dev => dev.uuid === uuid)
    },
    async wakeUpDevice(uuid) {
      // try wake up emulator by start command line
      const origin = this.devices.find(dev => dev.uuid === uuid)
      const connectRetry = 3
      const retryTimeout = 8000

      function* timeoutGenerator(timeout: number = retryTimeout): Generator<number, void, unknown> {
        yield timeout
        timeout *= 2 // 8s 16s 32s 一分钟还不能启动的模拟器建议卸载(
        // TODO 寻思超时时间设置后面可以拉到一个配置里去
      }

      if (!origin) return false
      const wakeUpMessage = showMessage(`正在尝试启动设备 ${origin.displayName as string}`, {
        type: 'loading',
        duration: 0,
      })

      if (!origin.commandLine || origin.commandLine === '') {
        wakeUpMessage.content = `设备 ${
          origin.displayName as string
        } 未配置启动命令, 请手动刷新设备`
        wakeUpMessage.type = 'warning'
        wakeUpMessage.duration = 3000
        wakeUpMessage.closable = true
        return false
      }
      origin.status = 'connecting'
      window.ipcRenderer.invoke('main.DeviceDetector:startEmulator2', origin.commandLine)
      const timeout = timeoutGenerator()
      let device
      for (let i = 0; i < connectRetry; i++) {
        const to = timeout.next().value as number
        logger.info(`wait ${to}ms for emulator ${origin.displayName as string} start`)
        await new Promise(resolve => setTimeout(resolve, to))
        // FIXME: Emulator无法转换为Device
        const devices: Device[] = await window.ipcRenderer.invoke(
          'main.DeviceDetector:getEmulators'
        )
        device = devices.find(d => d.uuid === origin.uuid)
        if (device) {
          origin.status = 'available'
          origin.address = device.address
          origin.pid = device.pid
          origin.emulatorPath = device.emulatorPath
          origin.adbPath = device.adbPath
          origin.config = device.config
          origin.commandLine = device.commandLine

          wakeUpMessage.content = `设备 ${origin.displayName as string} 启动成功`
          wakeUpMessage.type = 'success'
          wakeUpMessage.duration = 3000
          wakeUpMessage.closable = true
          return true // start successfull
        }
      }
      // fail
      origin.status = 'unknown'
      origin.address = ''
      wakeUpMessage.content = `设备 ${origin.displayName as string} 启动失败`
      wakeUpMessage.type = 'error'
      wakeUpMessage.closable = true
      return false
    },
  },
})

export default useDeviceStore
