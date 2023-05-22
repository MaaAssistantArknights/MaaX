import type { OpenDialogOptions } from 'electron'

export type InstallerStatus =
  | 'pending'
  | 'downloading'
  | 'extracting'
  | 'restart'
  | 'done'
  | 'exception'

export const enum TouchMode {
  minitouch = 'minitouch',
  maatouch = 'maatouch',
  adb = 'adb',
}

export const TouchModes = ['minitouch', 'maatouch', 'adb'] as const

export type SystemTheme = 'maa-light' | 'maa-dark'

export type Theme = SystemTheme | 'system'

export interface Module {
  readonly version: string
  readonly name: string
}

export const enum InstanceOptionKey {
  Invalid = 0,
  // 已弃用 // MinitouchEnabled = 1,   // 是否启用 minitouch
  // 开了也不代表就一定能用，有可能设备不支持等
  // "1" 开，"0" 关
  TouchMode = 2, // 触控模式设置，默认 minitouch
  // minitouch | maatouch | adb
  DeploymentWithPause = 3, // 是否暂停下干员，同时影响抄作业、肉鸽、保全
  // "1" | "0"
}

type PropertyArray = OpenDialogOptions['properties']

type CleanUndefined<T> = T extends undefined ? never : T

export type DialogProperty = CleanUndefined<PropertyArray> extends (infer T)[] ? T : never
