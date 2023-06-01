export const ui = async (): Promise<string> => await window.main.Util.getUiVersion()
export const core = async (): Promise<string | null> =>
  await window.main.CoreLoader.getCoreVersion()

export default {
  ui,
  core,
}
