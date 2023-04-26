import useDeviceStore from '@/store/devices'

export default function useDeviceEvents(): void {
  const deviceStore = useDeviceStore()

  window.ipcRenderer.on(
    'renderer.DeviceDetector:searched',
    (event, devices: NativeDevice[]) => {
      deviceStore.mergeSearchResult(devices)
    }
  )

  window.ipcRenderer.on(
    'renderer.DeviceDetector:changeStatus',
    (event, uuid: string, status: DeviceStatus) => {
      deviceStore.updateDeviceStatus(uuid, status)
    }
  )
}
