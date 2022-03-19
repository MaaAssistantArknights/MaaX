import useDeviceStore from "@/store/devices";

export default function useDeviceEvents() {
  const deviceStore = useDeviceStore();

  window.ipcRenderer.on("device:searched", (event, devices: NativeDevice[]) => {
    deviceStore.mergeSearchResult(devices);
  });

  window.ipcRenderer.on(
    "device:change_status",
    (event, uuid: string, status: DeviceStatus) => {
      deviceStore.updateDeviceStatus(uuid, status);
    }
  );
}