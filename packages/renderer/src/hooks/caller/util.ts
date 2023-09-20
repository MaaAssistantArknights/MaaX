import type { DialogProperty } from '@type/misc'

export function openDialog(
  title: string,
  properties: DialogProperty[],
  filters: Electron.FileFilter[]
): Promise<Electron.OpenDialogReturnValue> {
  return window.main.WindowManager.openDialog(title, properties, filters)
}
