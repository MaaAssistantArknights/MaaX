export default {
  ui: () => window.ipcRenderer.sendSync('version:ui') as string,
  core: () => window.ipcRenderer.sendSync('version:core') as string | null,
};