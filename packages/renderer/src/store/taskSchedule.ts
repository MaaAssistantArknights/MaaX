import { defineStore } from 'pinia'
import _ from 'lodash'
import logger from '@/hooks/caller/logger'
import type { TaskGroup, TaskGroups } from '@type/task'
import type { TaskScheduleGroups, TaskScheduleGroup, TaskScheduleItem } from '@type/scheduleManager'
import type { UUID } from '@type/misc'
import ScheduleManager from '@/utils/scheduleManager'

export interface TaskScheduleState {
  scheduleList: Record<UUID, TaskScheduleGroups>
}

export interface TaskScheduleAction {
  getCurrentScheduleGroup: (uuid: UUID) => TaskScheduleGroup | undefined
  getScheduleGroup: (uuid: UUID, groupId: number) => TaskScheduleGroup | undefined
  newScheduleGroup: (uuid: UUID) => void
  init(uuid: UUID): void
  addScheduleItem(uuid: UUID, groupId: number, item: TaskScheduleItem): void
  run(uuid: UUID, groupId: number): void
  // runSingle(uuid: UUID, groupId: number, index: number): void
  stop(uuid: UUID, groupId: number): void
}

const useTaskScheduleStore = defineStore<'taskSchedule', TaskScheduleState, {}, TaskScheduleAction>(
  'taskSchedule',
  {
    state: () => {
      return {
        scheduleList: {},
      }
    },
    actions: {
      getCurrentScheduleGroup(uuid) {
        const origin = this.scheduleList[uuid]
        return origin?.groups.find(group => group.id === origin.currentId)
      },
      getScheduleGroup(uuid, groupId) {
        const origin = this.scheduleList[uuid]
        return origin?.groups.find(group => group.id === groupId)
      },
      newScheduleGroup(uuid) {
        const origin = this.scheduleList[uuid]
        let group_id = 1
        if (origin) {
          group_id = Math.max(...origin.groups.map(group => group.id), 1) + 1
        } else {
          this.init(uuid)
        }
        const newScheduleGroup: TaskScheduleGroup = {
          id: group_id,
          name: `New Schedule #${group_id}`,
          schedules: [],
        }
        origin.currentId = group_id
        origin.groups.push(newScheduleGroup)
      },
      init(uuid) {
        logger.info(`[init] init task schedule for uuid: ${uuid}`)
        this.scheduleList[uuid] = {
          currentId: 1,
          groups: [{ id: 1, name: 'New Schedule #1', schedules: [] }],
        }
      },
      addScheduleItem(uuid, groupId, item) {
        const origin = this.getScheduleGroup(uuid, groupId)
        if (!origin) {
          logger.error(
            `[addScheduleItem] schedule group not found, uuid: ${uuid}, groupId: ${groupId}`
          )
          return
        }
        origin.schedules.push(item)
      },
      run(uuid, groupId) {
        const scheduleManager = new ScheduleManager()
        const origin = this.getScheduleGroup(uuid, groupId)
        if (!origin) {
          logger.error(`[run] schedule group not found, uuid: ${uuid}, groupId: ${groupId}`)
          return
        }
        for (const schedule of origin.schedules) {
          if (schedule.type === 'precise') {
            const id = scheduleManager.registPrecise(schedule.executeAt, () => {
              /** TODO: 修改runTasks逻辑 */
            })
          }
        }
      },
      stop(uuid, groupId) {},
    },
  }
)

export default useTaskScheduleStore
