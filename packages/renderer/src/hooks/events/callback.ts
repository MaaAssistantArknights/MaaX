import useDeviceStore from "@/store/devices";
import useTaskStore from "@/store/tasks";
import { parseInt } from "lodash";

// 抄! https://github.com/MaaAssistantArknights/MaaAssistantArknights/blob/master/src/MeoAsstGui/Helper/AsstProxy.cs
// cb https://github.com/MaaAssistantArknights/MaaAssistantArknights/blob/dev/docs/%E5%9B%9E%E8%B0%83%E6%B6%88%E6%81%AF%E5%8D%8F%E8%AE%AE.md

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

const startUpProcess = [
  "StartUp:Start:StartUp",
  "StartUp:Start:GameStart",
  "StartUp:Start:StartToWakeUp",
  "StartUp:Start:Terminal",
  "StartUp:Start:CloseAnno",
  "StartUp:Start:TodaysSupplies",
  "StartUp:Start:ReturnToTerminal",
  "StartUp:Start:OfflineConfirm",
];
enum StartUp {}

enum Fight {
  SubFightStart = "Fight:Start:StartButton2",
  MedicineConfirm = "Fight:Start:MedicineConfirm",
  StoneConfrim = "Fight:Start:StoneConfrim",
}

enum Recriut {

  Refresh = "Recruit:Completed:RecruitRefreshConfirm",
  Confirm = "Recruit:Completed:RecruitConfirm",

  TagsDetected = "Recruit:Extra:RecruitTagsDetected", // 检测到词条

  SpecialTagsDetected = "Recruit:Extra:RecruitSpecialTag", // 检测到特殊词条

  Result = "Recruit:RecruitResult", // 公招结果

  TagsSelected = "Recruit:Extra:RecruitTagsSelected", // 选择词条
}

enum Infrast {
  OperatorConflict = "Infrast:InfrastDormDoubleConfirmButton", // 干员冲突

  EnterFacility = "Infrast:Extra:EnterFacility", // 进入设施

  NotEnoughStaff = "Infrast:NotEnoughStaff", // 可用干员不足

  GetFriendClue = "Infrast:Completed:GetFriendClue", // 领取好友线索

  UnlockClues =  "Infrast:Completed:UnlockClues" // 开启线索交流

}

enum Rogue {
  SubFightStart = "Roguelike:Start:Roguelike1Start", // 已开始探索 x 次

  InvestConfirm = "Roguelike:Roguelike1StageTraderInvestConfirm", // 已投资 x 次
  InvestFull = "Roguelike:Roguelike1StageTraderInvestSystemFull", // 投资已满

  SubFightAbandon = "Roguelike:Roguelike1ExitThenAbandon", // 放弃本次探索
  SubMissionCompleted = "Roguelike:Roguelike1MissionCompletedFlag", // 肉鸽子关卡作战完成
  SubMissionFailed = "Roguelike:Roguelike1MissionFailedFlag", // 肉鸽子关卡作战失败

  EnterTrader = "Roguelike:Roguelike1StageTraderEnter", // 关卡：诡异行商
  EnterSafeHouse = "Roguelike:Roguelike1StageSafeHouseEnter", // 关卡：安全屋
  EnterEncounter = "Roguelike:Roguelike1StageEncounterEnter", // 关卡：不期而遇/古堡馈赠
  EnterDreadfulFoe = "Roguelike:Roguelike1StageDreadfulFoe", // 关卡：险路恶敌
  EnterNormalCambat = "Roguelike:Roguelike1StageNormalCambat", // 关卡：普通作战
  EnterEmergency = "Roguelike:Roguelike1StageEmergencyDps", // 关卡：紧急作战
}

enum Penguin {
  ReportError = "Penguin:ReportToPenguinStats", // 汇报企鹅物流失败
}

enum Friend{
  EnterFriendList = "Visit:Completed:FriendsList"
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
    window.ipcRenderer.invoke("asst:setUUID", {
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
    window.ipcRenderer.invoke("asst:destroy", { uuid: arg.address });
    deviceStore.updateDeviceStatus(arg.address, "unknown");
  });

  // 任务链开始
  window.ipcRenderer.on(CallbackMsg.TaskChainStart, async (event, arg) => {
    taskStore.updateTaskStatus(arg.uuid, arg.task, "processing", 1);
  });

