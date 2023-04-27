export enum AsstMsg {
  /* Global Info */
  InternalError = 0, // 内部错误
  InitFailed, // 初始化失败
  ConnectionInfo, // 连接相关信息
  AllTasksCompleted, // 全部任务完成
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

export type SubTaskMsg =
  | AsstMsg.SubTaskError
  | AsstMsg.SubTaskStart
  | AsstMsg.SubTaskCompleted
  | AsstMsg.SubTaskExtraInfo

export type SubTaskMsgData = {
  [AsstMsg.SubTaskError]: Callback.SubTaskError
  [AsstMsg.SubTaskStart]: Callback.SubTaskStart
  [AsstMsg.SubTaskCompleted]: Callback.SubTaskCompleted
  [AsstMsg.SubTaskExtraInfo]: Callback.SubTaskExtraInfo
}
