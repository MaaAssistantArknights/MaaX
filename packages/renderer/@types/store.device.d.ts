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
   * @props 模拟器名称, 传给maa使其使用模拟器的自定配置, 自定义连接的设备为'General'
   */
  name: EmulatorName
  /**
   * @props adb路径
   */
  adbPath: string
  /**
   * @props 设备标签
   * @description 可选，前端优先展示“设备标签”，如果不存在则展示“设备连接地址”
   */
  tag?: string
}

interface NativeDevice {
  uuid: string
  connectionString: string
  name: EmulatorName
  adbPath: string
  tag?: string
}
