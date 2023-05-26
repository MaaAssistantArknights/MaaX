export type StageClient = 'Official' | 'YoStarJP' | 'YoStarKR' | 'YoStarEN' | 'txwy'
export type TimeZoneCollection = {
  UtcStartTime: string
  UtcExpireTime: string
}

export interface SideStoryStageInfo {
  Display: string
  Value: string
  Drop: string
  MinimumRequired: string // 最低支持需要的core版本
  Activity: {
    Tip?: string
    StageName?: string
    UtcStartTime?: string
    UtcExpireTime?: string
    TimeZone?: number
  }
}

export interface ResourceCollectionInfo {
  Tip?: string
  UtcStartTime?: string
  UtcExpireTime?: string
  TimeZone?: number
  IsResourceCollection?: boolean
}

export type StageActivity = {
  [key in StageClient]?: {
    sideStoryStage?: SideStoryStageInfo[]
    resourceCollection?: ResourceCollectionInfo[]
  }
}
