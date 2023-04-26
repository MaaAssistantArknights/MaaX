type TaskStatus =
  | 'idle'
  | 'waiting'
  | 'processing'
  | 'success'
  | 'warning'
  | 'skipped'
  | 'exception'
  | 'stopped'

type CoreTaskName =
  | 'StartUp'
  | 'CloseDown'
  | 'Fight'
  | 'Recruit'
  | 'Infrast'
  | 'Mall'
  | 'Award'
  | 'Roguelike'
  | 'Copilot'

type FrontTaskName = 'Emulator' | 'Shutdown' | 'Idle'

interface CoreTaskTemplate<Name extends CoreTaskName> {
  /**
   * @props 任务对应卡片名
   */
  name: Name
  /**
   * @props core传回来的task_id
   */
  task_id: number

  /**
   * @props ui 的定时器, 可以用来清除定时器
   */
  schedule_id?: NodeJS.Timeout | null
  /**
   * @props 任务title（可能为i18n字符串，i18n example: `t("task.mall")`）
   */
  title: string
  /**
   * @props 是否显示任务结果
   */
  showResult?: boolean
  /**
   * @props 任务状态
   * ---
   * @idle 空闲的，暂未进行到的，可编辑配置
   * @waiting 等待执行的
   * @processing 正在进行的
   * @success 进行完成且成功执行的
   * @warning 部分成功(子任务可能失败)
   * @exception 任务出错
   * @stopped 用户手动停止任务
   */
  status: TaskStatus
  /**
   * @props 是否启用任务
   */
  enable: boolean
  /**
   * @props 任务开始时间（时间戳，在任务开始时由Date.now()返回）
   */
  startTime?: number
  /**
   * @props 任务结束时间
   */
  endTime?: number
  /**
   * @props 任务进行进度，范围0-100
   */
  progress?: number
  /**
   * @props 任务的相关配置项
   * @example
   * [
   *   {
   *      label: 'refresh',
   *      value: true
   *   }
   * ]
   */
  configurations: Omit<
    CoreTaskObjectMap[Name],
    'enable' | 'penguin_id' | 'yituliu_id'
  >
  results: Record<string, any>
}

interface FrontTaskTemplate<Name extends FrontTaskName> {
  /**
   * @props 任务对应卡片名
   */
  name: Name
  /**
   * @props core传回来的task_id
   */
  task_id: number

  /**
   * @props ui 的定时器, 可以用来清除定时器
   */
  schedule_id?: NodeJS.Timeout | null
  /**
   * @props 任务title（可能为i18n字符串，i18n example: `t("task.mall")`）
   */
  title: string
  /**
   * @props 是否显示任务结果
   */
  showResult?: boolean
  /**
   * @props 任务状态
   * ---
   * @idle 空闲的，暂未进行到的，可编辑配置
   * @waiting 等待执行的
   * @processing 正在进行的
   * @success 进行完成且成功执行的
   * @warning 部分成功(子任务可能失败)
   * @exception 任务出错
   * @stopped 用户手动停止任务
   */
  status: TaskStatus
  /**
   * @props 是否启用任务
   */
  enable: boolean
  /**
   * @props 任务开始时间（时间戳，在任务开始时由Date.now()返回）
   */
  startTime?: number
  /**
   * @props 任务结束时间
   */
  endTime?: number
  /**
   * @props 任务进行进度，范围0-100
   */
  progress?: number
  /**
   * @props 任务的相关配置项
   * @example
   * [
   *   {
   *      label: 'refresh',
   *      value: true
   *   }
   * ]
   */
  configurations: Omit<FrontTaskObjectMap[Name], 'enable'>
  results: Record<string, any>
}

type __MapCoreTask<Name extends CoreTaskName> = Name extends unknown
  ? CoreTaskTemplate<Name>
  : never
type __MapFrontTask<Name extends FrontTaskName> = Name extends unknown
  ? FrontTaskTemplate<Name>
  : never

type __CoreTasks = __MapCoreTask<CoreTaskName>
type __FrontTasks = __MapFrontTask<FrontTaskName>

type __GetTask<Name extends CoreTaskName | FrontTaskName> =
  Name extends CoreTaskName
    ? CoreTaskTemplate<Name>
    : Name extends FrontTaskName
    ? FrontTaskTemplate<Name>
    : never

type Task = __CoreTasks | __FrontTasks

interface TaskGroup {
  /**
   * @props 任务组名
   */
  name: string
  /**
   * @props 任务组id
   */
  id: number
  /**
   * @props 任务组内的任务列表
   */
  tasks: Task[]
}

interface TaskGroups {
  currentId: number
  groups: TaskGroup[]
}

type __TASKOBJ_ClientType =
  | 'Official'
  | 'Bilibili'
  | 'txwy'
  | 'YoStarEN'
  | 'YoStarJP'
  | 'YoStarKR'
type __TASKOBJ_Server = 'CN' | 'US' | 'JP' | 'KR'
type __TASKOBJ_Facility =
  | 'Mfg'
  | 'Trade'
  | 'Power'
  | 'Control'
  | 'Reception'
  | 'Office'
  | 'Dorm'

type __TASKOBJ_PhantomSquadType =
  | '指挥分队'
  | '集群分队'
  | '后勤分队'
  | '矛头分队'
  | '突击战术分队'
  | '堡垒战术分队'
  | '远程战术分队'
  | '破坏战术分队'
  | '研究分队'
  | '高规格分队'

type __TASKOBJ_MizukiSquadType =
  | '心胜于物分队'
  | '物尽其用分队'
  | '以人为本分队'
  | '指挥分队'
  | '集群分队'
  | '后勤分队'
  | '矛头分队'
  | '突击战术分队'
  | '堡垒战术分队'
  | '远程战术分队'
  | '破坏战术分队'
  | '研究分队'
  | '高规格分队'

type __TASKOBJ_RolesType = '稳扎稳打' | '取长补短' | '随心所欲' | '先手必胜'

type CoreTaskObjectMap = {
  StartUp: {
    enable?: boolean
    client_type?: __TASKOBJ_ClientType
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
    server?: __TASKOBJ_Server
    client_type?: __TASKOBJ_ClientType
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
    server?: __TASKOBJ_Server
  }
  Infrast: {
    enable?: boolean
    mode: 0 | 10000
    facility: __TASKOBJ_Facility[]
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
    roles?: __TASKOBJ_RolesType
    core_char?: string
    use_support?: boolean
    use_nonfriend_support?: boolean
  } & (
    | {
        theme?: 'Phantom'
        squad?: __TASKOBJ_PhantomSquadType
      }
    | {
        theme: 'Mizuki'
        squad?: __TASKOBJ_MizukiSquadType
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
  ReclamationAlgorithm: {
    enable?: boolean
    mode: 0 | 1
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
}

type FrontTaskObjectMap = {
  Emulator: {
    enable?: boolean
    commandLine: string
    delay: number
  }
  Shutdown: {
    enable?: boolean
    option: 'shutdownEmulator' | 'shutdownAll' | 'shutdownComputer'
    delay: number
  }
  Idle: {
    enable?: boolean
    delay: number
  }
}
