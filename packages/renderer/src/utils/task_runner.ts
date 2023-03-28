import logger from '@/hooks/caller/logger'
import useTaskStore from '@/store/tasks'
import { TaskChainMap } from '@common/enum/callback'
import { show } from './message'
import { convertToCoreTaskConfiguration } from './task_helper'

let selfIncreasedId = 1000000
const genUiTaskId = (): number => { selfIncreasedId += 1; return selfIncreasedId }

export async function runStartEmulator (uuid: string, task: Task): Promise<void> {
  const taskStore = useTaskStore()
  task.task_id = genUiTaskId()
  // 不await
  taskStore.updateTaskStatus(uuid, task.task_id, 'processing', 0)
  window.ipcRenderer.invoke('main.DeviceDetector:startEmulator', task.configurations.commandLine)
}

async function runTaskEmulator (uuid: string, task: Task): Promise<void> {
  const taskStore = useTaskStore()
  task.task_id = genUiTaskId()
  taskStore.updateTaskStatus(uuid, task.task_id, 'processing', 0)
  window.ipcRenderer.invoke('main.DeviceDetector:startEmulator', task.configurations.commandLine)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  task.schedule_id = setTimeout(async () => {
    const devices: any[] = await window.ipcRenderer.invoke(
      'main.DeviceDetector:getEmulators'
    ) // 等待时间结束后进行一次设备搜索，但不合并结果
    const device = devices.find((device) => device.uuid === uuid) // 检查指定uuid的设备是否存在
    if (device) {
      // 设备活了
      logger.silly('Emulator is alive', uuid)
      const status = await window.ipcRenderer.invoke('main.CoreLoader:initCore', {
        // 创建连接
        address: device.address,
        uuid: device.uuid,
        adb_path: device.adbPath,
        config: device.config
      })
      if (status) {
        taskStore.updateTaskStatus(uuid, task.task_id, 'success', 0)
        logger.silly('Emulator is alive and connected', uuid)
        await runTasks(uuid) // 继续执行剩下的任务
      } else {
        taskStore.updateTaskStatus(uuid, task.task_id, 'exception', 0)
        logger.warn('Emulator is alive but failed to connect', uuid)
        show('检测到设备, 但连接失败', {
          type: 'error',
          duration: 0,
          closable: true
        })
      }
    } else {
      // 设备没活
      taskStore.updateTaskStatus(uuid, task.task_id, 'exception', 0)
      show('启动设备失败', {
        type: 'error',
        duration: 0,
        closable: true
      })
    }
  }, 10000)
}

async function runTaskShutdown (uuid: string, task: Task): Promise<void> {
  const taskStore = useTaskStore()
  // TODO
}

async function runTaskIdle (uuid: string, task: Task): Promise<void> {
  const taskStore = useTaskStore()
  task.task_id = genUiTaskId()
  taskStore.updateTaskStatus(uuid, task.task_id, 'processing', 0)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  task.schedule_id = setTimeout(async () => {
    taskStore.updateTaskStatus(uuid, task.task_id, 'success', 0)
    await runTasks(uuid)
  }, task.configurations.delay as number * 1000)
}

export async function runTasks (uuid: string): Promise<void> {
  const taskStore = useTaskStore()
  const tasks = taskStore.deviceTasks[uuid]
  // 寻找第一个可用的任务
  const task = tasks?.find((task) => task.enable && task.status === 'idle')
  if (task) {
    switch (task.name) {
      case 'emulator': {
        runTaskEmulator(uuid, task)
        break
      }
      case 'shutdown': {
        break
      }
      case 'idle': {
        await runTaskIdle(uuid, task)
        break
      }
      default: { // default -> core tasks
        task.status = 'waiting'
        const taskId = await window.ipcRenderer.invoke(
          'main.CoreLoader:appendTask',
          {
            uuid: uuid,
            type: TaskChainMap[task.name],
            params: convertToCoreTaskConfiguration(task)
          }
        )
        if (taskId !== 0) {
          task.task_id = taskId
        }
        await runTasks(uuid)
        break
      }
    }
  }
}
