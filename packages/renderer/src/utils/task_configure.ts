/**
 * 比对新任务配置是否兼容旧的
 * @param oldTask 旧任务配置
 * @param newTask 新任务配置
 * @returns 是否兼容
 */
export default function compareObjKey (oldTask: object, newTask: object): boolean {
  for (const key in newTask) {
    if (!Object.prototype.hasOwnProperty.call(oldTask, key)) {
      return false
    }
  }
  return true
}
