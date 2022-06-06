import useDeviceStore from '@/store/devices'
import useTaskStore from '@/store/tasks'
import useTaskIdStore from '@/store/taskId'

import { show } from '@/utils/message'
import logger from '../caller/logger'
import _ from 'lodash'

// interface basicCallbackType {
//   uuid: string
//   what: string
// }

// interface uuidType extends basicCallbackType {
//   address: string
// }

// interface taskchainType extends basicCallbackType{
//   task: string
//   taskid: number
//   taskchain: string
// }

// interface fightType extends basicCallbackType{
//   taskid: number
// }

// interface penguinType extends basicCallbackType{
//   message: string
// }

// interface recruitType extends basicCallbackType{
//   details: {
//     tags: string[]
//   }
// }

// interface infrastType extends basicCallbackType{
//   details: {
//     index: number
//     facility: string
//   }
// }

enum CallbackMsg {
  /* Global Info */
  InternalError = '0', // 内部错误
  InitFailed= '1', // 初始化失败
  ConnectionInfo= '2', // 连接相关信息
  AllTasksCompleted= '3', // 全部任务完成
  /* TaskChain Info */
  TaskChainError= '10000', // 任务链执行/识别错误
  TaskChainStart= '10001', // 任务链开始
  TaskChainCompleted= '10002', // 任务链完成
  TaskChainExtraInfo= '10003', // 任务链额外信息
  /* SubTask Info */
  SubTaskError= '20000', // 原子任务执行/识别错误
  SubTaskStart= '20001', // 原子任务开始
  SubTaskCompleted= '20002', // 原子任务完成
  SubTaskExtraInfo= '20003' // 原子任务额外信息
  /* Task Info */
}

enum Connection {
  UuidGetted = 'UuidGetted',
  ConnectFailed = 'ConnectFailed',
}

interface callbackProps {
  [x: string]: (data: Record<string, string>) => void
}

enum StartUp {
  StartUp = 'StartUp:Start:StartUp',
  GameStart = 'StartUp:Start:GameStart',
  StartToWakeUp = 'StartUp:Start:StartToWakeUp',
  Terminal = 'StartUp:Start:Terminal',
  CloseAnno = 'StartUp:Start:CloseAnno',
  TodaysSupplies = 'StartUp:Start:TodaysSupplies',
  ReturnToTerminal = 'StartUp:Start:ReturnToTerminal',
  OfflineConfirm = 'StartUp:Start:OfflineConfirm'
}
// enum StartUp {}

enum Fight {
  SubFightStart = 'Fight:Completed:StartButton2',
  MedicineConfirm = 'Fight:Completed:MedicineConfirm',
  StoneConfrim = 'Fight:Completed:StoneConfrim',

  StageDrops = 'Fight:Extra:StageDrops', // 掉落物
}

enum Recruit {
  Refresh = 'Recruit:Completed:RecruitRefreshConfirm',
  Confirm = 'Recruit:Completed:RecruitConfirm',

  TagsDetected = 'Recruit:Extra:RecruitTagsDetected', // 检测到词条

  SpecialTagsDetected = 'Recruit:Extra:RecruitSpecialTag', // 检测到特殊词条

  Result = 'Recruit:RecruitResult', // 公招结果

  TagsSelected = 'Recruit:Extra:RecruitTagsSelected', // 选择词条
}

enum Infrast {
  OperatorConflict = 'Infrast:InfrastDormDoubleConfirmButton', // 干员冲突

  EnterFacility = 'Infrast:Extra:EnterFacility', // 进入设施

  NotEnoughStaff = 'Infrast:Extra:NotEnoughStaff', // 可用干员不足

  GetFriendClue = 'Infrast:Completed:GetFriendClue', // 领取好友线索

  UnlockClues = 'Infrast:Completed:UnlockClues', // 开启线索交流
}

// enum Rogue {
//   SubFightStart = 'Roguelike:Start:Roguelike1Start', // 已开始探索 x 次

//   InvestConfirm = 'Roguelike:Roguelike1StageTraderInvestConfirm', // 已投资 x 次
//   InvestFull = 'Roguelike:Roguelike1StageTraderInvestSystemFull', // 投资已满

