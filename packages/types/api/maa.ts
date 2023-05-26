export type Platform = 'windows' | 'macos' | 'linux' | 'noPlatform'
export type Arch = 'x64' | 'arm64' | 'noArch'
export type Component = 'MaaCore'

export interface Resource {
  file_name: string
  path: string
  hash: string
}

export interface DownloadUrl {
  version: string
  platform: string
  arch: string
  url: string
  hash: string
}

export interface VersionMetadata {
  publish_time: string
  version: string
}

export interface VersionDetail {
  publish_time: string
  version: string
  update_log: string
  resources: Resource[]
}

export type GameServers = 'cn' | 'us' | 'jp' | 'kr'
export type GameLocales = 'zh' | 'en' | 'ja' | 'ko'
export type StageType = 'MAIN' | 'SUB' | 'ACTIVITY' | 'DAILY'
export type ZoneType = 'MAINLINE'
export type DiffGroupType = 'NONE' | 'NORMAL' | 'EASY' | 'TOUGH' | 'ALL'
export type DifficultyType = 'NORMAL' | 'FOUR_STAR'

export interface StageMetadata {
  stage_id: string
  stage_type: StageType
  stage_code: string
  stage_ap_cost: number
}

export interface Zone {
  zoneID: string
  zoneIndex: number
  type: ZoneType
  zoneNameFirst: string
  zoneNameSecond: string
  zoneNameTitleCurrent: string
  zoneNameTitleUnCurrent: string
  zoneNameTitleEx: string
  zoneNameThird: string
  lockedText: string
  canPreview: boolean
}

export interface Stage {
  stageType: StageType
  difficulty: DifficultyType
  performanceStageFlag: string
  diffGroup: DiffGroupType
  stageId: string
  levelId: string
  zoneId: string
  code: string
  name: string
  description: string
  hardStagedId: string
  dangerLevel: string
  dangerPoint: number
  loadingPicId: string
  canPractice: string
  canBattleReplay: string
  apCost: number
  apFailReturn: number
  etItemId: string | null
  etCost: number
  etFailReturn: number
  apProtectTimes: number
  diamondOnceDrop: number
  practiceTicketCost: number
  dailyStageDifficulty: number
  expGain: number
  goldGain: number
  loseExpGain: number
}

export interface Item {
  category: string[]
  description: string
  itemId: string
  image: string
  name: string
  obtainApproach: string
  rarity: number
  usage: string
  stageDropList?: Array<{
    stageId: string
    occPer: string
  }>
}
