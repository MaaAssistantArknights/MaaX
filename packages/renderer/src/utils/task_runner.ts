import useTaskStore from '@/store/tasks'
import { TaskChainMap } from '@common/enum/callback'
import { convertToCoreTaskConfiguration } from './task_helper'

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
