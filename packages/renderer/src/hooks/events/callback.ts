import useDeviceStore from '@/store/devices'
import useTaskStore from '@/store/tasks'

import { show } from '@/utils/message'
import { AsstMsg } from '@common/enum/callback'
import type { MessageReactive } from 'naive-ui'

const logger = console

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
  InternalError = 'core:InternalError', // 内部错误
  InitFailed = 'core:InitFailed', // 初始化失败
  ConnectionInfo = '', // 连接相关信息
  AllTasksCompleted = 'core:AllTasksCompleted', // 全部任务完成
  /* TaskChain Info */
  TaskChainError = 'core:TaskChainError', // 任务链执行/识别错误
  TaskChainStart = 'core:TaskChainStart', // 任务链开始
  TaskChainCompleted = 'core:TaskChainCompleted', // 任务链完成
  TaskChainExtraInfo = '10003', // 任务链额外信息
  /* SubTask Info */
  SubTaskError = 'core:SubTaskError', // 原子任务执行/识别错误
  SubTaskStart = 'core:SubTaskStart', // 原子任务开始
  SubTaskCompleted = 'core:SubTaskCompleted', // 原子任务完成
  SubTaskExtraInfo = '20003', // 原子任务额外信息
  /* Task Info */
}

enum Connection {
  UuidGot = 'UuidGot',
  ConnectFailed = 'ConnectFailed',
}

enum StartUp {
  StartUp = 'StartUp:Start:StartUp',
  CompletedStartUp = 'StartUp:Completed:StartUp',
  GameStart = 'StartUp:Start:GameStart',
  CompletedGameStart = 'StartUp:Completed:GameStart',
  StartToWakeUp = 'StartUp:Start:StartToWakeUp',
  CompletedWakeUp = 'StartUp:Completed:StartToWakeUp',
  ConnectingFlag = 'StartUp:Start:StartUpConnectingFlag',
  CompletedConnectingFlag = 'StartUp:Completed:StartUpConnectingFlag',
  // TODO: change stop to finish
  Stop = 'StartUp:Start:Stop',
  CompletedStop = 'StartUp:Completed:Stop',
  Terminal = 'StartUp:Start:Terminal',
  CloseAnno = 'StartUp:Start:CloseAnno',
  TodaysSupplies = 'StartUp:Start:TodaysSupplies',
  ReturnToTerminal = 'StartUp:Start:ReturnToTerminal',
  OfflineConfirm = 'StartUp:Start:OfflineConfirm',
  ExtraExceededLimit = 'StartUp:Extra:ExceededLimit',
}

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

// enum Penguin {
//   ReportError = 'Penguin:ReportToPenguinStats', // 汇报企鹅物流失败
// }

// enum Friend {
//   EnterFriendList = 'Visit:Completed:FriendsList', // 进入好友列表
//   VisitNext = 'Visit:Completed:VisitNext', // 访问下位
// }

// enum Shutdown {
//   Emulator = 'Shutdown:Emulator',
// }

// type CallbackCode =
//   | CallbackMsg
//   | StartUp
//   | Connection
//   | Fight
//   | Recruit
//   | Infrast
//   | Penguin
//   | Friend

// interface callbackProps {
//   [x: string]: (data: object) => void
// }

// function shutdown (option: string, pid: string): void {
//   (async () => {
//     await window.ipcRenderer.invoke('main.CoreLoader:stop', {
//       option: option,
//       pid: pid
//     })
//   })()
// }

const messages: Record<string, MessageReactive> = {}

