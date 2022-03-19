export default {
  load: () => window.ipcRenderer.sendSync("asst:load") as boolean,
  dispose: () => window.ipcRenderer.sendSync("asst:dispose") as void,
};
