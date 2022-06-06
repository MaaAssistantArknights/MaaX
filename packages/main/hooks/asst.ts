import { ipcMain } from 'electron'
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
  'main.CoreLoader:createEx_connect': async (_event, arg) => {
    const createStatus = core.CreateEx(arg.uuid) ?? false
    if (!createStatus) console.log(`重复创建 ${JSON.stringify(arg)}`)
    return core.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    )
  },
  'main.CoreLoader:disconnect_destroy': async (_event, arg) => {
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
      logger.debug('core unloaded, return empty supported stages')
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
  }
}

export default function useAsstHooks (): void {
  ipcMainHandle('main.CoreLoader:load', (_event) => {
    core.load()
    if (!core.loadStatus) {
      return false
    }
    for (const eventName of Object.keys(asstHooks)) {
      ipcMainHandle(eventName as IpcMainHandleEvent, asstHooks[eventName])
    }
    return true
  })

  ipcMain.handle('main.CoreLoader:dispose', (_event) => {
    core.dispose()
    for (const eventName of Object.keys(asstHooks)) {
      ipcMainRemove(eventName as IpcMainHandleEvent)
    }
  })
}

/**
  export default function useAsstHooks() {
  ipcMain.handle("main.CoreLoader:appendStartUp", (event, arg) => {
    return Assistant.getInstance().AppendStartUp(arg.uuid);
  });

  ipcMain.handle("main.CoreLoader:AppendFight", (event, arg) => {
    return Assistant.getInstance().AppendFight(
      arg.stage,
      arg.max_medicine,
      arg.number,
      arg.max_times,
      arg.uuid
    );
  });

  ipcMain.handle("main.CoreLoader:appendAward", (event, arg) => {
    return Assistant.getInstance().AppendAward(arg.uuid);
  });

  ipcMain.handle("main.CoreLoader:appendVisit", (event, arg) => {
    return Assistant.getInstance().AppendVisit(arg.uuid);
  });

  ipcMain.handle("main.CoreLoader:appendMall", (event, arg) => {
    return Assistant.getInstance().AppendMall(
      arg.with_shopping,
      arg.uuid
    );
  });

  ipcMain.handle("main.CoreLoader:appendInfrast", (event, arg) => {
    return Assistant.getInstance().AppendInfrast(
      arg.work_mode,
      arg.order,
      arg.order_size,
      arg.uses_of_drones,
      arg.dorm_threshold,
      arg.uuid
    );
  });

  ipcMain.handle("main.CoreLoader:appendRecruit", (event, arg) => {
    return Assistant.getInstance().AppendRecruit(
      arg.max_times,
      arg.select_level,
      arg.select_len,
      arg.confirm_level,
      arg.confirm_len,
      arg.need_refresh,
      arg.uuid
    );
  });

  //ipcMain.handle("main.CoreLoader:appendRoguelike")
  //ipcMain.handle("main.CoreLoader:appendDebug")
  //ipcMain.handle("main.CoreLoader:startRecruitCalc")

  //ipcMain.handle("main.CoreLoader:setPenguinId")
  //ipcMain.handle("main.CoreLoader:getImage")
  //ipcMain.handle("main.CoreLoader:ctrlerClick")
  //ipcMain.handle("main.CoreLoader:Log")
// }

*/
