import useTaskStore from '@/store/tasks'

export default function useTaskEvents (): void {
  const taskStore = useTaskStore()
  window.ipcRenderer.on(
    'renderer.TaskManager:changeStatus',
    (
      event,
      uuid: string,
      taskId: string,
      status: TaskStatus,
      progress: number
    ) => {
      taskStore.updateTaskStatus(uuid, taskId, status, progress)
    }
  )
}
