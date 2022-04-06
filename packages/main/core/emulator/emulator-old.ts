import { execSync, spawnSync } from 'child_process'
import { is } from 'electron-util'
import path from 'path'
import { existsSync, readFileSync } from 'fs'
import { assert } from 'console'
import _ from 'lodash'
import execa from 'execa'

const defaultAdbPath = path.join(__dirname, '../platform-tools', 'adb')

let inUsePorts: string[] = [] // 本次识别已被使用的端口，将会在此暂存。

const emulatorList = [
  'HD-Player.exe',
  'LdVBoxHeadless.exe',
  'NoxVMHandle.exe',
  'NemuHeadless.exe'
]
const regPNamePid = /(.{3,25}[^\s*])\s*([0-9]*)\s.*\s*/g
// get "HD-Player.exe  3396 Console    1  79,692 K"

function exec (exp: string): string {
  // return execSync(exp, { shell: "powershell.exe" }).toString();

  if (is.windows) {
    return execSync(exp, { shell: 'powershell.exe' }).toString()
  } else if (is.linux) {
    return execSync(exp, { shell: 'bash' }).toString()
  } else {
    return execSync(exp, { shell: 'bash' }).toString() // macos
  }
}

/**
function getPidPath (pid: string | number): string {
  const pathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  return JSON.parse(exec(pathExp)).ExecutablePath
}
 */

