export type OperatorNation =
  | 'rhodes'
  | 'kazimierz'
  | 'columbia'
  | 'laterano'
  | 'victoria'
  | 'sami'
  | 'bolivar'
  | 'iberia'
  | 'siracusa'
  | 'higashi'
  | 'sargon'
  | 'kjerag'
  | 'minos'
  | 'yan'
  | 'lungmen'
  | 'ursus'
  | 'egir'
  | 'leithanien'
  | 'rim'

export type OperatorGroup =
  | 'pinus'
  | 'blacksteel'
  | 'karlan'
  | 'sweep'
  | 'rhine'
  | 'penguin'
  | 'lgd'
  | 'glasgow'
  | 'abyssal'
  | 'dublinn'
  | 'siesta'
  | 'babel'
  | 'elite'
  | 'sui'

export type OperatorTeam =
  | 'action4'
  | 'reserve1'
  | 'reserve4'
  | 'reserve6'
  | 'student'
  | 'chiave'
  | 'rainbow'
  | 'followers'
  | 'lee'

export type OperatorTag =
  | '支援机械'
  | '治疗'
  | '支援'
  | '爆发'
  | '控场'
  | '新手'
  | '费用回复'
  | '防护'
  | '输出'
  | '生存'
  | '群攻'
  | '减速'
  | '削弱'
  | '召唤'
  | '快速复活'
  | '位移'

export type OperatorProfession = 
  | 'MEDIC'
  | 'WARRIOR'
  | 'SPECIAL'
  | 'SNIPER'
  | 'SUPPORT'
  | 'PIONEER'
  | 'TANK'
  | 'CASTER'

export type OperatorProfessionEx =
  | 'TOKEN'
  | 'TRAP'

export interface Operator {
  name: string
  description: string
  canUseGeneralPotentialItem: boolean
  canUseActivityPotentialItem: boolean
  potentialItemId: string
  activityPotentialItemId: string | null
  nationId: OperatorNation | null
  groupId: OperatorGroup | null
  teamId: OperatorTeam | null
  displayNumber: string | null
  tokenKey: string | null
  appellation: string
  position: 'MELEE' | 'RANGED' | 'ALL'
  tagList: OperatorTag[] | null
  itemUsage: string | null
  itemDesc: string | null
  itemObtainApproach: string | null
  isNotObtainable: boolean
  isSpChar: boolean
  maxPotentialLevel: 0 | 3 | 5 // 3是暴行
  rarity: 0 | 1 | 2 | 3 | 4 | 5
  profession: OperatorProfession | OperatorProfessionEx
  subProfessionId: string
  trait: null | any
  phases: any[]
  skills: any[]
  talents: null | any[]
  potentialRanks: any[]
  favorKeyFrames: null | any[]
  allSkillLvlup: any[]
}
