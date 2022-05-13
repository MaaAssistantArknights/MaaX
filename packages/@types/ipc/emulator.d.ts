interface Emulator {
  pname: string // "HD-Player.exe"
  pid: string // "114514"
  displayName?: string // 模拟器展示名称，比如'BlueStacks CN'
  config?: string // 传给后端的模拟器配置名称
  adbPath?: string // "E://bluestack//HD-Adb.exe"
  address?: string // "127.0.0.1:11451"
  uuid?: string
  commandLine?: string // 命令行启动参数
  emulatorPath?: string // 模拟器路径
}
