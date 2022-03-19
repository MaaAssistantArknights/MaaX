import useDeviceStore from "@/store/devices";
import useTaskStore from "@/store/tasks";

enum CallbackMsg {
  /* Global Info */
  InternalError = "0", // 内部错误
  InitFailed = "1", // 初始化失败
  ConnectionInfo = "2", // 连接相关信息
  AllTasksCompleted = "3", // 全部任务完成
  /* TaskChain Info */
  TaskChainError = "10000", // 任务链执行/识别错误
  TaskChainStart = "10001", // 任务链开始
  TaskChainCompleted = "10002", // 任务链完成
  TaskChainExtraInfo = "10003", // 任务链额外信息
  /* SubTask Info */
  SubTaskError = "20000", // 原子任务执行/识别错误
  SubTaskStart = "20001", // 原子任务开始
  SubTaskCompleted = "20002", // 原子任务完成
  SubTaskExtraInfo = "20003", // 原子任务额外信息
  /* Task Info */
}

enum Connection {
  UuidGetted = "UuidGetted",
  ConnectFailed = "ConnectFailed",
}

enum StartUp{

}

export default function useCallbackEvents() {
  const deviceStore = useDeviceStore();
  const taskStore = useTaskStore();

  // 字面意思, 内部错误
  window.ipcRenderer.on(CallbackMsg.InternalError, (event, arg) => {});

  // 初始化失败
  window.ipcRenderer.on(CallbackMsg.InitFailed, (event, arg) => {});

  // 获取到UUID
  window.ipcRenderer.on(Connection.UuidGetted, async (event, arg) => {
    window.$message.success(`设备${arg.address}已连接`);
    deviceStore.updateDeviceUuid(arg.address, arg.uuid);
    deviceStore.updateDeviceStatus(arg.uuid, "connected");
    window.ipcRenderer.sendSync("asst:setUUID", {
      address: arg.address,
      uuid: arg.uuid,
    });
  });

  // 获取UUID失败
  window.ipcRenderer.on(Connection.ConnectFailed, async (event, arg) => {
    window.$message.error(
      `设备${arg.address}连接失败, 请尝试重启模拟器.\n如多次失败请在 GitHub 上进行反馈.`,
      { closable: true, duration: 0 }
    );
    window.ipcRenderer.sendSync("asst:destroy", { uuid: arg.address });
    deviceStore.updateDeviceStatus(arg.address, "unknown");
  });

  // 任务链开始
  window.ipcRenderer.on(CallbackMsg.TaskChainStart, async (event,arg)=>{
    taskStore.updateTaskStatus(arg.uuid, arg.task, "processing",0);
  });

  // 任务链完成
    window.ipcRenderer.on(CallbackMsg.TaskChainCompleted, async (event,arg)=>{
    console.log(arg);
    taskStore.updateTaskStatus(arg.uuid, arg.task, "success",100);
    window.$message.info(`taskchian ${arg.task} completed`);
  });
}
