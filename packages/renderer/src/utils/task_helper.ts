import useSettingStore from '@/store/settings'
import type { CoreTaskName, CoreTaskObjectMapper, GetTask } from '@type/task'
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

export function convertToCoreTaskConfiguration<
  K extends CoreTaskName,
  T extends GetTask<K>
>(_name: K, task: T) {
  switch (task.name) {
    case 'Fight': {
      const settingStore = useSettingStore()
      return {
        enable: task.enable,
        penguin_id: settingStore.penguinReportId,
        yituliu_id: settingStore.yituliuReportId,
        ..._.cloneDeep(task.configurations),
        report_to_penguin: false,
      }
    }
    default:
      return {
        enable: task.enable,
        ..._.cloneDeep(task.configurations),
      }
  }
}