//   SubFightAbandon = 'Roguelike:Roguelike1ExitThenAbandon', // 放弃本次探索
//   SubMissionCompleted = 'Roguelike:Roguelike1MissionCompletedFlag', // 肉鸽子关卡作战完成
//   SubMissionFailed = 'Roguelike:Roguelike1MissionFailedFlag', // 肉鸽子关卡作战失败

//   EnterTrader = 'Roguelike:Roguelike1StageTraderEnter', // 关卡：诡异行商
//   EnterSafeHouse = 'Roguelike:Roguelike1StageSafeHouseEnter', // 关卡：安全屋
//   EnterEncounter = 'Roguelike:Roguelike1StageEncounterEnter', // 关卡：不期而遇/古堡馈赠
//   EnterDreadfulFoe = 'Roguelike:Roguelike1StageDreadfulFoe', // 关卡：险路恶敌
//   EnterNormalCambat = 'Roguelike:Roguelike1StageNormalCambat', // 关卡：普通作战
//   EnterEmergency = 'Roguelike:Roguelike1StageEmergencyDps', // 关卡：紧急作战
// }

enum Penguin {
  ReportError = 'Penguin:ReportToPenguinStats', // 汇报企鹅物流失败
}

enum Friend {
  EnterFriendList = 'Visit:Completed:FriendsList', // 进入好友列表
  VisitNext = 'Visit:Completed:VisitNext', // 访问下位
}

// enum Shutdown {
//   Emulator = 'Shutdown:Emulator',
// }

function shutdown (option: string, pid: string): void {
  (async () => { await window.ipcRenderer.invoke('main.CoreLoader:shutdown', { option: option, pid: pid }) })()
}

