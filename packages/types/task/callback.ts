import type { CoreTaskName } from '@type/task'
import type {
  ConnectionInfoMapper,
  ConnectionInfoCallbackGenerator,
} from './callbackInfo/ConnectionInfo'
import type {
  SubTaskExtraInfoMapper,
  SubTaskExtraInfoCallbackGenerator,
} from './callbackInfo/SubTaskExtraInfo'

export type { ConnectionInfoMapper, SubTaskExtraInfoMapper }

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
  TaskChainStopped, // 任务链手动停止

  /* SubTask Info */
  SubTaskError = 20000, // 原子任务执行/识别错误
  SubTaskStart, // 原子任务开始
  SubTaskCompleted, // 原子任务完成
  SubTaskExtraInfo, // 原子任务额外信息
  SubTaskStopped, // 原子任务手动停止
}

export type SubTaskRelatedMsg =
  | AsstMsg.SubTaskError
  | AsstMsg.SubTaskStart
  | AsstMsg.SubTaskCompleted
  | AsstMsg.SubTaskExtraInfo
  | AsstMsg.SubTaskStopped

type TaskChainCallback = {
  uuid: string
  taskchain: CoreTaskName
  taskid: number
}

export type CallbackMapper = {
  [AsstMsg.InternalError]: {
    // TODO
  }
  [AsstMsg.InitFailed]: {
    what: string
    why: string
    details: Record<string, string>
  }
  [AsstMsg.ConnectionInfo]: ConnectionInfoCallbackGenerator
  [AsstMsg.AllTasksCompleted]: TaskChainCallback & {
    finished_tasks: number[]
  }
  [AsstMsg.TaskChainError]: TaskChainCallback
  [AsstMsg.TaskChainStart]: TaskChainCallback
  [AsstMsg.TaskChainCompleted]: TaskChainCallback
  [AsstMsg.TaskChainExtraInfo]: {} // 暂时不会触发这个消息
  [AsstMsg.TaskChainStopped]: TaskChainCallback & {
    finished_tasks: number[]
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
  [AsstMsg.SubTaskStopped]: {}
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
