import { defineStore } from 'pinia'
const logger = console

export interface DeviceState {
  devices: Device[]
  lastUpdate: number | null
}

export interface DeviceAction {
  mergeSearchResult: (devices: NativeDevice[]) => void
  updateDeviceStatus: (uuid: string, status: DeviceStatus) => void
  removeNotInUseDevice: () => void
  updateDeviceUuid: (oldUuid: string, newUuid: string) => void
  getDevice: (uuid: string) => Device | undefined
  deleteDevice: (uuid: string) => void
}

const useDeviceStore = defineStore<'device', DeviceState, {}, DeviceAction>(
  'device',
  {
    state: () => {
      return {
        devices: [],
        lastUpdate: null
      }
    },
    actions: {
      async mergeSearchResult (devices) {
        const defaultAdbPath = await window.ipcRenderer.invoke('main.DeviceDetector:getAdbPath')
        this.lastUpdate = Date.now()
        for (const device of devices) {
          const origin = this.devices.find((dev) => dev.uuid === device.uuid)
          if (origin == null) { // 不存在该设备，则添加
            this.devices.push({
              status: 'available',
              config: 'General',
              adbPath: defaultAdbPath,
              ...device
            }) // TODO: 对于曾连过设备的合并，要改改，比如先删掉原来的，然后再push？
          } else if (['disconnected', 'unknown'].includes(origin.status)) { // 曾今连过，更新
            logger.debug(`uuid ${origin.uuid}  origin status: ${origin.status}`)
            origin.status = 'available'
            origin.pid = device.pid
            origin.adbPath = device.adbPath ?? defaultAdbPath
            origin.connectionString = device.connectionString
            // origin.displayName = device.displayName
            origin.commandLine = device.commandLine
          }
        }
      },
      updateDeviceStatus (uuid, status) {
        const origin = this.devices.find((dev) => dev.uuid === uuid)
        if (origin != null) {
          origin.status = status
        }
      },
      removeNotInUseDevice () {
        this.devices.forEach((v) => (v.status = 'connected'))
      },
      updateDeviceUuid (oldUuid, newUuid) {
        console.log(`old uuid: ${oldUuid}`)
        const origin = this.devices.find((dev) => dev.uuid === oldUuid)
        console.log(`new uuid: ${newUuid}`)
        if (origin != null) {
          origin.uuid = newUuid
        }
      },
      deleteDevice (uuid) {
        const index = this.devices.findIndex(d => d.uuid === uuid)
        this.devices.splice(index, 1)
      },
      getDevice (uuid) {
        return this.devices.find((dev) => dev.uuid === uuid)
      }
    }
  }
)

export default useDeviceStore