export default function useCallbackEvents (): void {
  const deviceStore = useDeviceStore()
  const taskStore = useTaskStore()
  const taskIdStore = useTaskIdStore()

  const callbackHandle: callbackProps = {
    [CallbackMsg.InternalError]: (data: Record<string, string>): void => {
      // 内部错误
    },
    [CallbackMsg.InitFailed]: (data: Record<string, string>): void => {
      // 初始化错误
    },
    [CallbackMsg.AllTasksCompleted]: (data: Record<string, string>): void => {
      // 全任务完成
      const task = taskStore.getTask(data.uuid, 'shutdown')
      const device = deviceStore.getDevice(data.uuid)
      deviceStore.updateDeviceStatus(data.uuid, 'connected')
      // 检测是否有关机任务
      if (task?.enable && task?.configurations.enable) {
        logger.debug('enable shutdown option')
        const option = task.configurations.option as string
        const pid = device?.pid
        const id = setTimeout(shutdown, 30000, option, pid)
        logger.debug('shutdown taskid', id)
        taskIdStore.updateTaskId(data.uuid, 'shutdown', id)
      }
      // TODO: 状态归位
    },
    [Connection.UuidGetted]: (data: Record<string, string>): void => {
      // 获取到uuid, 作为连接成功的标志
      show(`设备${data.address}已连接`, { type: 'success', duration: 3000 })
      deviceStore.updateDeviceStatus(data.uuid, 'connected')
    },
    [Connection.ConnectFailed]: (data: Record<string, string>): void => {
      // 连接失败
      (async () => {
        await window.ipcRenderer.invoke('main.CoreLoader:destroy', { uuid: data.address })
        deviceStore.updateDeviceStatus(data.address, 'unknown')
      })()
    },
    [CallbackMsg.TaskChainStart]: (data: Record<string, any>): void => {
      // 任务链开始
      if (data.taskchain === 'Fight') { // 等待重写
        taskIdStore.onFightStart(data.uuid, data.taskid)
      }
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', 0)
    },
    [CallbackMsg.TaskChainError]: (data: Record<string, any>): void => {
      // 任务链出错
      taskStore.updateTaskStatus(data.uuid, data.task, 'exception', 100)
    },
    [CallbackMsg.TaskChainCompleted]: (data: Record<string, any>): void => {
      // 任务链完成
      taskStore.updateTaskStatus(data.uuid, data.task, 'success', 100)
    },
    [StartUp.StartUp]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.GameStart]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.StartToWakeUp]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.Terminal]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.CloseAnno]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.TodaysSupplies]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.ReturnToTerminal]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [StartUp.OfflineConfirm]: (data: Record<string, any>): void => {
      const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
      // 8 -> StartUp共有8个进度
      const newProcess = curProcess
        ? curProcess + 100 / 8
        : 100 / 8
      taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
    },
    [Fight.SubFightStart]: (data: Record<string, any>): void => {
      // const process = taskStore.deviceTasks[arg.uuid]
      // TODO: 计算作战任务进度, 因为没有理智信息的回调，所以这里该怎么做呢
      logger.debug(`触发作战, 任务id ${data.taskid as number}`)
      taskIdStore.onFightStart(data.uuid, data.taskid) // 触发作战, 将id从未进行任务中移除
    },
    [Fight.MedicineConfirm]: (data: Record<string, any>): void => {
      // 作战 - 吃了一颗理智药
      taskIdStore.useMedicineOrStone(data.uuid, 'medicine')
      logger.debug('吃了一颗理智药')
    },
    [Fight.StoneConfrim]: (data: Record<string, any>): void => {
      // 作战 - 吃了一颗源石
      taskIdStore.useMedicineOrStone(data.uuid, 'stone')
      logger.debug('吃了一颗源石')
    },
    [Penguin.ReportError]: (data: Record<string, any>): void => {
      // 企鹅 - 上传🐧物流错误
      logger.error(data)
      window.$message.error(data.message)
    },
    [Recruit.Refresh]: (data: Record<string, any>): void => {
      logger.debug(data)
    },
    [Recruit.TagsDetected]: (data: Record<string, any>): void => {
      const tags = data.details.tags
      logger.debug('检测到词条')
      logger.debug(tags)
    },
    [Recruit.Confirm]: (data: Record<string, any>): void => {
      logger.debug(data)
      const task = taskStore.getTask(data.uuid, 'recruit')
      const curProgress: number = task?.progress as number
      const times = task?.configurations.maximum_times_of_recruitments as number
      const newProgress = _.round(Number(curProgress) + 100 / times)
      taskStore.updateTaskStatus(data.uuid, 'recruit', 'processing', newProgress)
    },
    [Recruit.TagsSelected]: (data: Record<string, any>): void => {
      const tags = data.details.tags
      logger.debug('已选择词条')
      logger.debug(tags)
    },
    [Infrast.EnterFacility]: (data: Record<string, any>): void => {
      const facilityTranslate: Record<string, string> = {
        Mfg: '制造站',
        Trade: '贸易站',
        Control: '控制中枢',
        Power: '发电站',
        Reception: '会客室',
        Office: '办公室',
        Dorm: '宿舍'
      }
      logger.debug(
        `进入 ${facilityTranslate[data.details.facility]}, ${data.details.index as number}`
      )
      // const times = taskStore.getTask(arg.uuid,"infrast").configurations.facilities.length;
      const times = 18 // 共18个设施
      const curProgress = taskStore.getTaskProcess(data.uuid, 'infrast') as number
      const newProgress = Math.round(Number(curProgress + 100 / times))
      taskStore.updateTaskStatus(data.uuid, 'infrast', 'processing', newProgress)
    },
    [Infrast.NotEnoughStaff]: (data: Record<string, any>): void => {
      logger.debug(`${data.details.facility as string} ${data.details.index as number} 可用干员不足`)
    },
    [Friend.EnterFriendList]: (data: Record<string, any>): void => {
      logger.debug('进入好友列表')
      taskStore.updateTaskStatus(data.uuid, 'visit', 'processing', 10)
    },
    [Friend.VisitNext]: (data: Record<string, any>): void => {
      const curProgress = taskStore.getTaskProcess(data.uuid, 'visit') as number
      const newProgress = curProgress < 90 ? curProgress + 10 : curProgress // 计数可能有误，玛丽如是说。
      taskStore.updateTaskStatus(data.uuid, 'visit', 'processing', newProgress)
    }
  }

  window.ipcRenderer.on('renderer.CoreLoader:callback', (event, msg) => {
    const { name, data } = msg
    if (callbackHandle[name]) {
      logger.debug(`[callback] handle ${data.name as string}`)
      callbackHandle[name](data)
    } else {
      logger.debug(`[callback] unhandle ${data.name as string}`)
    }
  })
}
