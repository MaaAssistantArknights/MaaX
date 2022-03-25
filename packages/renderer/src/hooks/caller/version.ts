export default {
  ui: () => window.ipcRenderer.invoke("version:ui") as Promise<string>,
  core: () => window.ipcRenderer.invoke("version:core") as Promise<string | null>,
};