export default function useCallbackEvents (): void {
  const deviceStore = useDeviceStore()
  // const taskStore = useTaskStore()
  // const taskIdStore = useTaskIdStore()

  // const callbackFn: callbackProps = {
  //   [CallbackMsg.InternalError]: (data) => {
  //     // 内部错误
  //   },
  //   [CallbackMsg.InitFailed]: (data) => {
  //     // 初始化错误
  //   },
  //   [CallbackMsg.AllTasksCompleted]: (data) => {
  //     // 全任务完成
  //     const task = taskStore.getTask(data.uuid, 'shutdown')
  //     const device = deviceStore.getDevice(data.uuid)
  //     deviceStore.updateDeviceStatus(data.uuid, 'connected')
  //     // 检测是否有关机任务
  //     if (task?.enable && task?.configurations.enable) {
  //       logger.debug('enable shutdown option')
  //       const option = task.configurations.option as string
  //       const pid = device?.pid
  //       const id = setTimeout(shutdown, 30000, option, pid)
  //       logger.debug('shutdown taskid', id)
  //       taskIdStore.updateTaskId(data.uuid, 'shutdown', id)
  //     }
  //     // TODO: 状态归位
  //   },
  //   [Connection.UuidGot]: (data) => {
  //     // 获取到uuid, 作为连接成功的标志
  //     show(`设备${data.address}已连接`, { type: 'success', duration: 3000 }, true)
  //     deviceStore.updateDeviceStatus(data.uuid, 'connected')
  //   },
  //   [Connection.ConnectFailed]: (data) => {
  //     // 连接失败
  //     (async () => {
  //       await window.ipcRenderer.invoke('main.CoreLoader:destroy', { uuid: data.address })
  //       deviceStore.updateDeviceStatus(data.address, 'unknown')
  //     })()
  //     show(`设备${data.address}连接失败`, { type: 'error', duration: 3000 }, true)
  //   },
  //   [CallbackMsg.TaskChainStart]: (data: Record<string, any>): void => {
  //     // 任务链开始
  //     if (data.taskchain === 'Fight') { // 等待重写
  //       taskIdStore.onFightStart(data.uuid, data.taskid)
  //     }
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', 0)
  //   },
  //   [CallbackMsg.TaskChainError]: (data: Record<string, any>): void => {
  //     // 任务链出错
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'exception', 100)
  //   },
  //   [CallbackMsg.TaskChainCompleted]: (data: Record<string, any>): void => {
  //     // 任务链完成
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'success', 100)
  //   },
  //   [StartUp.StartUp]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.GameStart]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.StartToWakeUp]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.Terminal]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.CloseAnno]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.TodaysSupplies]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.ReturnToTerminal]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [StartUp.OfflineConfirm]: (data: Record<string, any>): void => {
  //     const curProcess = taskStore.getTaskProcess(data.uuid, data.task)
  //     // 8 -> StartUp共有8个进度
  //     const newProcess = curProcess
  //       ? curProcess + 100 / 8
  //       : 100 / 8
  //     taskStore.updateTaskStatus(data.uuid, data.task, 'processing', newProcess)
  //   },
  //   [Fight.SubFightStart]: (data: Record<string, any>): void => {
  //     // const process = taskStore.deviceTasks[arg.uuid]
  //     // TODO: 计算作战任务进度, 因为没有理智信息的回调，所以这里该怎么做呢
  //     logger.debug(`触发作战, 任务id ${data.taskid as number}`)
  //     taskIdStore.onFightStart(data.uuid, data.taskid) // 触发作战, 将id从未进行任务中移除
  //   },
  //   [Fight.MedicineConfirm]: (data: Record<string, any>): void => {
  //     // 作战 - 吃了一颗理智药
  //     taskIdStore.useMedicineOrStone(data.uuid, 'medicine')
  //     logger.debug('吃了一颗理智药')
  //   },
  //   [Fight.StoneConfrim]: (data: Record<string, any>): void => {
  //     // 作战 - 吃了一颗源石
  //     taskIdStore.useMedicineOrStone(data.uuid, 'stone')
  //     logger.debug('吃了一颗源石')
  //   },
  //   [Penguin.ReportError]: (data: Record<string, any>): void => {
  //     // 企鹅 - 上传🐧物流错误
  //     logger.error(data)
  //     window.$message.error(data.message)
  //   },
  //   [Recruit.Refresh]: (data: Record<string, any>): void => {
  //     logger.debug(data)
  //   },
  //   [Recruit.TagsDetected]: (data: Record<string, any>): void => {
  //     const tags = data.details.tags
  //     logger.debug('检测到词条')
  //     logger.debug(tags)
  //   },
  //   [Recruit.Confirm]: (data: Record<string, any>): void => {
  //     logger.debug(data)
  //     const task = taskStore.getTask(data.uuid, 'recruit')
  //     const curProgress: number = task?.progress as number
  //     const times = task?.configurations.maximum_times_of_recruitments as number
  //     const newProgress = _.round(Number(curProgress) + 100 / times)
  //     taskStore.updateTaskStatus(data.uuid, 'recruit', 'processing', newProgress)
  //   },
  //   [Recruit.TagsSelected]: (data: Record<string, any>): void => {
  //     const tags = data.details.tags
  //     logger.debug('已选择词条')
  //     logger.debug(tags)
  //   },
  //   [Infrast.EnterFacility]: (data: Record<string, any>): void => {
  //     const facilityTranslate: Record<string, string> = {
  //       Mfg: '制造站',
  //       Trade: '贸易站',
  //       Control: '控制中枢',
  //       Power: '发电站',
  //       Reception: '会客室',
  //       Office: '办公室',
  //       Dorm: '宿舍'
  //     }
  //     logger.debug(
  //       `进入 ${facilityTranslate[data.details.facility]}, ${data.details.index as number}`
  //     )
  //     // const times = taskStore.getTask(arg.uuid,"infrast").configurations.facilities.length;
  //     const times = 18 // 共18个设施
  //     const curProgress = taskStore.getTaskProcess(data.uuid, 'infrast') as number
  //     const newProgress = Math.round(Number(curProgress + 100 / times))
  //     taskStore.updateTaskStatus(data.uuid, 'infrast', 'processing', newProgress)
  //   },
  //   [Infrast.NotEnoughStaff]: (data: Record<string, any>): void => {
  //     logger.debug(`${data.details.facility as string} ${data.details.index as number} 可用干员不足`)
  //   },
  //   [Friend.EnterFriendList]: (data: Record<string, any>): void => {
  //     logger.debug('进入好友列表')
  //     taskStore.updateTaskStatus(data.uuid, 'visit', 'processing', 10)
  //   },
  //   [Friend.VisitNext]: (data: Record<string, any>): void => {
  //     const curProgress = taskStore.getTaskProcess(data.uuid, 'visit') as number
  //     const newProgress = curProgress < 90 ? curProgress + 10 : curProgress // 计数可能有误，玛丽如是说。
  //     taskStore.updateTaskStatus(data.uuid, 'visit', 'processing', newProgress)
  //   }
  // }

  const subTaskFn = {
    [AsstMsg.SubTaskError]: {
      Emulator: (data: Callback.SubTaskError) => {},
      StartUp: (data: Callback.SubTaskError) => {},
      Fight: (data: Callback.SubTaskError) => {},
      Mall: (data: Callback.SubTaskError) => {},
      Recruit: (data: Callback.SubTaskError) => {},
      RecruitCalc: (data: Callback.SubTaskError) => {},
      Infrast: (data: Callback.SubTaskError) => {},
      Visit: (data: Callback.SubTaskError) => {},
      Roguelike: (data: Callback.SubTaskError) => {},
      Copilot: (data: Callback.SubTaskError) => {},
      Shutdown: (data: Callback.SubTaskError) => {},
      Award: (data: Callback.SubTaskError) => {},
      Debug: (data: Callback.SubTaskError) => {}
    },
    [AsstMsg.SubTaskStart]: {
      Emulator: (data: Callback.SubTaskStart) => {},
      StartUp: (data: Callback.SubTaskStart) => {},
      Fight: (data: Callback.SubTaskStart) => {},
      Mall: (data: Callback.SubTaskStart) => {},
      Recruit: (data: Callback.SubTaskStart) => {},
      RecruitCalc: (data: Callback.SubTaskStart) => {},
      Infrast: (data: Callback.SubTaskStart) => {},
      Visit: (data: Callback.SubTaskStart) => {},
      Roguelike: (data: Callback.SubTaskStart) => {},
      Copilot: (data: Callback.SubTaskStart) => {},
      Shutdown: (data: Callback.SubTaskStart) => {},
      Award: (data: Callback.SubTaskStart) => {},
      Debug: (data: Callback.SubTaskStart) => {}
    },
    [AsstMsg.SubTaskCompleted]: {
      Emulator: (data: Callback.SubTaskCompleted) => {},
      StartUp: (data: Callback.SubTaskCompleted) => {},
      Fight: (data: Callback.SubTaskCompleted) => {},
      Mall: (data: Callback.SubTaskCompleted) => {},
      Recruit: (data: Callback.SubTaskCompleted) => {},
      RecruitCalc: (data: Callback.SubTaskCompleted) => {},
      Infrast: (data: Callback.SubTaskCompleted) => {},
      Visit: (data: Callback.SubTaskCompleted) => {},
      Roguelike: (data: Callback.SubTaskCompleted) => {},
      Copilot: (data: Callback.SubTaskCompleted) => {},
      Shutdown: (data: Callback.SubTaskCompleted) => {},
      Award: (data: Callback.SubTaskCompleted) => {},
      Debug: (data: Callback.SubTaskCompleted) => {}
    },
    [AsstMsg.SubTaskExtraInfo]: {
      Emulator: (data: Callback.SubTaskExtraInfo) => {},
      StartUp: (data: Callback.SubTaskExtraInfo) => {},
      Fight: (data: Callback.SubTaskExtraInfo) => {
        switch (data.subtask) {
          case 'StageDropsTask': {
            // TODO: 获得掉落物

            // data = {
            //   code: 20003,
            //   data: {
            //     class: 'class asst::StageDropsTaskPlugin',
            //     details: {
            //       drops: [
            //         {
            //           dropType: 'EXP_LMB_DROP',
            //           itemId: '4001',
            //           itemName: '龙门币',
            //           quantity: 252
            //         },
            //         {
            //           dropType: 'NORMAL_DROP',
            //           itemId: 'act20side_token_book',
            //           itemName: '《奇谈怪论》复印本',
            //           quantity: 21
            //         }
            //       ],
            //       stage: { stageCode: 'IC-8', stageId: 'act20side_08' },
            //       stars: 3,
            //       stats: [{
            //         itemId: '4001',
            //         itemName: '龙门币',
            //         quantity: 252
            //       }, {
            //         itemId: 'act20side_token_book',
            //         itemName: '《奇谈怪论》复印本',
            //         quantity: 21
            //       }]
            //     },
            //     subtask: 'StageDropsTask',
            //     taskchain: 'Fight',
            //     taskid: 2,
            //     uuid: '2cdd3accfda1038d\r\n',
            //     what: 'StageDrops'
            //   }
            // }
            break
          }
        }
      },
      Mall: (data: Callback.SubTaskExtraInfo) => {},
      Recruit: (data: Callback.SubTaskExtraInfo) => {},
      RecruitCalc: (data: Callback.SubTaskExtraInfo) => {},
      Infrast: (data: Callback.SubTaskExtraInfo) => {},
      Visit: (data: Callback.SubTaskExtraInfo) => {},
      Roguelike: (data: Callback.SubTaskExtraInfo) => {},
      Copilot: (data: Callback.SubTaskExtraInfo) => {},
      Shutdown: (data: Callback.SubTaskExtraInfo) => {},
      Award: (data: Callback.SubTaskExtraInfo) => {},
      Debug: (data: Callback.SubTaskExtraInfo) => {}
    }
  }

  const callbackFn = {
    [AsstMsg.InternalError]: (data: Callback.InternalError) => {},
    [AsstMsg.InitFailed]: (data: Callback.InitFailed) => {},
    [AsstMsg.ConnectionInfo]: (data: Callback.ConnectionInfo) => {
      const uuid = data.uuid.trim()
      switch (data.what) {
        case 'UuidGot': {
          break
        }
        case 'ResolutionGot': {
          break
        }
        case 'Connected': {
          const device = deviceStore.getDevice(uuid)
          show(
            `${device?.displayName ?? ''}连接成功`,
            { type: 'success' },
            true
          )
          deviceStore.updateDeviceStatus(uuid, 'connected')
          break
        }
        case 'UnsupportedResolution': {
          show('不支持这个分辨率', { type: 'error' })
          break
        }
        case 'ResolutionError': {
          show('获取分辨率失败', { type: 'error' })
          break
        }
        case 'Reconnecting': {
          if (messages[uuid]) {
            messages[uuid].destroy()
          }
          const device = deviceStore.getDevice(uuid)
          messages[uuid] = show(`${device?.displayName ?? ''}尝试重连中...`, {
            type: 'loading'
          })
          deviceStore.updateDeviceStatus(uuid, 'connecting')
          break
        }
        case 'Reconnected': {
          if (messages[uuid]) {
            messages[uuid].destroy()
          }
          const device = deviceStore.getDevice(uuid)
          show(`${device?.displayName ?? ''}重连成功`, { type: 'success' })
          deviceStore.updateDeviceStatus(uuid, 'connected')
          break
        }
        case 'Disconnect': {
          const device = deviceStore.getDevice(uuid)
          if (device?.status === 'connecting') {
            messages[uuid]?.destroy()
            show(`${device?.displayName ?? ''}重连失败`, { type: 'error' })
          } else {
            show(
              `${device?.displayName ?? ''}已断开连接`,
              { type: 'info' },
              true
            )
          }
          deviceStore.updateDeviceStatus(uuid, 'disconnected')
          break
        }
        default:
          break
      }
    },
    [AsstMsg.AllTasksCompleted]: (data: Callback.AllTasksCompleted) => {
      const deviceStore = useDeviceStore()
      deviceStore.updateDeviceStatus(data.uuid.trim(), 'connected')
      show('所有任务完成了OvO', { type: 'info' })
    },
    [AsstMsg.TaskChainError]: (data: Callback.TaskChainError) => {
      const taskStore = useTaskStore()
      taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, 'exception', 0)
    },
    [AsstMsg.TaskChainStart]: (data: Callback.TaskChainStart) => {
      const taskStore = useTaskStore()
      taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, 'processing', 0)
    },
    [AsstMsg.TaskChainCompleted]: (data: Callback.TaskChainCompleted) => {
      const taskStore = useTaskStore()
      taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, 'success', 0)
    },
    [AsstMsg.TaskChainExtraInfo]: (data: Callback.TaskChainExtraInfo) => {
      // TODO
    },
    [AsstMsg.SubTaskError]: (data: Callback.SubTaskError) => {
      subTaskFn[AsstMsg.SubTaskError][data.taskchain](data)
    },
    [AsstMsg.SubTaskStart]: (data: Callback.SubTaskStart) => {
      subTaskFn[AsstMsg.SubTaskStart][data.taskchain](data)
    },
    [AsstMsg.SubTaskCompleted]: (data: Callback.SubTaskCompleted) => {
      subTaskFn[AsstMsg.SubTaskCompleted][data.taskchain](data)
    },
    [AsstMsg.SubTaskExtraInfo]: (data: Callback.SubTaskExtraInfo) => {
      subTaskFn[AsstMsg.SubTaskExtraInfo][data.taskchain](data)
    }
  }

  window.ipcRenderer.on(
    'renderer.CoreLoader:callback',
    (event, callback: Callback) => {
      const { code } = callback
      if (callbackFn[code]) {
        logger.debug(`[callback] handle ${AsstMsg[code]}:`)
        logger.debug(callback)
        callbackFn[code](callback.data)
      } else {
        logger.debug(`[callback] unhandle ${AsstMsg[code]}`)
        logger.debug(callback)
      }
    }
  )
}
