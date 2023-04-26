type TaskStatus =
  | 'idle'
  | 'waiting'
  | 'processing'
  | 'success'
  | 'warning'
  | 'skipped'
  | 'exception'
  | 'stopped'

type TaskName =
  | 'emulator'
  | 'startup'
  | 'fight'
  | 'recruit'
  | 'infrast'
  | 'visit'
  | 'mall'
  | 'award'
  | 'rogue'
  | 'shutdown'
  | 'copilot'
  | 'idle'

type CoreTaskName =
  | 'Emulator'
  | 'StartUp'
  | 'Fight'
  | 'Recruit'
  | 'Infrast'
  | 'Visit'
  | 'Mall'
  | 'Award'
  | 'Roguelike'
  | 'Copilot'
  | 'Shutdown'

interface Task {
  /**
   * @props 任务对应卡片名
   */
  name: TaskName
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
  configurations: Record<string, unknown>
  results: Record<string, any>
}

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
