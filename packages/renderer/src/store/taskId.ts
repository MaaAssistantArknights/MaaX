// 每个任务的taskid, 用于运行期间修改
import { defineStore } from 'pinia'
import _ from 'lodash'
import logger from '@/hooks/caller/logger'

export interface TaskIdState {
  deviceTaskId: Record<string, TaskId[]>
}

export interface TaskIdAction {
  newTaskId: (uuid: string) => void
  getTaskId: (uuid: string, taskName: string) => number | number[] | undefined
  updateTaskId: (uuid: string, taskName: string, newId: number | number[]) => void
  appendFightId: (uuid: string, fightId: number) => void; // 添加一个新的作战id
  onFightStart: (uuid: string, fightId: number) => void; // 触发作战开始事件，更新作战等待列表
  setMedicineAndStone: (uuid: string, medicine: number, stone: number) => void; // 设置上限理智药和源石数量
  useMedicineOrStone: (uuid: string, type: 'medicine' | 'stone') => void; // 触发使用理智药/源石事件，将剩余所有id可用理智药数量-1
}

export const defaultTaskId: TaskId[] = [
  { name: 'startup' },
  { name: 'fight', id: [] },
  { name: 'recruit' },
  { name: 'infrast' },
  { name: 'visit' },
  { name: 'mall' },
  { name: 'award' },
  { name: 'rogue' }
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
      updateTaskId (uuid, taskName, newId) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === taskName)
        if (task != null) {
          task.id = newId
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
      appendFightId (uuid, fightId) {
        const { deviceTaskId } = this
        const origin = deviceTaskId[uuid]
        const task = origin?.find((task) => task.name === 'fight')
        if (task != null) {
          if (!(task.id as number[]).includes(fightId)) {
            (task.id as number[]).push(fightId)
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
      }
    }
  }
)

export default useTaskIdStore
