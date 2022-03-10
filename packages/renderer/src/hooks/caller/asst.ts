export default {
  load: () => window.ipcRenderer.sendSync("asst:load") as boolean,
  dispose: () => window.ipcRenderer.send("asst:dispose") as void,
};
