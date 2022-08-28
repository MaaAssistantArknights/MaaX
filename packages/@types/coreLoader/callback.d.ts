/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
namespace Detail {
  interface InternalError {
    // core TODO
  }

  interface InitFailed {
    [K: string]: string
  }

  interface ConnectionInfo {
    adb: string // AsstConnect 接口 adb_path 参数
    address: string // AsstConnect 接口 address 参数
    config: string // AsstConnect 接口 config 参数
  }
}

namespace What {
  type InternalError = string // core TODO
  type InitFailed = string
  type ConnectionInfo =
    | 'ConnectFailed' // 连接失败
    | 'Connected' // 已连接，注意此时的 uuid 字段值为空（下一步才是获取）
    | 'UuidGot' // 已获取到设备唯一码
    | 'ResolutionGot' // 已获取到分辨率
    | 'UnsupportedResolution' // 分辨率不被支持
    | 'ResolutionError' // 分辨率获取错误
    | 'Reconnecting' // 连接断开（adb / 模拟器 炸了），正在重连
    | 'Reconnected' // 连接断开（adb / 模拟器 炸了），重连成功
    | 'Disconnect' // 连接断开（adb / 模拟器 炸了），并重试失败
}

namespace Callback {
  interface InternalError {
    // core TODO
  }

  interface InitFailed {
    what: What.InitFailed
    why: string
    details: Detail.InitFailed
  }

  interface ConnectionInfo {
    what: What.ConnectionInfo
    why: string
    uuid: string
    details: Detail.ConnectionInfo
  }

  interface AllTasksCompleted {
    taskchain: import('@common/enum/callback').TaskChainMap
    uuid: string
    finished_tasks: number[]
  }

  interface TaskChainStart {
    taskchain: import('@common/enum/callback').TaskChainMap // 当前的任务链
    taskid: number // 当前任务 TaskId
    uuid: string // 设备唯一码
  }

  interface TaskChainError {
    taskchain: import('@common/enum/callback').TaskChainMap // 当前的任务链
    taskid: number // 当前任务 TaskId
    uuid: string // 设备唯一码
  }

  interface TaskChainCompleted {
    taskchain: import('@common/enum/callback').TaskChainMap // 当前的任务链
    taskid: number // 当前任务 TaskId
    uuid: string // 设备唯一码
  }

  interface TaskChainExtraInfo {
    // core TODO
  }

  interface SubTaskStart {
    subtask: string // 子任务名
    class: string // 子任务符号名
    taskchain: CoreTaskName // 当前任务链
    taskid: number // 当前任务 TaskId
    details: any // 详情
    uuid: string // 设备唯一码
  }

  interface SubTaskError {
    subtask: string // 子任务名
    class: string // 子任务符号名
    taskchain: CoreTaskName // 当前任务链
    taskid: number // 当前任务 TaskId
    details: any // 详情
    uuid: string // 设备唯一码
    why?: string // 错误原因
  }
  interface SubTaskCompleted {
    subtask: string // 子任务名
    class: string // 子任务符号名
    taskchain: CoreTaskName // 当前任务链
    taskid: number // 当前任务 TaskId
    details: any // 详情
    uuid: string // 设备唯一码
  }

  interface SubTaskExtraInfo {
    subtask: string // 子任务名
    taskchain: CoreTaskName // 当前任务链
    class: string // 子任务类型
    taskid: number // 当前任务 TaskId
    what: string // 信息类型
    details: any // 信息详情
    uuid: string // 设备唯一码
  }
}

type CallbackData =
  | Callback.InternalError
  | Callback.InitFailed
  | Callback.ConnectionInfo
  | Callback.AllTasksCompleted
  | Callback.TaskChainStart
  | Callback.TaskChainCompleted
  | Callback.TaskChainError
  | Callback.TaskChainExtraInfo
  | Callback.SubTaskStart
  | Callback.SubTaskComplete
  | Callback.SubTaskError
  | Callback.SubTaskExtraInfo

interface Callback {
  code: import('@common/enum/callback').AsstMsg
  data: CallbackData
  customArgs: string | number | object
}
