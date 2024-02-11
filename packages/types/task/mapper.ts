import type {
  ClientType,
  Facility,
  MizukiSquadType,
  PhantomSquadType,
  ReclamationAlgorithmType,
  RolesType,
  Server,
} from '@type/game'

export type CoreTaskObjectMapper = {
  StartUp: {
    enable?: boolean
    client_type?: ClientType
    start_game_enabled?: boolean
  }
  CloseDown: {
    enable?: boolean
  }
  Fight: {
    enable?: boolean
    stage?: string
    medicine?: number
    expiring_medicine?: number
    stone?: number
    times?: number
    drops?: {
      [key: string]: number
    }

    report_to_penguin?: boolean
    penguin_id?: string
    server?: Server
    client_type?: ClientType
    DrGrandet?: boolean
  }
  Recruit: {
    enable?: boolean
    refresh?: boolean
    select: number[]
    confirm: number[]
    times?: number
    set_time?: boolean
    expedite?: boolean
    expedite_times?: number

    skip_robot?: boolean
    recruitment_time?: {
      [key in 3 | 4 | 5 | 6]?: number
    }

    report_to_penguin?: boolean
    penguin_id?: string
    report_to_yituliu?: boolean
    yituliu_id?: string
    server?: Server
  }
  Infrast: {
    enable?: boolean
    mode: 0 | 10000
    facility: Facility[]
    drones?:
      | '_NotUse'
      | 'Money'
      | 'SyntheticJade'
      | 'CombatRecord'
      | 'PureGold'
      | 'OriginStone'
      | 'Chip'
    threshold?: number
    replenish?: boolean

    dorm_notstationed_enabled?: boolean
    dorm_trust_enabled?: boolean
    filename: string
    plan_index: number
  }
  Mall: {
    enable?: boolean
    shopping?: boolean
    buy_first?: string[]
    blacklist?: string[]
    force_shopping_if_credit_full?: boolean
  }
  Award: {
    enable?: boolean
  }
  Roguelike: {
    enable?: boolean
    mode?: 0 | 1 | 2 // 2 is deprecated
    starts_count?: number
    investment_enabled?: boolean
    investments_count?: number
    stop_when_investment_full?: boolean
    roles?: RolesType
    core_char?: string
    use_support?: boolean
    refresh_trader_with_dice? : boolean
    use_nonfriend_support?: boolean
  } & (
    | {
        theme?: 'Phantom'
        squad?: PhantomSquadType
      }
    | {
        theme: 'Mizuki'
        squad?: MizukiSquadType
      }
  )
  Copilot: {
    enable?: boolean
    filename: string
    formation?: boolean
  }
  SSSCopilot: {
    enable?: boolean
    filename: string
    loop_times: number
  }
  Depot: {
    enable?: boolean
  }
  OperBox: {
    enable?: boolean
  }
  Custom: {
    enable?: boolean
    task_names: string[]
  }
  SingleStep: {
    enable?: boolean
  } & ({
    type: 'copilot'
  } & (
    | {
        subtask: 'stage'
        details: {
          stage: string
        }
      }
    | {
        subtask: 'start'
      }
    | {
        subtask: 'action'
        details: any // Action太复杂啦
      }
  ))
  VideoRecognition: {
    enable?: boolean
    filename: string
  }
  ReclamationAlgorithm: {
    enable?: boolean
    mode: ReclamationAlgorithmType
  }
  // Debug?
}

export type FrontTaskObjectMapper = {
  Emulator: {
    enable?: boolean
    delay: number
  }
  Shutdown: {
    enable?: boolean
    option: 'shutdownEmulator' | 'shutdownAll' | 'shutdownComputer'
    delay: number
  }
}

export type CoreTaskName = keyof CoreTaskObjectMapper
export type FrontTaskName = keyof FrontTaskObjectMapper
