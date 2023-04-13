type DeviceStatus =
  | 'available'
  | 'connecting'
  | 'connected'
  | 'wakingUp' // 正在尝试启动
  | 'waitingTask' // 等待设备链接后自动开始任务
  | 'waitingTaskEnd' // 链接成功, 可以开始任务
  | 'tasking'
  | 'disconnected'
  | 'unknown'

type EmulatorName =
  | 'BlueStacks'
  | 'MuMuEmulator'
  | 'LDPlayer'
  | 'Nox'
  | 'XYAZ'
  | 'WSA'
  | 'General'
  | 'unknown'

interface Device {
  /**
   * @props 设备的uuid，UI给模拟器发送adb指令来获取
   * @description UI连接到设备时，检查并读取特定位置文件，不存在就在特定位置新建uuid文件，下次连接时读取
   */
  uuid: string
  /**
   * @props 进程Pid
   */
  pid?: string
  /**
   * @props 设备连接地址
   */
  address: string
  /**
   * @props 设备状态
   * ---
   * @available 设备存在且可用，未连接
   * @connecting 正在连接设备
   * @connected 已连接设备
   * @tasking 连接设备且正在执行任务
   * @disconnected 因为某些原因与设备断开
   */
  status: DeviceStatus
  /**
   * @props adb路径
   */
  adbPath: string
  /**
   * @props 设备展示名称
   * @description 前端优先展示“设备展示名称”，如果不存在则展示“设备连接地址”, 比如: "Blustacks Global"
   */
  displayName?: string
  /**
   * @props 模拟器名称, 传给core
   * @description 比如："BlueStacks", "MuMuEmulator", "LDPlayer", "Nox", "XYAZ", "WSA", "General"。 "General"不支持关闭模拟器功能
   */
  config: EmulatorName
  /**
   * @props 模拟器路径
   * @description 搜索模拟器时会尝试自动获取，比如："E://bluestack//HD-Player.exe"
   */
  emulatorPath?: string
  /**
   * @props 模拟器命令行参数
   * @description 启动参数, 比如蓝叠启动指定实例的 "--instance" "114514"
  */
  commandLine?: string
}

interface NativeDevice {
  uuid: string
  pid?: string
  address: string
  name: EmulatorName
  adbPath?: string
  tag?: string
  commandLine?: string
}
