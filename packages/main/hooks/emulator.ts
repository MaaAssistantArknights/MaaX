import { execSync, spawn, spawnSync, execFile } from 'child_process'
import { is } from 'electron-util'
import { ipcMain } from 'electron'
import path from 'path'
import { existsSync, readFileSync } from 'fs'
import { assert } from 'console'
import { runAppleScriptSync } from '@main/utils/applescript'
import _ from 'lodash'
import execa from 'execa'

const adbPath = path.join(__dirname, '../platform-tools', 'adb')

let __InUsePorts: string[] = [] // 本次识别已被使用的端口，将会在此暂存。

const emulator_list = [
  'HD-Player.exe',
  'LdVBoxHeadless.exe',
  'NoxVMHandle.exe',
  'NemuHeadless.exe'
]
const regPNamePid = RegExp('(.{3,25}[^\\s*])\\s*([0-9]*)\\s.*\\s*', 'g')
// get "HD-Player.exe  3396 Console    1  79,692 K"

interface Emulator {
  pname: string; // "HD-Player.exe"
  pid: string; // "114514"
  tag?: string; // 标记模拟器具体型号，比如蓝叠hyperv
  config?: string; // 传给后端的标记
  adb_path?: string; // "E://bluestack//HD-Adb.exe"
  address?: string; // "127.0.0.1:11451"
  uuid?: string
}

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

function getPidPath (pid: string | number) {
  const pathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  return JSON.parse(exec(pathExp)).ExecutablePath
}

