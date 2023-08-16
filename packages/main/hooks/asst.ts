import path from 'path'
import fs from 'fs'
import CoreLoader from '@main/coreLoader'
import logger from '@main/utils/logger'
import type { IpcMainHandleEventCalleeProxy } from '@type/ipc'

const core = new CoreLoader()

const hooks: IpcMainHandleEventCalleeProxy['CoreLoader'] = {
  loadResource({ path }) {
    return !!core.LoadResource(path) ?? false
  },
  create() {
    return core.Create() ?? false
  },
  createEx({ address }) {
    return core.CreateEx(address)
  },
  destroy({ uuid }) {
    core.Destroy(uuid)
    return true
  },
  connect({ address, uuid, adb_path, config }) {
    return core.Connect(address, uuid, adb_path, config)
  },
  /** @Deprecated */
  initCore(arg) {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) logger.warn(`重复创建 ${JSON.stringify(arg)}`)
    if (!core.SetTouchMode(arg.uuid, arg.touch_mode))
      logger.warn('Set touch mode failed', arg.touch_mode)
    return core.Connect(arg.address, arg.uuid, arg.adb_path, arg.config)
  },
  initCoreAsync(arg) {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) logger.warn(`重复创建 ${JSON.stringify(arg)}`)
    if (!core.SetTouchMode(arg.uuid, arg.touch_mode))
      logger.warn('Set touch mode failed', arg.touch_mode)
    return core.AsyncConnect(arg.address, arg.uuid, arg.adb_path, arg.config)
  },
  disconnectAndDestroy({ uuid }) {
    core.Stop(uuid)
    core.Destroy(uuid)
    return true
  },
  appendTask({ uuid, type, params }) {
    return core.AppendTask(uuid, type, JSON.stringify(params))
  },
  setTaskParams({ uuid, task_id, params }) {
    return core.SetTaskParams(uuid, task_id, JSON.stringify(params))
  },
  start({ uuid }) {
    return core.Start(uuid)
  },
  stop({ uuid }) {
    return core.Stop(uuid)
  },
  supportedStages() {
    if (!core.loadStatus) {
      logger.silly('core unloaded, return empty supported stages')
      return []
    }
    const jsonPath = path.join(core.libPath, 'resource/tasks.json')
    const tasks = JSON.parse(String(fs.readFileSync(jsonPath)))
    const stages = Object.keys(tasks).filter(s => /[A-Z0-9]+-([A-Z0-9]+-?)?[0-9]/.test(s))
    return stages
  },
  getImage({ uuid }) {
    return core.GetImage(uuid)
  },
  getLibPath() {
    return core.libPath
  },
  changeTouchMode({ mode }) {
    return core.ChangeTouchMode(mode)
  },
  asyncScreencap({ uuid }) {
    core.AsyncScreencap(uuid)
  },
  isCoreInited({ uuid }) {
    return core.IsCoreInited(uuid)
  },
}

export default function useAsstHooks(): void {
  globalThis.main.CoreLoader = {
    async upgrade() {
      return await core.Upgrade()
    },
    load() {
      core.load()
      if (!core.loadStatus) {
        return false
      }
      globalThis.main.CoreLoader = hooks
      return true
    },
    dispose() {
      for (const eventName of Object.keys(hooks)) {
        delete globalThis.main.CoreLoader[eventName as keyof typeof hooks]
      }
      core.dispose()
    },
    async updateTaskJson({ type, data }) {
      return core.UpdateTaskJson(type, data)
    },
  }
}
