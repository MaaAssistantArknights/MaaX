interface Emulator {
  pname: string // "HD-Player.exe"
  pid: string // "114514"
  tag?: string // 标记模拟器具体型号，比如蓝叠hyperv
  config?: string // 传给后端的标记
  adb_path?: string // "E://bluestack//HD-Adb.exe"
  address?: string // "127.0.0.1:11451"
  uuid?: string
  commandLine?: string // 命令行启动参数
  emulatorPath?: string // 模拟器路径
}
