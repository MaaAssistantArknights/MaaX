import useTaskStore from '@/store/tasks'
import { TaskChainMap } from '@common/enum/callback'
import { convertToCoreTaskConfiguration } from './task_helper'

let selfIncreasedId = 1000000
const genUiTaskId = (): number => { selfIncreasedId += 1; return selfIncreasedId }

export async function runStartEmulator (uuid: string, task: Task): Promise<void> {
  const taskStore = useTaskStore()
  task.task_id = genUiTaskId()
  await window.ipcRenderer.invoke('main.DeviceDetector:startEmulator', task.configurations.commandLine)
  taskStore.updateTaskStatus(uuid, task.task_id, 'processing', 0)
}

export async function runTasks (uuid: string): Promise<void> {
  const taskStore = useTaskStore()
  const tasks = taskStore.deviceTasks[uuid]
  if (tasks) {
    for (const task of tasks) {
      if (task.name === 'emulator') {
        // TODO
      } else if (task.name === 'shutdown') {
        // TODO
      } else {
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
      }
    }
  }
}
