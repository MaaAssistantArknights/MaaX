import useDeviceStore from '@/store/devices'
import useTaskStore from '@/store/tasks'
import useSettingStore from '@/store/settings'

import { showMessage } from '@/utils/message'
import type { MessageReactive } from 'naive-ui'

import logger from '@/hooks/caller/logger'
import _ from 'lodash'

import { postDrop, type DropInfo } from '@/api/penguin'
import { useSeperateTaskStore } from '@/store/seperateTask'
import type { CoreTaskName, GetTask, TaskStatus } from '@type/task'
import {
  AsstMsg,
  type Callback,
  type CallbackMapper,
  type SubTaskRelatedMsg,
} from '@type/task/callback'

const messages: Record<string, MessageReactive> = {}

export default function useCallbackEvents(): void {
  const deviceStore = useDeviceStore()
  const taskStore = useTaskStore()
  const settingStore = useSettingStore()
  const seperateTaskStore = useSeperateTaskStore()

  const subTaskFn: {
    [key in SubTaskRelatedMsg]: Partial<Record<CoreTaskName, (data: CallbackMapper[key]) => void>>
  } = {
    [AsstMsg.SubTaskError]: {
      Fight: data => {
        switch (data.subtask) {
          case 'ReportToPenguinStats': {
            const { why, taskid } = data
            logger.silly('放弃上传🐧 ', why, taskid)
          }
        }
      },
    },
    [AsstMsg.SubTaskStart]: {},
    [AsstMsg.SubTaskCompleted]: {
      Fight: data => {
        switch (data.subtask) {
          case 'ReportToPenguinStats': {
            const { taskid } = data
            logger.silly('上传至企鹅物流成功 ', taskid)
            break
          }
        }
      },
    },
    [AsstMsg.SubTaskExtraInfo]: {
      Fight: data => {
        switch (data.what) {
          case 'StageDrops': {
            const { uuid, taskid, details } = data
            taskStore.mergeTaskResult(uuid.trim(), taskid, {
              fightInfo: [
                {
                  ...details,
                  reported: false,
                  report_error: false,
                },
              ],
            })
            // TODO: 是否也会在抄作业的时候触发?
            const task = taskStore.getTask(uuid.trim(), t => t.task_id === taskid) as
              | GetTask<'Fight'>
              | undefined
            if (task) {
              const resultIndex = task.results.fightInfo.length - 1
              const vaildDropType = ['NORMAL_DROP', 'SPECIAL_DROP', 'EXTRA_DROP', 'FURNITURE']
              if (settingStore.report_to_penguin) {
                const drops = _.cloneDeep(details.drops)
                  .filter(drop => vaildDropType.includes(drop.dropType))
                  .filter(drop => !drop.itemId.includes('token'))
                  .map(drop => {
                    _.unset(drop, 'itemName')
                    return drop
                  })
                const report = {
                  stageId: details.stage.stageId,
                  server: task.configurations.server as string,
                  drops,
                }
                postDrop(report)
                  .then(response => {
                    task.results.fightInfo[resultIndex].reported = true
                    const reportId = response.headers['x-penguin-set-penguinid']
                    if (reportId) {
                      settingStore.penguinReportId = reportId
                      if (settingStore.yituliuReportId.trim() === '') {
                        settingStore.yituliuReportId = reportId
                      }
                    }
                  })
                  .catch(error => {
                    task.results.fightInfo[resultIndex].report_error = true
                    window.$message.error('上报企鹅物流失败')
                    logger.error('上报企鹅物流失败', error)
                  })
              }
            }
            break
          }
          case 'PenguinId': {
            settingStore.penguinReportId = data.details.id
            break
          }
        }
      },
      Recruit: data => {
        switch (data.what) {
          case 'RecruitTagsDetected': {
            break
          }
          case 'RecruitSpecialTag': {
            const { uuid, details } = data
            const device = deviceStore.getDevice(uuid)
            const name = device?.displayName ?? device?.address ?? uuid
            // eslint-disable-next-line no-new
            new Notification('Maa Assistant Arknights', {
              body: `${name}公招获取到高级tag${String(details.tag)}`,
            })
            break
          }
          // case 'RecruitRobotTag': {
          //   const { uuid, taskid, details } = data
          //   const task = taskStore.getTask(
          //     uuid.trim(),
          //     task => task.task_id === taskid
          //   ) as GetTask<'Recruit'> | undefined
          //   if (task && !task.configurations.skip_robot) {
          //     const device = deviceStore.getDevice(uuid)
          //     const name = device?.displayName ?? device?.address ?? uuid
          //     // eslint-disable-next-line no-new
          //     new Notification('Maa Assistant Arknights', {
          //       body: `${name}公招获取到高级tag${String(details.tag)}`,
          //     })
          //   }
          //   break
          // }
          case 'RecruitResult': {
            const { uuid, taskid, details } = data
            taskStore.mergeTaskResult(uuid.trim(), taskid, {
              recruits: [
                {
                  ...details,
                  refreshed: false,
                  selectedTags: [],
                },
              ],
            })
            break
          }
          case 'RecruitTagsSelected': {
            const { uuid, taskid, details } = data
            const task = taskStore.getTask(uuid.trim(), task => task.task_id === taskid)
            if (task?.results.recruits) {
              _.last<any>(task.results.recruits).selectedTags = details.tags
            }
            break
          }
          case 'RecruitTagsRefreshed': {
            const { uuid, taskid } = data
            const task = taskStore.getTask(uuid.trim(), task => task.task_id === taskid)
            if (task?.results.recruits) {
              _.last<any>(task.results.recruits).refreshed = true
            }
            break
          }
        }
      },
      Infrast: data => {
        switch (data.what) {
          case 'EnterFacility': {
            break
          }
          case 'NotEnoughStaff': {
            const { uuid, taskid } = data
            taskStore.mergeTaskResult(uuid.trim(), taskid, {
              notEnoughStaff: true,
            })
            break
          }
        }
      },
      Roguelike: data => {
        switch (data.what) {
          case 'StageInfo': {
            break
          }
          case 'StageInfoError': {
            break
          }
        }
      },
      Copilot: data => {
        switch (data.what) {
          /*
          case 'BattleFormation': {
            break
          }
          case 'BattleFormationSelected': {
            break
          }
          case 'BattleAction': {
            break
          }
          case 'BattleActionDoc': {
            break
          }
          */
          case 'UnsupportedLevel': {
            break
          }
        }
      },
      Award: data => {},
      // Debug: (data) => {},
    },
    [AsstMsg.SubTaskStopped]: {},
  }

  const callbackFn: {
    [key in AsstMsg]?: (data: CallbackMapper[key]) => void
  } = {
    [AsstMsg.ConnectionInfo]: data => {
      const uuid = data.uuid.trim()
      switch (data.what) {
        case 'UuidGot': {
          break
        }
        /*
        case 'ResolutionGot': {
          break
        }
        */
        case 'Connected': {
          const device = deviceStore.getDevice(uuid)
          if (device?.status === 'waitingTask') {
            deviceStore.updateDeviceStatus(uuid, 'waitingTaskEnd')
          } else {
            deviceStore.updateDeviceStatus(uuid, 'connected')
          }
          break
        }
        case 'UnsupportedResolution': {
          showMessage('不支持这个分辨率', { type: 'error' })
          break
        }
        case 'ResolutionError': {
          showMessage('获取分辨率失败', { type: 'error' })
          break
        }
        case 'Reconnecting': {
          if (messages[uuid]) {
            messages[uuid].destroy()
          }
          const device = deviceStore.getDevice(uuid)
          messages[uuid] = showMessage(`${device?.displayName ?? ''}尝试重连中...`, {
            type: 'loading',
          })
          deviceStore.updateDeviceStatus(uuid, 'connecting')
          break
        }
        case 'Reconnected': {
          if (messages[uuid]) {
            messages[uuid].destroy()
          }
          const device = deviceStore.getDevice(uuid)
          showMessage(`${device?.displayName ?? ''}重连成功`, {
            type: 'success',
          })
          deviceStore.updateDeviceStatus(uuid, 'connected')
          break
        }
        case 'Disconnect': {
          const device = deviceStore.getDevice(uuid)
          if (device?.status === 'connecting') {
            messages[uuid]?.destroy()
            showMessage(`${device?.displayName ?? ''}重连失败`, {
              type: 'error',
            })
          } else {
            showMessage(`${device?.displayName ?? ''}已断开连接`, { type: 'info' }, true)
          }
          deviceStore.updateDeviceStatus(uuid, 'disconnected')
          break
        }
        default:
          break
      }
    },
    [AsstMsg.AllTasksCompleted]: data => {
      const deviceStore = useDeviceStore()
      const taskStore = useTaskStore()
      deviceStore.updateDeviceStatus(data.uuid.trim(), 'connected')
      if (!seperateTaskStore.checkTasksFin(data.uuid, data.finished_tasks)) {
        showMessage('所有任务完成了( •̀ ω •́ )✧', { type: 'info' })
        // eslint-disable-next-line no-new
        new Notification('Maa Assistant Arknights', {
          body: '所有任务完成了( •̀ ω •́ )✧',
        })
      }
      taskStore.resetToIdle(data.uuid.trim())
    },
    [AsstMsg.AsyncCallInfo]: data => {
      switch (data.what) {
        case 'Screencap': {
          break
          // 截图事件在组件内特殊处理
        }
      }
    },
    [AsstMsg.TaskChainError]: data => {
      const taskStore = useTaskStore()
      taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, 'exception', 0)
    },
    [AsstMsg.TaskChainStart]: data => {
      const taskStore = useTaskStore()
      taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, 'processing', 0)
    },
    [AsstMsg.TaskChainCompleted]: data => {
      const taskStore = useTaskStore()
      const task = taskStore.getTask(data.uuid.trim(), task => task.task_id === data.taskid)
      if (task) {
        const status: TaskStatus = task.enable ? 'success' : 'skipped'
        taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, status, 0)
      }
    },
    [AsstMsg.TaskChainExtraInfo]: data => {
      // TODO
    },
    [AsstMsg.SubTaskError]: data => {
      if (!seperateTaskStore.checkFilter(AsstMsg.SubTaskError, data)) {
        subTaskFn[AsstMsg.SubTaskError]?.[data.taskchain]?.(data)
      }
    },
    [AsstMsg.SubTaskStart]: data => {
      if (!seperateTaskStore.checkFilter(AsstMsg.SubTaskStart, data)) {
        subTaskFn[AsstMsg.SubTaskStart]?.[data.taskchain]?.(data)
      }
    },
    [AsstMsg.SubTaskCompleted]: data => {
      if (!seperateTaskStore.checkFilter(AsstMsg.SubTaskCompleted, data)) {
        subTaskFn[AsstMsg.SubTaskCompleted]?.[data.taskchain]?.(data)
      }
    },
    [AsstMsg.SubTaskExtraInfo]: data => {
      if (!seperateTaskStore.checkFilter(AsstMsg.SubTaskExtraInfo, data)) {
        subTaskFn[AsstMsg.SubTaskExtraInfo]?.[data.taskchain]?.(data)
      }
    },
  }

  window.ipcRenderer.on('renderer.CoreLoader:callback', (event, callback: Callback) => {
    const { code } = callback
    if (callbackFn[code]) {
      logger.debug(`[callback] handle AsstMsg:${code}:`)
      logger.debug(callback)

      // 使用函数来建立参数约束
      function dispatch<T extends keyof CallbackMapper>(c: T, d: CallbackMapper[T]) {
        callbackFn[c]?.(d)
      }

      dispatch(code, callback.data)
    } else {
      logger.debug(`[callback] unhandle AsstMsg:${code}`)
      logger.debug(callback)
    }
  })
}
