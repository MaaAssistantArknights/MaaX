import path from 'path'
import fs from 'fs'
import CoreLoader from '@main/coreLoader'
import { ipcMainHandle, ipcMainRemove } from '@main/utils/ipc-main'
import logger from '@main/utils/logger'

const core = new CoreLoader()

const asstHooks: Record<
string,
(event: import('electron').IpcMainInvokeEvent, ...args: any[]) => Promise<any>
> = {
  'main.CoreLoader:loadResource': async (_event, arg) => {
    return core.LoadResource(arg.path) ?? false
  },
  'main.CoreLoader:create': async (_event, _arg) => {
    return core.Create() ?? false
  },
  'main.CoreLoader:createEx': async (_event, arg) => {
    return core.CreateEx(arg.address)
  },
  'main.CoreLoader:destroy': async (_event, arg) => {
    core.Destroy(arg.uuid)
    return true
  },
  'main.CoreLoader:connect': async (_event, arg) => {
    return core.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  'main.CoreLoader:initCore': async (_event, arg) => {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) console.log(`重复创建 ${JSON.stringify(arg)}`)

    return core.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  'main.CoreLoader:disconnectAndDestroy': async (_event, arg) => {
    core.Stop(arg.uuid)
    core.Destroy(arg.uuid)
    return true
  },

  'main.CoreLoader:appendTask': async (_event, arg) => {
    return core.AppendTask(
      arg.uuid,
      arg.type,
      JSON.stringify(arg.params)
    )
  },
  'main.CoreLoader:setTaskParams': async (_event, arg) => {
    return core.SetTaskParams(arg.uuid, arg.task_id, JSON.stringify(arg.params))
  },
  'main.CoreLoader:start': async (_event, arg) => {
    return core.Start(arg.uuid)
  },
  'main.CoreLoader:stop': async (_event, arg) => {
    return core.Stop(arg.uuid)
  },
  'main.CoreLoader:supportedStages': async (_event) => {
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
  'main.CoreLoader:getImage': async (_event, arg) => {
    return core.GetImage(arg.uuid)
  },
  'main.CoreLoader:getExtraRoguePath': async (_event, arg) => {
    return core.GetExtraRogueConfigPath()
  },
  'main.CoreLoader:getLibPath': async (_event, arg) => {
    return core.libPath
  }
}

export default function useAsstHooks (): void {
  ipcMainHandle('main.CoreLoader:load', (_event) => {
    core.load()
    if (!core.loadStatus) {
      return false
    }
    for (const eventName of Object.keys(asstHooks)) {
      try {
        ipcMainHandle(eventName as IpcMainHandleEvent, asstHooks[eventName])
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
