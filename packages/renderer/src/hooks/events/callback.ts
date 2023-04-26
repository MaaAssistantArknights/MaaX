import useDeviceStore from '@/store/devices'
import useTaskStore from '@/store/tasks'
import useSettingStore from '@/store/settings'

import { showMessage } from '@/utils/message'
import { AsstMsg } from '@common/enum/callback'
import type { MessageReactive } from 'naive-ui'

import logger from '@/hooks/caller/logger'
import _ from 'lodash'

import { postDrop } from '@/api/penguin'

const messages: Record<string, MessageReactive> = {}

export default function useCallbackEvents(): void {
  const deviceStore = useDeviceStore()
  const taskStore = useTaskStore()
  const settingStore = useSettingStore()

  const subTaskFn = {
    [AsstMsg.SubTaskError]: {
      Emulator: (data: Callback.SubTaskError) => {},
      StartUp: (data: Callback.SubTaskError) => {},
      Fight: (data: Callback.SubTaskError) => {
        switch (data.subtask) {
          case 'ReportToPenguinStats': {
            const { why, taskid } = data
            logger.silly('放弃上传🐧 ', why, taskid)
          }
        }
      },
      Mall: (data: Callback.SubTaskError) => {},
      Recruit: (data: Callback.SubTaskError) => {},
      RecruitCalc: (data: Callback.SubTaskError) => {},
      Infrast: (data: Callback.SubTaskError) => {},
      Visit: (data: Callback.SubTaskError) => {},
      Roguelike: (data: Callback.SubTaskError) => {},
      Copilot: (data: Callback.SubTaskError) => {},
      Shutdown: (data: Callback.SubTaskError) => {},
      Award: (data: Callback.SubTaskError) => {},
      Debug: (data: Callback.SubTaskError) => {},
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
      Debug: (data: Callback.SubTaskStart) => {},
    },
    [AsstMsg.SubTaskCompleted]: {
      Emulator: (data: Callback.SubTaskCompleted) => {},
      StartUp: (data: Callback.SubTaskCompleted) => {},
      Fight: (data: Callback.SubTaskCompleted) => {
        switch (data.subtask) {
          case 'ReportToPenguinStats': {
            const { taskid } = data
            logger.silly('上传至企鹅物流成功 ', taskid)
            break
          }
        }
      },
      Mall: (data: Callback.SubTaskCompleted) => {},
      Recruit: (data: Callback.SubTaskCompleted) => {},
      RecruitCalc: (data: Callback.SubTaskCompleted) => {},
      Infrast: (data: Callback.SubTaskCompleted) => {},
      Visit: (data: Callback.SubTaskCompleted) => {},
      Roguelike: (data: Callback.SubTaskCompleted) => {},
      Copilot: (data: Callback.SubTaskCompleted) => {},
      Shutdown: (data: Callback.SubTaskCompleted) => {},
      Award: (data: Callback.SubTaskCompleted) => {},
      Debug: (data: Callback.SubTaskCompleted) => {},
    },
    [AsstMsg.SubTaskExtraInfo]: {
      Emulator: (data: Callback.SubTaskExtraInfo) => {},
      StartUp: (data: Callback.SubTaskExtraInfo) => {},
      Fight: (data: Callback.SubTaskExtraInfo) => {
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
            const task = taskStore.getTask(
              uuid.trim(),
              t => t.task_id === taskid
            )
            if (task) {
              const resultIndex = task.results.fightInfo.length - 1
              const vaildDropType = [
                'NORMAL_DROP',
                'SPECIAL_DROP',
                'EXTRA_DROP',
                'FURNITURE',
              ]
              if (task.configurations.report_to_penguin) {
                const drops = _.cloneDeep(details.drops)
                  .filter((drop: any) => vaildDropType.includes(drop.dropType))
                  .filter((drop: any) => !drop.itemId.includes('token'))
                  .map((drop: any) => {
                    _.unset(drop, 'itemName')
                    return drop
                  })
                const report = {
                  stageId: details.stage.stageId,
                  server: task.configurations.server as string,
                  drops,
                }
                if (drops.length > 0) {
                  postDrop(report)
                    .then(response => {
                      task.results.fightInfo[resultIndex].reported = true
                      const reportId =
                        response.headers['X-Penguin-Set-PenguinID']
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
            }
            break
          }
          case 'PenguinId': {
            settingStore.penguinReportId = data.details.id
            break
          }
        }
      },
      Mall: (data: Callback.SubTaskExtraInfo) => {},
      Recruit: (data: Callback.SubTaskExtraInfo) => {
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
          case 'RecruitRobotTag': {
            const { uuid, taskid, details } = data
            const task = taskStore.getTask(
              uuid.trim(),
              task => task.task_id === taskid
            )
            if (task && !task.configurations.skip_robot) {
              const device = deviceStore.getDevice(uuid)
              const name = device?.displayName ?? device?.address ?? uuid
              // eslint-disable-next-line no-new
              new Notification('Maa Assistant Arknights', {
                body: `${name}公招获取到高级tag${String(details.tag)}`,
              })
            }
            break
          }
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
            const task = taskStore.getTask(
              uuid.trim(),
              task => task.task_id === taskid
            )
            if (task?.results.recruits) {
              _.last<any>(task.results.recruits).selectedTags = details.tags
            }
            break
          }
          case 'RecruitTagsRefreshed': {
            const { uuid, taskid } = data
            const task = taskStore.getTask(
              uuid.trim(),
              task => task.task_id === taskid
            )
            if (task?.results.recruits) {
              _.last<any>(task.results.recruits).refreshed = true
            }
            break
          }
        }
      },
      RecruitCalc: (data: Callback.SubTaskExtraInfo) => {},
      Infrast: (data: Callback.SubTaskExtraInfo) => {
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
      Visit: (data: Callback.SubTaskExtraInfo) => {},
      Roguelike: (data: Callback.SubTaskExtraInfo) => {
        switch (data.what) {
          case 'StageInfo': {
            break
          }
          case 'StageInfoError': {
            break
          }
        }
      },
      Copilot: (data: Callback.SubTaskExtraInfo) => {
        switch (data.what) {
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
          case 'UnsupportedLevel': {
            break
          }
        }
      },
      Shutdown: (data: Callback.SubTaskExtraInfo) => {},
      Award: (data: Callback.SubTaskExtraInfo) => {},
      Debug: (data: Callback.SubTaskExtraInfo) => {},
    },
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
          messages[uuid] = showMessage(
            `${device?.displayName ?? ''}尝试重连中...`,
            {
              type: 'loading',
            }
          )
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
            showMessage(
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
      const taskStore = useTaskStore()
      deviceStore.updateDeviceStatus(data.uuid.trim(), 'connected')
      showMessage('所有任务完成了( •̀ ω •́ )✧', { type: 'info' })
      // eslint-disable-next-line no-new
      new Notification('Maa Assistant Arknights', {
        body: '所有任务完成了( •̀ ω •́ )✧',
      })
      taskStore.resetToIdle(data.uuid.trim())
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
      const task = taskStore.getTask(
        data.uuid.trim(),
        task => task.task_id === data.taskid
      )
      if (task) {
        const status: TaskStatus = task.enable ? 'success' : 'skipped'
        taskStore.updateTaskStatus(data.uuid.trim(), data.taskid, status, 0)
      }
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
    },
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
