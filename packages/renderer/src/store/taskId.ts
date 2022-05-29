// 每个任务的taskid, 用于运行期间修改
import { defineStore } from 'pinia'
import logger from '@/hooks/caller/logger'

export interface TaskIdState {
  deviceTaskId: Record<string, TaskId[]>
}

export interface TaskIdAction {
  newTaskId: (uuid: string) => void
  getTaskId: (uuid: string, taskName: string) => number[] | undefined
  updateTaskId: (uuid: string, taskName: string, id: number) => void
  removeTaskId: (uuid: string, taskName: string, id: number) => void
  onFightStart: (uuid: string, fightId: number) => void // 触发作战开始事件，更新作战等待列表
  setMedicineAndStone: (uuid: string, medicine: number, stone: number) => void // 设置上限理智药和源石数量
  useMedicineOrStone: (uuid: string, type: 'medicine' | 'stone') => void // 触发使用理智药/源石事件，将剩余所有id可用理智药数量-1
  removeAllTaskId: (uuid: string) => void
}

export const defaultTaskId: TaskId[] = [
  { name: 'startup', id: [] },
  { name: 'fight', id: [] },
  { name: 'recruit', id: [] },
  { name: 'infrast', id: [] },
  { name: 'visit', id: [] },
  { name: 'mall', id: [] },
  { name: 'award', id: [] },
  { name: 'rogue', id: [] },
  { name: 'shutdown', id: [] }
]

const useTaskIdStore = defineStore<'taskId', TaskIdState, {}, TaskIdAction>(
  'taskId',
  {
    state: () => {
      return {
        deviceTaskId: {}
      }
    },
    actions: {
      newTaskId (uuid: string) {
        const { deviceTaskId } = this
        if (!deviceTaskId[uuid]) { deviceTaskId[uuid] = defaultTaskId }
      },
      updateTaskId (uuid, taskName, id) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === taskName)
        if (task != null) {
          task.id?.push(id)
        }
      },

      removeTaskId (uuid, taskName, id) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === taskName)
        if (task != null) {
          task.id = task.id?.filter((i) => i !== id)
        }
      },

      getTaskId (uuid, taskName) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === taskName)
        if (task != null) {
          return task.id
        }
      },
      async useMedicineOrStone (uuid, type) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === 'fight')
        if (task != null) {
          if (type === 'medicine') {
            if (task.current_medicine && task.current_medicine > 0) { task.current_medicine -= 1 } else {
              if (task.current_stone && task.current_stone > 0) { task.current_stone -= 1 }
            }

            (task.id as number[]).forEach(async (id) => {
              const ret = await window.ipcRenderer.invoke(
                'asst:setTaskParams',
                {
                  uuid: uuid,
                  task_id: id,
                  params: {
                    medicine: task.current_medicine,
                    stone: task.current_stone
                  }
                }
              )
              logger.debug(
                ret
                  ? `运行期改变任务${id}的${type}数量成功`
                  : `运行期改变任务${id}的${type}数量失败`
              )
            })
          }
        }
      },

      onFightStart (uuid, fightId) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === 'fight')
        if (task != null) {
          task.id = (task.id as number[]).filter((id) => id !== fightId)
        }
      },
      setMedicineAndStone (uuid, medicine, stone) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === 'fight')
        if (task != null) {
          task.current_medicine = medicine
          task.current_stone = stone
        }
      },
      removeAllTaskId (uuid) {
        const { deviceTaskId } = this
        if (deviceTaskId[uuid]) {
          deviceTaskId[uuid].forEach((task) => { task.id = [] })
          logger.debug('removeAllTaskId on uuid: ' + uuid)
        } else {
          logger.debug('removeAllTaskId on uuid: ' + uuid + ' not found')
        }
      }
    }
  }
)

export default useTaskIdStore
