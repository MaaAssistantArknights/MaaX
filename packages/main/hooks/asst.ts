import { app, ipcMain } from "electron";
import { Assistant, cb, voidPointer } from "./interface";
import path from "path";

Assistant.libPath = path.join(__dirname, "../../packages/main/core");

export default function useAsstHooks() {
  ipcMain.on("asst:loadResource", (event, arg) => {
    event.returnValue = Assistant.getInstance().LoadResource(arg.path);
  });

  ipcMain.on("asst:create", (event, arg) => {
    event.returnValue = Assistant.getInstance().Create();
  });

  ipcMain.on("asst:createEx", (event, arg) => {
    event.returnValue = Assistant.getInstance().CreateEx(arg.address);
  });

  ipcMain.on("asst:destroy", (event, arg) => {
    Assistant.getInstance().Destroy(arg.uuid);
    event.returnValue = true;
  });

  ipcMain.on("asst:connect", (event, arg) => {
    event.returnValue = Assistant.getInstance().Connect(
      arg.address,
      arg.adb_path,
      arg.config
    );
  });

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
  ipcMain.on("asst:start", (event, arg) => {
    event.returnValue = Assistant.getInstance().Start(arg.uuid);
  });

  ipcMain.on("asst:stop", (event, arg) => {
    event.returnValue = Assistant.getInstance().Stop(arg.uuid);
  });

  //ipcMain.on("asst:setPenguinId")
  //ipcMain.on("asst:getImage")
  //ipcMain.on("asst:ctrlerClick")
  //ipcMain.on("asst:Log")

  ipcMain.on("asst:setUUID", (event, arg) => {
    Assistant.getInstance().SetUUID(arg.address, arg.uuid);
    event.returnValue = true;
  });
}
