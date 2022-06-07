import ffi from 'ffi-napi'
import ref from 'ref-napi'
import logger from '@main/utils/logger'
import { ipcMainSend } from '@main/utils/ipc-main'

enum AsstMsg {
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

const taskChainTranslate: Record<string, string> = {
  StartUp: 'startup',
  Fight: 'fight',
  Recruit: 'recruit',
  Infrast: 'infrast',
  Visit: 'visit',
  Mall: 'mall',
  Award: 'award',
  Roguelike: 'rogue'
}

const callbackParse: taskchainProps = {
  [AsstMsg.InternalError]: (msg, detail): object => {
    return { name: msg, data: {} }
  },
  [AsstMsg.InitFailed]: (msg, detail): object => {
    return { name: msg, data: { uuid: detail.uuid } }
  },
  [AsstMsg.ConnectionInfo]: (msg, detail): object => {
    return {
      name: detail.what === 'UuidGetted' ? 'UuidGetted' : 'ConnectFailed',
      data: {
        address: detail.details.address,
        ...{ UuidGetted: { uuid: detail.details.uuid }, ConnectFailed: {} }[
          detail.what
        ]
      }
    }
  },
  [AsstMsg.AllTasksCompleted]: (msg, detail): object => {
    return { name: msg, data: { uuid: detail.uuid } }
  },
  [AsstMsg.TaskChainError]: (msg, detail): object => {
    return {
      name: msg,
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainStart]: (msg, detail): object => {
    return {
      name: msg,
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainCompleted]: (msg, detail): object => {
    return {
      name: msg,
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainExtraInfo]: (msg, detail): object => {
    return { name: msg, data: {} }
  },
  [AsstMsg.SubTaskError]: (msg, detail): object => {
    return { name: `${detail.taskchain}:${detail.details.task}`, data: {} }
  },
  [AsstMsg.SubTaskStart]: (msg, detail): object => {
    console.log(`CALL: ${detail.taskchain}:Start:${detail.details.task}`)
    return {
      name: `${detail.taskchain}:Start:${detail.details.task}`,
      data: {
        execTimes: detail.details.exec_times,
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.SubTaskCompleted]: (msg, detail): object => {
    console.log(`CALL: ${detail.taskchain}:Completed:${detail.details.task}`)
    return {
      name: `${detail.taskchain}:Completed:${detail.details.task}`,
      data: { ...detail }
    }
  },
  [AsstMsg.SubTaskExtraInfo]: (msg, detail): object => {
    console.log(`CALL: ${detail.taskchain}:Extra:${detail.what}`)
    return {
      name: `${detail.taskchain}:Extra:${detail.what}`,
      data: { ...detail }
    }
  }
}

const callbackHandle = ffi.Callback(
  'void',
  ['int', 'string', ref.refType(ref.types.void)],
  (_msg, _detail, _customArgs) => {
    const msg: number = _msg as unknown as number
    const detail = JSON.parse(_detail as string)
    logger.debug(_msg)
    logger.debug(_detail)
    const callback = callbackParse[msg as AsstMsg](msg, detail)
    ipcMainSend('renderer.CoreLoader:callback', callback)

    // ipcMainSend((callback as any).name.toString(), callback)

    // new WindowManager().getWindow().webContents.send(
    //   (callback as any).name.toString(),
    //   callback
    // )
  }
)

export default callbackHandle
