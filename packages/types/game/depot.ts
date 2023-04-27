// https://penguin-stats.cn/planner
export interface Depot_ArkPlanner {
  items: {
    id: string
    have: number
    name: string
  }[]
  '@type': '@penguin-statistics/depot'
}

// https://arkn.lolicon.app/#/material
export interface Depot_Lolicon {
  [key: string]: number
}

export type DepotResult<Schema> = {
  object: Schema
  data: string // JSON
}
