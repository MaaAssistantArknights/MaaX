import Electron, { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { Assistant } from "./interface";

const asstHooks: Record<
  string,
  (event: Electron.IpcMainInvokeEvent, ...args: any[]) => void
> = {
  "asst:loadResource": async (event, arg) => {
    return Assistant.getInstance()?.LoadResource(arg.path);
  },
  "asst:create": async (event, arg) => {
    return Assistant.getInstance()?.Create();
  },
  "asst:createEx": async (event, arg) => {
    return Assistant.getInstance()?.CreateEx(arg.address);
  },
  "asst:destroy": async (event, arg) => {
    Assistant.getInstance()?.Destroy(arg.uuid);
    return true;
  },
  "asst:connect": async (event, arg) => {
    return Assistant.getInstance()?.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    );
  },
  "asst:createEx_connect": async (event, arg) => {
    const createStatus = Assistant.getInstance()?.CreateEx(arg.uuid);
    if (!createStatus) console.log(`重复创建 ${arg}`);
    return Assistant.getInstance()?.Connect(
      arg.address,
      arg.uuid,
      arg.adb_path,
      arg.config
    );
  },
  "asst:disconnect_destroy": async (event, arg) => {
    Assistant.getInstance()?.Stop(arg.uuid);
    Assistant.getInstance()?.Destroy(arg.uuid);
    return true;
  },

  "asst:appendTask": async (event, arg) => {
    return Assistant.getInstance()?.AppendTask(
      arg.uuid,
      arg.type,
      JSON.stringify(arg.params)
    );
  },
  "asst:start": async (event, arg) => {
    return Assistant.getInstance()?.Start(arg.uuid);
  },
  "asst:stop": async (event, arg) => {
    return Assistant.getInstance()?.Stop(arg.uuid);
  },
  "asst:supportedStages": async (event) => {
    if (!Assistant.getInstance()) {
      return [];
    }
    const jsonPath = path.join(Assistant.libPath, "resource/tasks.json");
    const tasks = JSON.parse(String(fs.readFileSync(jsonPath)));
    const stages = Object.keys(tasks).filter((s) =>
      /[A-Z0-9]+-([A-Z0-9]+-?)?[0-9]/.test(s)
    );
    return stages;
  },
};

export default function useAsstHooks() {
  ipcMain.handle("asst:load", (event) => {
    const asst = Assistant.getInstance();
    if (!asst) {
      return false;
    }
      for (const eventName of Object.keys(asstHooks)) {
        ipcMain.handle(eventName, asstHooks[eventName]);
      }
    return true;
  });

  ipcMain.handle("asst:dispose", (event) => {
    Assistant.dispose();
    for (const eventName of Object.keys(asstHooks)) {
      ipcMain.removeHandler(eventName);
    }
    window.sessionStorage.setItem("coreIPCLoadStatus","false");
    return void 0;
  });
}

/**  
  export default function useAsstHooks() {
  ipcMain.handle("asst:appendStartUp", (event, arg) => {
    return Assistant.getInstance().AppendStartUp(arg.uuid);
  });

  ipcMain.handle("asst:AppendFight", (event, arg) => {
    return Assistant.getInstance().AppendFight(
      arg.stage,
      arg.max_mecidine,
      arg.number,
      arg.max_times,
      arg.uuid
    );
  });

  ipcMain.handle("asst:appendAward", (event, arg) => {
    return Assistant.getInstance().AppendAward(arg.uuid);
  });

  ipcMain.handle("asst:appendVisit", (event, arg) => {
    return Assistant.getInstance().AppendVisit(arg.uuid);
  });

  ipcMain.handle("asst:appendMall", (event, arg) => {
    return Assistant.getInstance().AppendMall(
      arg.with_shopping,
      arg.uuid
    );
  });

  ipcMain.handle("asst:appendInfrast", (event, arg) => {
    return Assistant.getInstance().AppendInfrast(
      arg.work_mode,
      arg.order,
      arg.order_size,
      arg.uses_of_drones,
      arg.dorm_threshold,
      arg.uuid
    );
  });

  ipcMain.handle("asst:appendRecruit", (event, arg) => {
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

  //ipcMain.handle("asst:appendRoguelike")
  //ipcMain.handle("asst:appendDebug")
  //ipcMain.handle("asst:startRecruitCalc")


  //ipcMain.handle("asst:setPenguinId")
  //ipcMain.handle("asst:getImage")
  //ipcMain.handle("asst:ctrlerClick")
  //ipcMain.handle("asst:Log")
// }

*/
