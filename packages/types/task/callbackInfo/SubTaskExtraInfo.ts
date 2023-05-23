import type {
  RecruitTag,
  OneToSix,
  Facility,
  DepotResult,
  Depot_ArkPlanner,
  Depot_Lolicon,
} from '@type/game'
import type { CoreTaskName } from '../mapper'

type DropType = 'NORMAL_DROP' | 'SPECIAL_DROP' | 'EXTRA_DROP' | 'FURNITURE'

export type SubTaskExtraInfoMapper = {
  StageDrops: {
    drops: {
      itemId: string
      quantity: number
      itemName: string
      // TODO: 此处根据原来的用法分析得来
      dropType: DropType // | 其它未知类型
    }[]
    stage: {
      stageCode: string
      stageId: string
    }
    stars: 0 | 1 | 3
    stats: {
      itemId: string
      itemName: string
      quantity: number
      addQuantity: number
      // dropType: DropType | '/* 其它未知类型 */' ?
    }[]
  }
  RecruitTagsDetected: {
    tags: RecruitTag[]
  }
  RecruitSpecialTag: {
    tag: RecruitTag
  }
  RecruitResult: {
    tags: RecruitTag[]
    level: OneToSix
    result: {
      tags: RecruitTag[]
      level: OneToSix
      opers: {
        name: string
        level: OneToSix
      }[]
    }[]
  }
  RecruitTagsRefreshed: {
    count: number
    refresh_limit: number
  }
  RecruitTagsSelected: {
    tags: RecruitTag[]
  }
  RecruitSlotCompleted: {}
  RecruitError: {}
  EnterFacility: {
    facility: Facility
    index: number
  }
  NotEnoughStaff: {
    facility: Facility
    index: number
  }
  ProductOfFacility: {
    product: string // TODO
    facility: Facility
    index: number
  }
  StageInfo: {
    name: string
  }
  StageInfoError: {}
  PenguinId: {
    id: string
  }
  DepotInfo: {
    done: boolean
    arkplanner: DepotResult<Depot_ArkPlanner>
    lolicon: DepotResult<Depot_Lolicon>
  }
  OperBox: {
    done: boolean
    all_oper: {
      id: string
      name: string
      own: boolean
      rarity: OneToSix
    }[]
    own_opers: {
      id: string
      name: string
      own: boolean
      elite: 0 | 1 | 2
      level: number
      potential: number // TODO: 根据之后决定到底是0-5还是1-6
      rarity: OneToSix
    }[]
  }
  UnsupportedLevel: {}
}

type SubTaskExtraInfoWhat = keyof SubTaskExtraInfoMapper

type SubTaskExtraInfoCallbackTemplate<What extends SubTaskExtraInfoWhat> = {
  taskchain: CoreTaskName //虽然其实和what有关系, 但是好像没必要去限定
  class: string
  taskid: number // 看用法上有, 但是文档里面没有
  what: What
  details: SubTaskExtraInfoMapper[What]
  uuid: string
}

export type SubTaskExtraInfoCallbackGenerator<
  Whats extends SubTaskExtraInfoWhat = SubTaskExtraInfoWhat
> = Whats extends unknown ? SubTaskExtraInfoCallbackTemplate<Whats> : never
