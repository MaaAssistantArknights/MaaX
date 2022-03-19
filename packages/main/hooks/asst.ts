import Electron, { ipcMain } from "electron";
import { Assistant } from "./interface";

const asstHooks: Record<
  string,
  (event: Electron.IpcMainEvent, ...args: any[]) => void
> = {
  "asst:loadResource": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.LoadResource(arg.path);
  },
  "asst:create": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.Create();
  },
  "asst:createEx": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.CreateEx(arg.address);
  },
  "asst:destroy": (event, arg) => {
    Assistant.getInstance()?.Destroy(arg.uuid);
    event.returnValue = true;
  },
  "asst:connect": async (event, arg) => {
    event.returnValue = Assistant.getInstance()?.Connect(
      arg.address,
      arg.adb_path,
      arg.config
    );
  },
  "asst:appendTask": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.AppendTask(
      arg.uuid,
      arg.type,
      JSON.stringify(arg.params)
    );
  },
  "asst:start": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.Start(arg.uuid);
  },
  "asst:stop": (event, arg) => {
    event.returnValue = Assistant.getInstance()?.Stop(arg.uuid);
  },
  "asst:setUUID": (event, arg) => {
    Assistant.getInstance()?.SetUUID(arg.address, arg.uuid);
    event.returnValue = true;
  },
};

export default function useAsstHooks() {
  ipcMain.on("asst:load", (event) => {
    const asst = Assistant.getInstance();
    if (!asst) {
      event.returnValue = false;
      return;
    }
    for (const eventName of Object.keys(asstHooks)) {
      ipcMain.on(eventName, asstHooks[eventName]);
    }
    event.returnValue = true;
  });

  ipcMain.on("asst:dispose", (event) => {
    Assistant.dispose();
    for (const eventName of Object.keys(asstHooks)) {
      ipcMain.off(eventName, asstHooks[eventName]);
    }
    event.returnValue = void 0;
  });
}

/**  
  export default function useAsstHooks() {
  ipcMain.on("asst:appendStartUp", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendStartUp(arg.uuid);
  });

  ipcMain.on("asst:AppendFight", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendFight(
      arg.stage,
      arg.max_mecidine,
      arg.number,
      arg.max_times,
      arg.uuid
    );
  });

  ipcMain.on("asst:appendAward", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendAward(arg.uuid);
  });

  ipcMain.on("asst:appendVisit", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendVisit(arg.uuid);
  });

  ipcMain.on("asst:appendMall", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendMall(
      arg.with_shopping,
      arg.uuid
    );
  });

  ipcMain.on("asst:appendInfrast", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendInfrast(
      arg.work_mode,
      arg.order,
      arg.order_size,
      arg.uses_of_drones,
      arg.dorm_threshold,
      arg.uuid
    );
  });

  ipcMain.on("asst:appendRecruit", (event, arg) => {
    event.returnValue = Assistant.getInstance().AppendRecruit(
      arg.max_times,
      arg.select_level,
      arg.select_len,
      arg.confirm_level,
      arg.confirm_len,
      arg.need_refresh,
      arg.uuid
    );
  });

  //ipcMain.on("asst:appendRoguelike")
  //ipcMain.on("asst:appendDebug")
  //ipcMain.on("asst:startRecruitCalc")


  //ipcMain.on("asst:setPenguinId")
  //ipcMain.on("asst:getImage")
  //ipcMain.on("asst:ctrlerClick")
  //ipcMain.on("asst:Log")
// }

*/