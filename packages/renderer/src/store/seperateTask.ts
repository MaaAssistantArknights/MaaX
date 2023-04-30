import type { CallbackMapper, SubTaskRelatedMsg } from '@type/task/callback'
import { defineStore } from 'pinia'

type Handler = <M extends SubTaskRelatedMsg>(msg: M, data: CallbackMapper[M]) => boolean

export const useSeperateTaskStore = defineStore('seperate-task', () => {
  const handlers: Partial<Record<string, Handler>> = {}
  const maybeUnfinish: Set<string> = new Set()

  function register(uuid: string, taskId: number, handler: Handler): Handler {
    const key = `${uuid}:${taskId}`
    handlers[key] = handler
    maybeUnfinish.add(key)
    return handler
  }

  function unregister(uuid: string, taskId: number, handler: Handler) {
    const key = `${uuid}:${taskId}`
    if (key in handler) {
      delete handlers[key]
    }
  }

  function checkFilter<M extends SubTaskRelatedMsg>(msg: M, data: CallbackMapper[M]) {
    const handler = handlers[`${data.uuid}:${data.taskid}`]
    if (handler?.(msg, data)) {
      return true
    }
    return false
  }

  function checkTasksFin(uuid: string, tasks: number[]) {
    const key = `${uuid}:${tasks[0]}`
    if (tasks.length === 1 && maybeUnfinish.has(key)) {
      maybeUnfinish.delete(key)
      return true
    }
    return false
  }

  return {
    register,
    unregister,
    checkFilter,
    checkTasksFin,
  }
})