  /** 任务链出错 */
  window.ipcRenderer.on(CallbackMsg.TaskChainError, async(event,arg)=>{
    taskStore.updateTaskStatus(arg.uuid,arg.task,"exception",1);
  });

  /* 任务链完成 */
  window.ipcRenderer.on(CallbackMsg.TaskChainCompleted, async (event, arg) => {
    console.log(arg);
    taskStore.updateTaskStatus(arg.uuid, arg.task, "success", 100);
    window.$message.info(`taskchian ${arg.task} completed`);
  });

  /** 开始唤醒 - 进度条 */
  startUpProcess.forEach((task) => {
    console.log(`REGEISTER: ${task}`);
    window.ipcRenderer.on(`${task}`, (event, arg) => {
      console.log(`RECEIVE: ${task}`);
      console.log(arg);
      const curProcess = taskStore.getTaskProcess(arg.uuid, arg.task);
      const newProcess = curProcess
        ? curProcess + 100 / startUpProcess.length
        : 100 / startUpProcess.length;
      taskStore.updateTaskStatus(arg.uuid, arg.task, "processing", newProcess);
    });
  });

  /* 作战 - 已开始行动 x 次 */
  window.ipcRenderer.on(Fight.SubFightStart, async (event, arg) => {
    console.log(arg);
    const process = taskStore.deviceTasks[arg.uuid];
    // TODO: 计算作战任务进度, 因为没有理智信息的回调，所以这里该怎么做呢
  });

  /* 作战 - 已吃药 */
  window.ipcRenderer.on(Fight.MedicineConfirm, async (event, arg) => {});

  /* 作战 - 已吃源石 */
  window.ipcRenderer.on(Fight.StoneConfrim, async (event, arg) => {});

  /** 企鹅 - 上传🐧物流错误 */
  window.ipcRenderer.on(Penguin.ReportError, async (event, arg) => {
    console.log(arg);
    window.$message.error(arg.message);
  });

  /** 公招 - 已刷新标签 */
  window.ipcRenderer.on(Recriut.Refresh, async (event, arg) => {
    console.log(`RECEIVE: ${Recriut.Refresh}`);
    console.log(arg);
  });

  /** 公招 - 识别到词条 */
  window.ipcRenderer.on(Recriut.TagsDetected, async (event, arg) => {
    console.log(`RECEIVE: ${Recriut.TagsDetected}`);
    const tags = arg.details.tags;
    console.log(`检测到词条 ${tags}`);
  });

  /** 公招 - 已确认招募 */
  window.ipcRenderer.on(Recriut.Confirm, async (event, arg) => {
    console.log(`RECEIVE: ${Recriut.Confirm}`);
    console.log(arg);
    const task = taskStore.getTask(arg.uuid, "recruit");
    console.log(task);
    const curProgress = task.progress;
    const times = task.configurations.maximum_times_of_recruitments;
    const newProgress = parseInt(curProgress + 100/times);
    taskStore.updateTaskStatus(arg.uuid, "recruit", "processing", newProgress);
    console.log(arg);
  });

  /** 公招 - 已选择词条 */
  window.ipcRenderer.on(Recriut.TagsSelected, async(event,arg)=>{
    const tags = arg.details.tags;
    console.log(`已选择词条 ${tags}`);
  });

  /** 基建 - 已进入基建 */
  window.ipcRenderer.on(Infrast.EnterFacility, async(event,arg) =>{
    /**
     *     ManufacturingStation:"Mfg",
    TradingStation:"Trade",
    ControlCenter:"Control",
    PowerStation:"Power",
    MeetingRoom:"Reception",
    Office:"Office",
    Dormitory:"Dorm",
     */
    const facilityTranslate :Record<string,string> = {
      "Mfg": "制造站",
      "Trade":"贸易站",
      "Control":"控制中枢",
      "Power":"发电站",
      "Reception":"会客室",
      "Office":"办公室",
      "Dorm":"宿舍",
    };
    //const times = taskStore.getTask(arg.uuid,"infrast").configurations.facilities.length;
    const times = 18; // 共18个设施
    const curProgress = taskStore.getTaskProcess(arg.uuid,"infrast") as number;
    const newProgress = Math.round( Number(curProgress + 100/times));
    taskStore.updateTaskStatus(arg.uuid, "infrast", "processing",newProgress);
    console.log(`进入 ${facilityTranslate[arg.details.facility]}, ${arg.details.index}`);
  });
}
