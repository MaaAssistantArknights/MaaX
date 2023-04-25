import path from 'path'
import fs from 'fs'
import CoreLoader from '@main/coreLoader'
import { ipcMainHandle, ipcMainRemove } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'

const core = new CoreLoader()

const asstHooks: {
  [key in keyof IpcMainHandleEventType__AutoRegister]: (
    event: import('electron').IpcMainInvokeEvent,
    ...arg: Parameters<IpcMainHandleEventType__AutoRegister[key]>
  ) => ReturnType<IpcMainHandleEventType__AutoRegister[key]>
} = {
  'main.CoreLoader:loadResource': (_event, arg) => {
    return !!core.LoadResource(arg.path) ?? false
  },
  'main.CoreLoader:create': (_event) => {
    return core.Create() ?? false
  },
  'main.CoreLoader:createEx': (_event, arg) => {
    return core.CreateEx(arg.address)
  },
  'main.CoreLoader:destroy': (_event, arg) => {
    core.Destroy(arg.uuid)
    return true
  },
  'main.CoreLoader:connect': (_event, arg) => {
    return core.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  /** @Deprecated */
  'main.CoreLoader:initCore': (_event, arg: InitCoreParam) => {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) logger.warn(`重复创建 ${JSON.stringify(arg)}`)
    if (!core.SetTouchMode(arg.uuid, arg.touch_mode)) logger.warn('Set touch mode failed', arg.touch_mode)
    return core.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  'main.CoreLoader:initCoreAsync': (_event, arg: InitCoreParam) => {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) logger.warn(`重复创建 ${JSON.stringify(arg)}`)
    if (!core.SetTouchMode(arg.uuid, arg.touch_mode)) logger.warn('Set touch mode failed', arg.touch_mode)
    return core.AsyncConnect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  'main.CoreLoader:disconnectAndDestroy': (_event, arg) => {
    core.Stop(arg.uuid)
    core.Destroy(arg.uuid)
    return true
  },

  'main.CoreLoader:appendTask': (_event, arg) => {
    return core.AppendTask(
      arg.uuid,
      arg.type,
      JSON.stringify(arg.params)
    )
  },
  'main.CoreLoader:setTaskParams': (_event, arg) => {
    return core.SetTaskParams(arg.uuid, arg.task_id, JSON.stringify(arg.params))
  },
  'main.CoreLoader:start': (_event, arg) => {
    return core.Start(arg.uuid)
  },
  'main.CoreLoader:stop': (_event, arg) => {
    return core.Stop(arg.uuid)
  },
  'main.CoreLoader:supportedStages': (_event) => {
    if (!core.loadStatus) {
      logger.silly('core unloaded, return empty supported stages')
      return []
    }
    const jsonPath = path.join(core.libPath, 'resource/tasks.json')
    const tasks = JSON.parse(String(fs.readFileSync(jsonPath)))
    const stages = Object.keys(tasks).filter((s) =>
      /[A-Z0-9]+-([A-Z0-9]+-?)?[0-9]/.test(s)
    )
    return stages
  },
  'main.CoreLoader:getImage': (_event, arg) => {
    return core.GetImage(arg.uuid)
  },
  'main.CoreLoader:getLibPath': (_event) => {
    return core.libPath
  },
  'main.CoreLoader:changeTouchMode': (_event, arg) => {
    return core.ChangeTouchMode(arg.mode)
  },
  'main.CoreLoader:asyncScreencap': (_event, arg) => {
    return core.AsyncScreencap(arg.uuid)
  }
}

export default function useAsstHooks (): void {
  ipcMainHandle('main.CoreLoader:load', (_event) => {
    core.load()
    if (!core.loadStatus) {
      return false
    }
    for (const eventName of Object.keys(asstHooks)) {
      const e = eventName as keyof IpcMainHandleEventType__AutoRegister
      try {
        // TODO: 看看怎么把类型弄过去
        // @ts-ignore
        ipcMainHandle(e, asstHooks[e])
      } catch (e) {
        logger.error('[ AsstHooks Error ] Fail to register event', eventName)
      }
    }
    return true
  })

  ipcMainHandle('main.CoreLoader:dispose', (_event) => {
    for (const eventName of Object.keys(asstHooks)) {
      ipcMainRemove(eventName as IpcMainHandleEvent)
    }
    core.dispose()
  })
}
