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

  window.ipcRenderer.on("device:connectInfo", (event, arg) => {
    console.log("ipcRender connectInfo");
    switch (arg.what) {
      case "UuidGetted": {
        window.$message.success(`设备${arg.address}已连接`);
        deviceStore.updateDeviceUuid(arg.address, arg.uuid);
        deviceStore.updateDeviceStatus(arg.uuid, "connected");
        window.ipcRenderer.sendSync("asst:setUUID", {
          address: arg.address,
          uuid: arg.uuid,
        });
        break;
      }
      case "ConnectFailed": {
        window.$message.error(
          `设备${arg.address}连接失败, 请尝试重启模拟器.\n如多次失败请在 GitHub 上进行反馈.`,
          { closable: true, duration: 0 }
        );
        deviceStore.updateDeviceStatus(arg.address, "unknown");
        break;
      }
    }
  });
}