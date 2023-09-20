import logger from '@/hooks/caller/logger'
import { showMessage } from '@/utils/message'
import { runStartEmulator } from '@/utils/task_runner'
import type { Device, DeviceStatus, NativeDevice } from '@type/device'
import type { MessageType } from 'naive-ui'
import { defineStore } from 'pinia'

export interface DeviceState {
  devices: Device[]
  lastUpdate: number | null
}

export interface DeviceAction {
  mergeSearchResult: (devices: NativeDevice[]) => Promise<void>
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
      const defaultAdbPath = await window.main.DeviceDetector.getAdbPath()
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

      // 更新神谕
      const updateWakeUpMessage = (content: string, type: MessageType, duration: number = 3000) => {
        wakeUpMessage.closable = true
        wakeUpMessage.content = content
        wakeUpMessage.type = type
        // 源码里貌似直接修改duration不会重新生成定时器，所以这里手动关闭
        duration &&
          setTimeout(() => {
            try {
              wakeUpMessage?.destroy?.()
            } catch (e) {}
          }, duration)
      }

      if (!origin.commandLine || origin.commandLine === '') {
        updateWakeUpMessage(
          `设备 ${origin.displayName as string} 未配置启动命令, 请手动刷新设备`,
          'warning'
        )
        return false
      }
      origin.status = 'connecting'
      window.main.DeviceDetector.startEmulator2(origin.commandLine)
      const timeout = timeoutGenerator()
      let device
      for (let i = 0; i < connectRetry; i++) {
        const to = timeout.next().value as number
        logger.info(`wait ${to}ms for emulator ${origin.displayName as string} start`)
        await new Promise(resolve => setTimeout(resolve, to))
        // FIXME: Emulator无法转换为Device
        const devices: Device[] = await window.main.DeviceDetector.getEmulators()
        device = devices.find(d => d.uuid === origin.uuid)
        if (device) {
          origin.status = 'available'
          origin.address = device.address
          origin.pid = device.pid
          origin.emulatorPath = device.emulatorPath
          origin.adbPath = device.adbPath
          origin.config = device.config
          origin.commandLine = device.commandLine
          updateWakeUpMessage(`设备 ${origin.displayName as string} 启动成功`, 'success')
          return true // start successfull
        }
      }
      // fail
      origin.status = 'unknown'
      origin.address = ''
      updateWakeUpMessage(`设备 ${origin.displayName as string} 启动失败`, 'error', 0)
      return false
    },
  },
})

export default useDeviceStore
