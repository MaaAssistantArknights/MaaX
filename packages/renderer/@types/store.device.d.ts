type DeviceStatus =
  | 'available'
  | 'connecting'
  | 'connected'
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
   * @props 设备连接地址
   */
  connectionString: string
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
   * @props 模拟器名称
   * @description 比如："BlueStacks", "MuMuEmulator", "LDPlayer", "Nox", "XYAZ", "WSA", "General"
   */
  name: EmulatorName
  /**
   * @props adb路径
   */
  adbPath: string
  /**
   * @props 设备标签
   * @description 可选，前端优先展示“设备标签”，如果不存在则展示“设备连接地址”, 比如: "Blustacks Global"
   */
  tag?: string
  /**
   * @props 传给后端的标记
   */
  config: string
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
  connectionString: string
  name: EmulatorName
  adbPath: string
  tag?: string
}
