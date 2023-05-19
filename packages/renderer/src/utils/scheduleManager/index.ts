import { Singleton } from '@common/function/singletonDecorator'
import type { Module } from '@type/misc'
import logger from '@/hooks/caller/logger'

@Singleton
export default class ScheduleManager implements Module {
  private _timer_list: Record<number, NodeJS.Timeout> = {}
  private _schedule_id = 1

  constructor() {}

  private generateScheduleId(): number {
    return this._schedule_id++
  }

  private recordSchedule(id: number, timer: NodeJS.Timeout): void {
    this._timer_list[id] = timer
  }

  public get name(): string {
    return 'scheduleManager'
  }
  public get version(): string {
    return '1.0.0'
  }

  public cancel(id: number): void {
    const timer = this._timer_list[id]
    if (!timer) {
      logger.warn(`[ScheduleManager] timer not found, id: ${id}`)
      return
    }
    clearTimeout(timer)
    delete this._timer_list[id]
  }

  public registPrecise(startTime: number, callback: Function): number {
    const delay = startTime - Date.now()
    if (delay < 0) {
      logger.warn(
        `[ScheduleManager | registPrecise] startTime is in the past, startTime: ${startTime} delay: ${delay}`
      )
      return -1
    }

    const timer = setTimeout(callback(), (startTime - Date.now()) * 1000)
    const id = this.generateScheduleId()
    this.recordSchedule(id, timer)
    return id
  }

  public registInterval(
    startTime: number,
    interval: number,
    repeat: boolean,
    callback: Function
  ): number {
    const scheduleId = this.generateScheduleId()
    const delay = startTime - Date.now()
    if (delay < 0) {
      logger.warn(
        `[ScheduleManager | registeInterval] startTime is in the past, startTime: ${startTime} delay: ${delay}`
      )
      return -1
    }

    const intervalTimer = setInterval(() => {
      callback()
      if (!repeat) {
        clearInterval(intervalTimer)
      } else {
        this.recordSchedule(scheduleId, intervalTimer)
      }
    }, interval * 1000)

    const timer = setTimeout(() => {
      callback()
      if (repeat) {
        this.recordSchedule(scheduleId, intervalTimer)
      } else {
        clearInterval(intervalTimer)
      }
    }, delay * 1000)

    this.recordSchedule(scheduleId, timer)
    return scheduleId
  }
}
