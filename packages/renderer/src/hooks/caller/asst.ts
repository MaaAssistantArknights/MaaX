export default {
  load: () => window.ipcRenderer.invoke("asst:load") as Promise<boolean>,
  dispose: () => window.ipcRenderer.invoke("asst:dispose") as Promise<void>,
};
