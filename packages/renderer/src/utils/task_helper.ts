import useSettingStore from '@/store/settings'
import _ from 'lodash'

/**
 * 比对新任务配置是否兼容旧的
 * @param oldTask 旧任务配置
 * @param newTask 新任务配置
 * @returns 是否兼容
 */
export function compareObjKey(oldTask: object, newTask: object): boolean {
  for (const key in newTask) {
    if (!Object.prototype.hasOwnProperty.call(oldTask, key)) {
      return false
    }
  }
  return true
}

export function convertToCoreTaskConfiguration(task: Task): any {
  switch (task.name) {
    case 'startup': {
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
    }
    case 'fight': {
      const settingStore = useSettingStore()
      return {
        enable: task.enable,
        penguin_id: settingStore.penguinReportId,
        yituliu_id: settingStore.yituliuReportId,
        ..._.cloneDeep(task.configurations),
        report_to_penguin: false,
      }
    }
    case 'recruit': {
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
    }
    case 'infrast': {
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
    }
    case 'visit': {
      return {
        enable: task.enable,
      }
    }
    case 'mall': {
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
    }
    case 'award': {
      return {
        enable: task.enable,
      }
    }
    case 'rogue': {
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
    }
    case 'copilot': {
      return {}
    }
    default: {
      return {}
    }
  }
}