function getPnamePath (pname: string): string {
  const pathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where Name='${pname}'" |  Select-Object -Property ExecutablePath | ConvertTo-Json`
  const path = JSON.parse(exec(pathExp))
  return path.length > 1 ? path[0].ExecutablePath : path.ExecutablePath
}
function getBlueStackInfo (e: Emulator): void {
  // BlueStack, windows only!
  const mainPathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${e.pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  const confPathExp = String.raw`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_nxt | Select-Object -Property UserDefinedDir | ConvertTo-Json`
  const confPortExp = /bst.instance.Nougat64_?\d?.status.adb_port="(\d{4,6})"/g
  const blueStackCNPnameExp = String.raw`Get-ChildItem -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests | ConvertTo-Json`

  e.config = 'BlueStacks'
  e.adb_path = path.join(
    path.dirname(JSON.parse(exec(mainPathExp)).ExecutablePath),
    'HD-Adb.exe'
  )
  const confPath = path.join(
    path.normalize(JSON.parse(exec(confPathExp)).UserDefinedDir),
    'bluestacks.conf'
  )
  if (e.adb_path.includes('BluestacksCN')) {
    // 蓝叠CN特供版本 读注册表 Computer\HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests\Android\Network\0 中的InboundRules
    // 搞两套方案，先读注册表拿adb端口, 如果读失败了可能是打包复制导致，再使用 netstat 尝试
    let success: boolean = false
    try {
      const emulatorName: string[] = [...JSON.parse(exec(blueStackCNPnameExp))].map(
        (v) => v.PSChildName
      ) // 蓝叠CN注册表中的模拟器id
      if (emulatorName.length === 0) success = false
      else {
        emulatorName.forEach((v) => {
          const blueStackCNPortExp = String.raw`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests\\${v}\Network\0 | Select-Object -Property InboundRules | ConvertTo-Json`
          const port: string = JSON.parse(exec(blueStackCNPortExp)).InboundRules[0].split(':').pop()
          if (
            !inUsePorts.includes(port) &&
            testPort('127.0.0.1', port) &&
            !success
          ) {
            // 端口没有被占用, 测试端口成功, 本次循环未使用这个端口
            inUsePorts.push(port)
            e.address = `127.0.0.1:${port}`
            e.tag = 'BlueStack CN [regedit]'
            success = true
          }
        })
      }
    } catch (err) {
      console.log(err)
      success = false
    }
    if (success) return

    if (!success) {
      // 通过读注册表失败, 使用 netstat 抓一个5开头的端口充数
      const regExp = '\\s*TCP\\s*127.0.0.1:(5\\d{3,4})\\s*' // 提取端口
      const netstatExp = `netstat -ano | findstr ${e.pid}`
      const port = exec(netstatExp).match(regExp)
      e.address = port != null ? `127.0.0.1:${port[1]}` : '127.0.0.1:5555'
      e.tag = 'BlueStack CN [no regedit]'
    }
  } else {
    assert(
      existsSync(confPath),
      `bluestacks.conf not exist! path: ${confPath}`
    )
    const conf = readFileSync(confPath, 'utf-8') // 读bluestacks.conf文件
    e.tag = 'BlueStack Global';
    [...conf.matchAll(confPortExp)]
      .filter((v) => {
        if (inUsePorts.includes(v[1])) return true
        else return testPort('127.0.0.1', v[1])
      })
      .map((v) => v[1])
      .some((v) => {
        if (!inUsePorts.includes(v)) {
          inUsePorts.push(v)
          e.address = `127.0.0.1:${v}`
          return true
        }
        return false
      })
  }
}

function testPort (
  hostname: string,
  port: number | string,
  timeout: number = 100
): boolean {
  const exp = `function testport ($hostname='${hostname}',$port=${port},$timeOut=${timeout}) {
            $client = New-Object System.Net.Sockets.TcpClient
            $beginConnect = $client.BeginConnect($hostname,$port,$null,$null)
            Start-Sleep -milli $timeOut
            if ($client.Connected) { $open = $true } else { $open = $false }
            $open
            $client.Close()
          }
    testport ${hostname} ${port} ${timeout}`
  return !!execSync(exp, { shell: 'powershell.exe' })
    .toString()
    .includes('True')
}

function getNoxInfo (e: Emulator): void {
  e.adb_path = path.resolve(
    path.dirname(getPnamePath('Nox.exe')),
    'nox_adb.exe'
  )
  const exp = `${e.adb_path} devices`
  const regExp = /127.0.0.1:(\d{4,5})\s*/g;
  [...exec(exp).matchAll(regExp)]
    .map((v) => v[1])
    .some((v) => {
      if (!inUsePorts.includes(v)) {
        inUsePorts.push(v)
        e.address = `127.0.0.1:${v}`
        return true
      }
      return false
    })
  e.config = 'Nox'
}

function getMumuInfo (e: Emulator): void {
  // MuMu无法多开，且adb端口仅限7555
  // 流程: 有"NemuHeadless.exe"进程后，就去抓'NemuPlayer.exe'的路径.
  const emuPathExp = getPnamePath('NemuPlayer.exe')
  e.adb_path = path.resolve(emuPathExp, '../../vmonitor/bin/adb_server.exe')
  e.address = '127.0.0.1:7555' // 不测端口了，唯一指定7555
  e.tag = 'MuMu模拟器'
  e.config = 'MuMuEmulator'
}

function getLdInfo (e: Emulator): void {
  // 雷电模拟器识别
  const portExp = /\s*TCP\s*0.0.0.0:(5\d{3,4})\s*0.0.0.0:0\s*/g
  const netstatExp = `netstat -ano | findstr ${e.pid}`
  const emulatorPath = getPnamePath('dnplayer.exe')
  e.adb_path = path.resolve(path.dirname(emulatorPath), 'adb.exe')
  const port = exec(netstatExp).match(portExp)
  e.address = port != null ? `127.0.0.1:${port[1]}` : ''
  e.config = 'LDPlayer'
  e.tag = '雷电模拟器'
}

export async function getEmulators (): Promise<Emulator[]> {
  inUsePorts = []
  const emulators: Emulator[] = []
  const { stdout: tasklist } = await execa('tasklist')
  tasklist
    .toString()
    .split('\n')
    .forEach((line) => {
      const res = line.matchAll(regPNamePid)
      for (const match of res) {
        if (emulatorList.includes(match[1])) {
          emulators.push({ pname: match[1], pid: match[2] })
        }
      }
    })
  emulators.forEach((e) => {
    if (e.pname === 'HD-Player.exe') {
      getBlueStackInfo(e)
    } else if (e.pname === 'NoxVMHandle.exe') {
      getNoxInfo(e)
    } else if (e.pname === 'NemuHeadless.exe') {
      getMumuInfo(e)
    } else if (e.pname === 'LdVBoxHeadless.exe') {
      getLdInfo(e)
    }
  })

  // const blueStackPath = execSync(expBlueStackConfPath);
  // console.log(blueStackPath.toString());
  emulators.forEach((e) => {
    const uuid = getDeviceUuid(e.address as string)
    if (uuid) {
      e.uuid = uuid
    }
  })
  console.log(emulators)
  return emulators
}

// function testNoxPorts (): number[] {
//   const opened: number[] = []
//   const baseport = 62001
//   let index = 0
//   do {
//     let port = baseport + index
//     if (index > 0) {
//       port += 24
//     }
//     const output = spawnSync(defaultAdbPath, ['connect', `127.0.0.1:${port}`])
//     if (output.output.toString().includes('connected')) {
//       opened.push(port)
//     }
//     index += 1
//   } while (opened.length === index)
//   return opened
// }

export function adbDevices (): Emulator[] {
  const emulators: Emulator[] = []
  const e = {}
  getNoxInfo(e as Emulator)
  return emulators
}

// function getDeviceName (address: string): string | false {
//   const connectResult = spawnSync(defaultAdbPath, [
//     'connect',
//     address
//   ]).stdout.toString()
//   if (connectResult.includes('connected')) {
//     return spawnSync(defaultAdbPath, [
//       'shell',
//       'settings',
//       'get',
//       'global',
//       'device_name'
//     ]).stdout.toString()
//   }
//   return false
// }

export function getDeviceUuid (address: string, adbPath = defaultAdbPath): string | false {
  if (!adbPath) {
    console.log('adb_path is null')
    return false
  }
  const connectResult = spawnSync(adbPath, [
    'connect',
    address
  ]).stdout.toString()
  if (connectResult.includes('connected')) {
    const ret = spawnSync(adbPath, [
      '-s',
      address,
      'shell',
      "service call iphonesubinfo 1 | awk -F \\''\\' '{print $2}'| sed '1 d' | tr -d '.' | awk '{print}' ORS="
    ]).stdout.toString()
    console.log(ret)
    if (ret) return _.trim(ret)
  }
  return false
}

export function getEmulatorsDarwin (): Emulator[] {
  const playerList = ['NoxAppPlayer.app', 'NemuPlayer.app']
  const emulators: Emulator[] = []
  const { stdout } = execa.sync('pgrep', ['-lf', '.'])
  const activePlayers = stdout
    .split('\n')
    .filter((line) => playerList.some((player) => line.includes(player)))
    .map((line) => {
      const [pid, ppath] = line.split(' ')
      const pname = path.basename(ppath)
      const pdir = path.dirname(ppath)
      return { pid, pname, adbPath: `${pdir}/adb` }
    })
  console.log(activePlayers)
  // const players = runAppleScriptSync(script)
  //   .split(",")
  //   .map((v) => v.trim());
  // players.forEach((player) => {
  //   const adb_path = `/Applications/${player}.app/Contents/MacOS/adb`;
  //   const result = execa.sync(adb_path, ["devices"]).stdout;
  //   result.split("\n").forEach((line) => {
  //     const device = /(.+?)\tdevice/.exec(line);
  //     if (device) {
  //       emulators.push({
  //         pname: player,
  //         pid: "",
  //         adb_path,
  //         address: device[1],
  //       });
  //     }
  //   });
  // });
  return emulators
}

// function killEmulatorHook (): void { }
