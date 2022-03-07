import useDeviceStore from "@/store/devices";
import useTaskStore from "@/store/tasks";
import useThemeStore from "@/store/theme";

export function initHook() {
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

  const taskStore = useTaskStore();
  window.ipcRenderer.on(
    "task:updateStatus",
    (
      event,
      uuid: string,
      taskId: string,
      status: TaskStatus,
      progress: number
    ) => {
      taskStore.updateTaskStatus(uuid, taskId, status, progress);
    }
  );

  const themeStore = useThemeStore();
  window.ipcRenderer.on("theme:update", (_, updatedTheme) => {
    themeStore.updateTheme(updatedTheme);
  });

  // Connect hooks:
  console.log('add connect hook!');
  window.ipcRenderer.on("device:connectInfo", (event, arg) => {
    console.log('ipcRender connectInfo');
    
    //const connectMessage = message.info()
    switch (arg.what) {
      case "UuidGetted": {
        //message.success(`${arg.uuid}已连接`);
        deviceStore.updateDeviceUuid(arg.address,arg.uuid);
        deviceStore.updateDeviceStatus(arg.uuid,"connected");
        window.ipcRenderer.sendSync("asst:setUUID", { address: arg.address, uuid: arg.uuid });
      }
    }
  });

}
