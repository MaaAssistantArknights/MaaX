type DeviceStatus =
  | "available"
  | "connecting"
  | "connected"
  | "tasking"
  | "disconnected"
  | "unknown";

interface Device {
  /**
   * @props 设备的uuid，应由maa返回
   * @description maa连接到设备时，检查并读取特定位置文件，不存在就在特定位置新建uuid文件，下次连接时读取
   */
  uuid: string;
  /**
   * @props 设备连接地址
   */
  connectionString: string;
  /**
   * @props 设备状态
   * ---
   * @available 设备存在且可用，未连接
   * @connecting 正在连接设备
   * @connected 已连接设备
   * @tasking 连接设备且正在执行任务
   * @disconnect 因为某些原因与设备断开
   */
  status: DeviceStatus;
}

interface NativeDevice {
  uuid: string;
  connectionString: string;
}
