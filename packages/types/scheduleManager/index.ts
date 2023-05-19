export interface ScheduleItem {
  id: number
  timer: NodeJS.Timer
}

export enum TaskScheduleType {
  Weekly = 'weekly',
  Precise = 'precise',
}

export interface BaseTaskScheduleItem {
  enable: boolean
  taskGroupId: number
}

export interface WeeklyTaskScheduleItem extends BaseTaskScheduleItem {
  type: TaskScheduleType.Weekly
  executeAt: { dayOfWeek: number; hours: number; minutes: number; seconds: number }
  repeat: boolean
}

export interface PreciseTaskScheduleItem extends BaseTaskScheduleItem {
  type: TaskScheduleType.Precise
  executeAt: number
}

export type TaskScheduleItem = WeeklyTaskScheduleItem | PreciseTaskScheduleItem

export interface TaskScheduleGroup {
  id: number // 索引用id
  scheduleId?: number // 定时用id
  name: string
  schedules: TaskScheduleItem[]
}

export interface TaskScheduleGroups {
  currentId: number
  groups: TaskScheduleGroup[]
}