function getPnamePath (pname: string) {
  const pathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where Name='${pname}'" |  Select-Object -Property ExecutablePath | ConvertTo-Json`
  const path = JSON.parse(exec(pathExp))
  return path.length > 1 ? path[0].ExecutablePath : path.ExecutablePath
}
function getBlueStackInfo (e: Emulator) {
  // BlueStack, windows only!
  const mainPathExp = `Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${e.pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  const confPathExp = String.raw`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_nxt | Select-Object -Property UserDefinedDir | ConvertTo-Json`
  const confPortExp = RegExp(
    'bst.instance.Nougat64_?\\d?.status.adb_port="(\\d{4,6})"',
    'g'
  )
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
    const blueStackCnPortExp = String.raw`Get-ChildItem -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests | ConvertTo-Json`
    try {
      const emulatorName = [...JSON.parse(exec(blueStackCnPortExp))].map(
        (v) => v.PSChildName
      ) // 蓝叠CN注册表中的模拟器id
      if (emulatorName.length == 0) success = false
      else {
        emulatorName.forEach((v) => {
          const exp = String.raw`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests\\${v}\Network\0 | Select-Object -Property InboundRules | ConvertTo-Json`
          const port = JSON.parse(exec(exp)).InboundRules[0].split(':').pop()
          if (
            !__InUsePorts.includes(port) &&
            testPort('127.0.0.1', port) &&
            !success
          ) {
            // 端口没有被占用, 测试端口成功, 本次循环未使用这个端口
            __InUsePorts.push(port)
            e.address = `127.0.0.1:${port}`
            e.tag = 'BlueStack CN [regedit]'
            success = true
          }
        })
        if (success) return
      }
    } catch (err) {
      console.log(err)
      success = false
    }
    if (!success) {
      // 通过读注册表失败, 使用 netstat 抓一个5开头的端口充数
      const regExp = '\\s*TCP\\s*127.0.0.1:(5\\d{3,4})\\s*' // 提取端口
      const netstatExp = `netstat -ano | findstr ${e.pid}`
      const port = exec(netstatExp).match(regExp)
      e.address = (port != null) ? `127.0.0.1:${port[1]}` : '127.0.0.1:5555'
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
        if (__InUsePorts.includes(v[1])) return true
        else return testPort('127.0.0.1', v[1])
      })
      .map((v) => v[1])
      .some((v) => {
        if (!__InUsePorts.includes(v)) {
          __InUsePorts.push(v)
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
) {
  const exp = `function testport ($hostname='${hostname}',$port=${port},$timeOut=${timeout}) {
            $client = New-Object System.Net.Sockets.TcpClient
            $beginConnect = $client.BeginConnect($hostname,$port,$null,$null)
            Start-Sleep -milli $timeOut
            if ($client.Connected) { $open = $true } else { $open = $false }
            $open
            $client.Close()
          }
    testport ${hostname} ${port} ${timeout}`
  return !!execSync(exp, { shell: 'powershell.exe' }).toString().includes('True')
}

function getNoxInfo (e: Emulator) {
  e.adb_path = path.resolve(
    path.dirname(getPnamePath('Nox.exe')),
    'nox_adb.exe'
  )
  const exp = `${e.adb_path} devices`
  const regExp = RegExp('127.0.0.1:(\\d{4,5})\\s*', 'g');
  [...exec(exp).matchAll(regExp)]
    .map((v) => v[1])
    .some((v) => {
      if (!__InUsePorts.includes(v)) {
        __InUsePorts.push(v)
        e.address = `127.0.0.1:${v}`
        return true
      }
      return false
    })
  e.config = 'Nox'
}

function getMumuInfo (e: Emulator) {
  // MuMu无法多开，且adb端口仅限7555
  // 流程: 有"NemuHeadless.exe"进程后，就去抓'NemuPlayer.exe'的路径.
  const emuPathExp = getPnamePath('NemuPlayer.exe')
  e.adb_path = path.resolve(emuPathExp, '../../vmonitor/bin/adb_server.exe')
  e.address = '127.0.0.1:7555' // 不测端口了，唯一指定7555
  e.tag = 'MuMu模拟器'
  e.config = 'MuMuEmulator'
}

function getLdInfo (e: Emulator) {
  // 雷电模拟器识别
  const portExp = RegExp('\\s*TCP\\s*0.0.0.0:(5\\d{3,4})\\s*0.0.0.0:0\\s*')
  const netstatExp = `netstat -ano | findstr ${e.pid}`
  const emulatorPath = getPnamePath('dnplayer.exe')
  e.adb_path = path.resolve(path.dirname(emulatorPath), 'adb.exe')
  const port = exec(netstatExp).match(portExp)
  e.address = (port != null) ? `127.0.0.1:${port[1]}` : ''
  e.config = 'LDPlayer'
  e.tag = '雷电模拟器'
}

async function getEmulators () {
  __InUsePorts = []
  const emulators: Emulator[] = []
  const { stdout: tasklist } = await execa('tasklist')
  tasklist
    .toString()
    .split('\n')
    .forEach((line: string) => {
      const res = line.matchAll(regPNamePid)
      for (const match of res) {
        if (emulator_list.includes(match[1])) {
          emulators.push({ pname: match[1], pid: match[2] })
        }
      }
    })
  emulators.forEach((e) => {
    if (e.pname == 'HD-Player.exe') {
      getBlueStackInfo(e)
    } else if (e.pname == 'NoxVMHandle.exe') {
      getNoxInfo(e)
    } else if (e.pname == 'NemuHeadless.exe') {
      getMumuInfo(e)
    } else if (e.pname == 'LdVBoxHeadless.exe') {
      getLdInfo(e)
    }
  })

  // const blueStackPath = execSync(expBlueStackConfPath);
  // console.log(blueStackPath.toString());
  emulators.forEach((e) => {
    const uuid = getDeviceUuid(e.address as string, e.adb_path)
    if (uuid) {
      e.uuid = uuid
    }
  })
  console.log(emulators)
  return emulators
}

function testNoxPorts () {
  const opened: number[] = []
  const baseport = 62001
  let index = 0
  do {
    let port = baseport + index
    if (index > 0) {
      port += 24
    }
    const output = spawnSync(adbPath, ['connect', `127.0.0.1:${port}`])
    if (output.output.toString().includes('connected')) {
      opened.push(port)
    }
    index += 1
  } while (opened.length === index)
  return opened
}

function adbDevices () {
  const emulators: Emulator[] = []
  const e = {}
  getNoxInfo(e as Emulator)
  return emulators
}

function getDeviceName (address: string): string | false {
  const connectResult = spawnSync(adbPath, [
    'connect',
    address
  ]).stdout.toString()
  if (connectResult.includes('connected')) {
    return spawnSync(adbPath, [
      'shell',
      'settings',
      'get',
      'global',
      'device_name'
    ]).stdout.toString()
  }
  return false
}

function getDeviceUuid (address: string, adb_path = adbPath): string | false {
  if (!adb_path) {
    console.log('adb_path is null')
    return false
  }
  const connectResult = spawnSync(adb_path, [
    'connect',
    address
  ]).stdout.toString()
  if (connectResult.includes('connected')) {
    const ret = spawnSync(adb_path, [
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

function getEmulatorsDarwin (): Emulator[] {
  const player_list = ['NoxAppPlayer.app', 'NemuPlayer.app']
  const emulators: Emulator[] = []
  const { stdout } = execa.sync('pgrep', ['-lf', '.'])
  const active_players = stdout
    .split('\n')
    .filter((line) => player_list.some((player) => line.includes(player)))
    .map((line) => {
      const [pid, ppath] = line.split(' ')
      const pname = path.basename(ppath)
      const pdir = path.dirname(ppath)
      return { pid, pname, adbPath: `${pdir}/adb` }
    })
  console.log(active_players)
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

function startEmulatorHook () {
  ipcMain.handle('asst:startEmulator', async (event, arg) => {
    console.log(arg)
    execFile(arg.emulator_path, [arg.arg], (err: any, stdout: string, stderr: string) => {
      if (err) {
        console.log(err)
        return
      }

      console.log(`startEmu stdout:${stdout}`)
      console.log(`startEmu stderr:${stderr}`)
    })
  })
}

function killEmulatorHook () {

}

export default function getEmulatorHooks () {
  ipcMain.handle('asst:getEmulators', async (event): Promise<Emulator[]> => {
    if (is.windows) {
      return await getEmulators()
    } else if (is.macos) {
      return getEmulatorsDarwin()
    } else {
      return adbDevices()
    }
  })
  ipcMain.handle('asst:getDeviceUuid', async (event, arg): Promise<string|boolean> => {
    const ret = getDeviceUuid(arg.address, arg.adb_path)
    console.log(ret)
    return ret
  })

  startEmulatorHook()
}
