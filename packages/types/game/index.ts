export type * from './depot'
export type * from './infrast'
export type * from './recruit'
export type * from './rogue'
export * from './rogue'

export type ClientType = 'Official' | 'Bilibili' | 'txwy' | 'YoStarEN' | 'YoStarJP' | 'YoStarKR'
// 客户端资源类型, b服和官服都是CN
export type ResourceType = 'CN' | 'YoStarEN' | 'YoStarJP' | 'YoStarKR' | 'txwy'

export type Server = 'CN' | 'US' | 'JP' | 'KR'

export type OneToSix = 1 | 2 | 3 | 4 | 5 | 6
