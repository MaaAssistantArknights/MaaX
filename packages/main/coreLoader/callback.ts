import ffi from 'ffi-napi'
import ref from 'ref-napi'
import logger from '@main/utils/logger'
import { ipcMainSend } from '@main/utils/ipc-main'
import _ from 'lodash'
import { AsstMsg } from '@common/enum/callback'

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
  [AsstMsg.InternalError]: (detail) => {
    return { code: 'core:InternalError', data: detail }
  },
  [AsstMsg.InitFailed]: (detail) => {
    return { code: 'core:InitFailed', data: { uuid: detail.uuid } }
  },
  [AsstMsg.ConnectionInfo]: (detail) => {
    return {
      code: detail.what,
      data: {
        address: detail.details.address,
        ...({ UuidGot: { uuid: _.trim(detail.details.uuid) }, ConnectFailed: {} }[detail.what] ?? {})
      }
    }
  },
  [AsstMsg.AllTasksCompleted]: (detail) => {
    return { code: 'core:AllTaskComplated', data: { uuid: detail.uuid } }
  },
  [AsstMsg.TaskChainError]: (detail) => {
    return {
      code: 'core:ChainError',
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainStart]: (detail) => {
    return {
      code: 'core:TaskChainStart',
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainCompleted]: (detail) => {
    return {
      code: 'core:TaskChainCompleted',
      data: {
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.TaskChainExtraInfo]: (detail) => {
    return { code: 'core:TaskChainExtraInfo', data: detail }
  },
  [AsstMsg.SubTaskError]: (detail) => {
    return { code: `${detail.taskchain}:${detail.details.task}`, data: {} }
  },
  [AsstMsg.SubTaskStart]: (detail) => {
    logger.info(`CALL: ${detail.taskchain}:Start:${detail.details.task}`)
    return {
      code: `${detail.taskchain}:Start:${detail.details.task}`,
      data: {
        execTimes: detail.details.exec_times,
        task: taskChainTranslate[detail.taskchain],
        uuid: detail.uuid
      }
    }
  },
  [AsstMsg.SubTaskCompleted]: (detail) => {
    logger.info(`CALL: ${detail.taskchain}:Completed:${detail.details.task}`)
    return {
      code: `${detail.taskchain}:Completed:${detail.details.task}`,
      data: { ...detail }
    }
  },
  [AsstMsg.SubTaskExtraInfo]: (detail) => {
    logger.info(`CALL: ${detail.taskchain}:Extra:${detail.what}`)
    return {
      code: `${detail.taskchain}:Extra:${detail.what}`,
      data: { ...detail }
    }
  }
}

const callbackHandle = ffi.Callback(
  'void',
  ['int', 'string', ref.refType(ref.types.void)],
  (code: AsstMsg, detail: string, customArgs) => {
    logger.debug(code)
    logger.debug(detail)
    ipcMainSend('renderer.CoreLoader:callback', {
      code,
      detail: JSON.parse(detail)
      // customArgs
    })
  }
)

export default callbackHandle
