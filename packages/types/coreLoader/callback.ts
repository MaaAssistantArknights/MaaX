import type { CoreTaskName } from '@type/task'
import type {
  RecruitTag,
  OneToSix,
  Facility,
  DepotResult,
  Depot_ArkPlanner,
  Depot_Lolicon,
} from '@type/game'

export const enum AsstMsg {
  /* Global Info */
  InternalError = 0, // 内部错误
  InitFailed, // 初始化失败
  ConnectionInfo, // 连接相关信息
  AllTasksCompleted, // 全部任务完成
  // AsyncCallInfo, // 外部异步调用信息

  /* TaskChain Info */
  TaskChainError = 10000, // 任务链执行/识别错误
  TaskChainStart, // 任务链开始
  TaskChainCompleted, // 任务链完成
  TaskChainExtraInfo, // 任务链额外信息

  /* SubTask Info */
  SubTaskError = 20000, // 原子任务执行/识别错误
  SubTaskStart, // 原子任务开始
  SubTaskCompleted, // 原子任务完成
  SubTaskExtraInfo, // 原子任务额外信息
}

export type SubTaskRelatedMsg =
  | AsstMsg.SubTaskError
  | AsstMsg.SubTaskStart
  | AsstMsg.SubTaskCompleted
  | AsstMsg.SubTaskExtraInfo

type ConnectionInfoWhat =
  | 'ConnectFailed'
  | 'Connected'
  | 'UuidGot'
  | 'UnsupportedResolution'
  | 'ResolutionError'
  | 'Reconnecting'
  | 'Reconnected'
  | 'Disconnect'
  | 'ScreencapFailed'
  | 'TouchModeNotAvailable'

// TODO: 确认AllTaskCompleted和另外几个消息是否使用了相同参数
type TaskChainCallback = {
  taskchain: CoreTaskName
  taskid: number
  uuid: string
  finished_tasks: number[]
}

type DropType = 'NORMAL_DROP' | 'SPECIAL_DROP' | 'EXTRA_DROP' | 'FURNITURE'

export type SubTaskExtraInfoMapper = {
  StageDrops: {
    drops: {
      itemId: string
      quantity: number
      itemName: string
      // TODO: 此处根据原来的用法分析得来
      dropType: DropType // | 其它未知类型
    }[]
    stage: {
      stageCode: string
      stageId: string
    }
    stars: 0 | 1 | 3
    stats: {
      itemId: string
      itemName: string
      quantity: number
      addQuantity: number
      // dropType: DropType | '/* 其它未知类型 */' ?
    }[]
  }
  RecruitTagsDetected: {
    tags: RecruitTag[]
  }
  RecruitSpecialTag: {
    tag: RecruitTag
  }
  RecruitResult: {
    tags: RecruitTag[]
    level: OneToSix
    result: {
      tags: RecruitTag[]
      level: OneToSix
      opers: {
        name: string
        level: OneToSix
      }[]
    }[]
  }
  RecruitTagsRefreshed: {
    count: number
    refresh_limit: number
  }
  RecruitTagsSelected: {
    tags: RecruitTag[]
  }
  RecruitSlotCompleted: {}
  RecruitError: {}
  EnterFacility: {
    facility: Facility
    index: number
  }
  NotEnoughStaff: {
    facility: Facility
    index: number
  }
  ProductOfFacility: {
    product: string // TODO
    facility: Facility
    index: number
  }
  StageInfo: {
    name: string
  }
  StageInfoError: {}
  PenguinId: {
    id: string
  }
  Depot: {
    done: boolean
    arkplanner: DepotResult<Depot_ArkPlanner>
    lolicon: DepotResult<Depot_Lolicon>
  }
  OperBox: {
    done: boolean
    all_oper: {
      id: string
      name: string
      own: boolean
      rarity: OneToSix
    }[]
    own_opers: {
      id: string
      name: string
      own: boolean
      elite: 0 | 1 | 2
      level: number
      potential: number // TODO: 根据之后决定到底是0-5还是1-6
      rarity: OneToSix
    }[]
  }
  UnsupportedLevel: {}
}

type SubTaskExtraInfoWhat = keyof SubTaskExtraInfoMapper

type SubTaskExtraInfoCallbackTemplate<What extends SubTaskExtraInfoWhat> = {
  taskchain: CoreTaskName //虽然其实和what有关系, 但是好像没必要去限定
  class: string
  taskid: number // 看用法上有, 但是文档里面没有
  what: What
  details: SubTaskExtraInfoMapper[What]
  uuid: string
}

type SubTaskExtraInfoCallbackGenerator<
  Whats extends SubTaskExtraInfoWhat = SubTaskExtraInfoWhat
> = Whats extends unknown ? SubTaskExtraInfoCallbackTemplate<Whats> : never

export type CallbackMapper = {
  [AsstMsg.InternalError]: {
    // TODO
  }
  [AsstMsg.InitFailed]: {
    what: string
    why: string
    details: Record<string, string>
  }
  [AsstMsg.ConnectionInfo]: {
    what: ConnectionInfoWhat
    why: string
    uuid: string // | ''
    details: {
      adb: string // AsstConnect 接口 adb_path 参数
      address: string // AsstConnect 接口 address 参数
      config: string // AsstConnect 接口 config 参数
    }
  }
  [AsstMsg.AllTasksCompleted]: TaskChainCallback
  [AsstMsg.TaskChainError]: TaskChainCallback
  [AsstMsg.TaskChainStart]: TaskChainCallback
  [AsstMsg.TaskChainCompleted]: TaskChainCallback
  [AsstMsg.TaskChainExtraInfo]: {
    // TODO
  }
  [AsstMsg.SubTaskError]: {
    subtask: string // 'ReportToPenguinStats' ?
    class: string
    taskchain: CoreTaskName
    taskid: number
    details: {}
    uuid: string
    why?: string
  }
  [AsstMsg.SubTaskStart]: {
    subtask: string
    class: string
    taskchain: CoreTaskName
    taskid: number
    details: {}
    uuid: string
  }
  [AsstMsg.SubTaskCompleted]: {
    subtask: string
    class: string
    taskchain: CoreTaskName
    taskid: number
    details: {}
    uuid: string
  }
  [AsstMsg.SubTaskExtraInfo]: SubTaskExtraInfoCallbackGenerator
}

type CallbackTemplate<Code extends AsstMsg> = {
  code: Code
  data: CallbackMapper[Code]
  // customArg
}

type CallbackGenerator<Codes extends AsstMsg = AsstMsg> = Codes extends unknown
  ? CallbackTemplate<Codes>
  : never

export type Callback = CallbackGenerator
