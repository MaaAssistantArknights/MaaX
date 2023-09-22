import type { ComponentType } from '@type/componentManager'

export function moveComponentBaseDir(dir: string) {
  return window.main.Util.moveComponentBaseDir(dir)
}

export async function removeComponent(component: ComponentType) {
  await window.main.Util.removeComponent(component)
}
