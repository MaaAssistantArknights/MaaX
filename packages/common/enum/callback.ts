export enum AsstMsg {
  /* Global Info */
  InternalError = 0, // 内部错误
  InitFailed, // 初始化失败
  ConnectionInfo, // 连接相关信息
  AllTasksCompleted, // 全部任务完成
  /* TaskChain Info */
  TaskChainError = 10000, // 任务链执行/识别错误
  TaskChainStart, // 任务链开始
  TaskChainCompleted, // 任务链完成
  TaskChainExtraInfo, // 任务链额外信息
  /* SubTask Info */
  SubTaskError = 20000, // 原子任务执行/识别错误
  SubTaskStart, // 原子任务开始
  SubTaskCompleted, // 原子任务完成
  SubTaskExtraInfo, // 原子任务额外信息
}

export enum TaskChainMap {
  Emulator = 'emulator',
  StartUp = 'startup',
  Fight = 'fight',
  Mall = 'mall',
  Recruit = 'recruit',
  RecruitCalc = 'recruit_calc',
  Infrast = 'infrast',
  Visit = 'visit',
  Roguelike = 'rogue',
  Copilot = 'copilot',
  Shutdown = 'shutdown',
  Award = 'award',
  Idle = 'idle',
  Debug = 'debug',

  emulator = 'Emulator',
  startup = 'StartUp',
  fight = 'Fight',
  mall = 'Mall',
  recruit = 'Recruit',
  recruit_calc = 'RecruitCalc',
  infrast = 'Infrast',
  visit = 'Visit',
  rogue = 'Roguelike',
  copilot = 'Copilot',
  shutdown = 'Shutdown',
  award = 'Award',
  idle = 'Idle',
  debug = 'Debug',
}
