/* eslint-disable vue/max-len */
import EmulatorAdapter from './adapter'
import { Singleton } from '@common/singleton'
import { getShell } from '@common/system'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { assert } from 'console'
import _ from 'lodash'

const $ = getShell()

const defaultAdbPath = path.join(__dirname, '../platform-tools', 'adb')

const inUsePorts: string[] = [] // 本次识别已被使用的端口，将会在此暂存。

const emulatorList = [
  'HD-Player.exe',
  'LdVBoxHeadless.exe',
  'NoxVMHandle.exe',
  'NemuHeadless.exe'
]
const regPNamePid = /(.{3,25}[^\s*])\s*([0-9]*)\s.*\s*/g
// get "HD-Player.exe  3396 Console    1  79,692 K"

const getPnamePath = async (pname: string): Promise<string> => {
  const result = await $`Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where Name='${pname}'" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  const path = JSON.parse(result.stdout)
  return path.length > 1 ? path[0].ExecutablePath : path.ExecutablePath
}

async function getDeviceUuid (address: string, adbPath = defaultAdbPath): Promise<string | false> {
  if (!adbPath) {
    console.log('adb_path is null')
    return false
  }
  const connectResult = (await $`"${adbPath}" connect ${address}`).stdout
  if (connectResult.includes('connected')) {
    const ret = await $`"${adbPath}" -s ${address} shell settings get secure android_id`
    console.log(ret.stdout)
    if (ret) return _.trim(ret.stdout)
  }
  return false
}

async function testPort (
  hostname: string,
  port: number | string,
  timeout: number = 100
): Promise<boolean> {
  const exp = `function testport ($hostname='${hostname}',$port=${port},$timeOut=${timeout}) {
            $client = New-Object System.Net.Sockets.TcpClient
            $beginConnect = $client.BeginConnect($hostname,$port,$null,$null)
            Start-Sleep -milli $timeOut
            if ($client.Connected) { $open = $true } else { $open = $false }
            $open
            $client.Close()
          }
    testport ${hostname} ${port} ${timeout}`
  return !!(await $`${exp}`).stdout.includes('True')
}

@Singleton
class WindowsEmulator extends EmulatorAdapter {
  protected async getBluestack (pname: string, pid: string): Promise<Emulator> {
    const confPortExp = /bst.instance.Nougat64_?\d?.status.adb_port="(\d{4,6})"/g
    const e: Emulator = { pname, pid }
    e.config = 'BlueStacks'
    e.adb_path = path.join(
      path.dirname(JSON.parse(
        (await $`Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`).stdout
      ).ExecutablePath),
      'HD-Adb.exe'
    )
    const confPath = path.join(
      path.normalize(JSON.parse(
        (await $`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\BlueStacks_nxt | Select-Object -Property UserDefinedDir | ConvertTo-Json`).stdout
      ).UserDefinedDir),
      'bluestacks.conf'
    )
    if (e.adb_path.includes('BluestacksCN')) {
      // 蓝叠CN特供版本 读注册表 Computer\HKEY_LOCAL_MACHINE\SOFTWARE\BlueStacks_china_gmgr\Guests\Android\Network\0 中的InboundRules
      // 搞两套方案，先读注册表拿adb端口, 如果读失败了可能是打包复制导致，再使用 netstat 尝试
      let success: boolean = false
      try {
        const emulatorName: string[] = [...JSON.parse((
          (await $`Get-ChildItem -Path Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\BlueStacks_china_gmgr\\Guests | ConvertTo-Json`).stdout
        ))].map(
          (v) => v.PSChildName
        ) // 蓝叠CN注册表中的模拟器id
        if (emulatorName.length === 0) success = false
        else {
          emulatorName.forEach(async (v) => {
            const port: string = JSON.parse(
              (await $`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\BlueStacks_china_gmgr\\Guests\\${v}\\Network\\0 | Select-Object -Property InboundRules | ConvertTo-Json`).stdout
            ).InboundRules[0].split(':').pop()
            if (
              !inUsePorts.includes(port) &&
              await testPort('127.0.0.1', port) &&
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
      if (success) return e

      if (!success) {
        // 通过读注册表失败, 使用 netstat 抓一个5开头的端口充数
        const regExp = '\\s*TCP\\s*127.0.0.1:(5\\d{3,4})\\s*' // 提取端口
        const port = (await $`netstat -ano | findstr ${e.pid}`).stdout.match(regExp)
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
        .filter(async (v) => {
          if (inUsePorts.includes(v[1])) return true
          else return await testPort('127.0.0.1', v[1])
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
    return e
  }

  protected async getNox (pname: string, pid: string): Promise<Emulator> {
    const e: Emulator = { pname, pid }

    e.adb_path = path.resolve(
      path.dirname(await getPnamePath('Nox.exe')),
      'nox_adb.exe'
    )
    const regExp = /127.0.0.1:(\d{4,5})\s*/g;
    [...(await $`${e.adb_path} devices`).stdout.matchAll(regExp)]
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
    return e
  }

  protected async getMumu (pname: string, pid: string): Promise<Emulator> {
    const e: Emulator = { pname, pid }
    // MuMu无法多开，且adb端口仅限7555
    // 流程: 有"NemuHeadless.exe"进程后，就去抓'NemuPlayer.exe'的路径.
    const emuPathExp = await getPnamePath('NemuPlayer.exe')
    e.adb_path = path.resolve(emuPathExp, '../../vmonitor/bin/adb_server.exe')
    e.address = '127.0.0.1:7555' // 不测端口了，唯一指定7555
    e.tag = 'MuMu模拟器'
    e.config = 'MuMuEmulator'
    return e
  }

  protected async getLd (pname: string, pid: string): Promise<Emulator> {
    const e: Emulator = { pname, pid }
    // 雷电模拟器识别
    const portExp = /\s*TCP\s*0.0.0.0:(5\d{3,4})\s*0.0.0.0:0\s*/g
    const emulatorPath = await getPnamePath('dnplayer.exe')
    e.adb_path = path.resolve(path.dirname(emulatorPath), 'adb.exe')
    const port = (await $`netstat -ano | findstr ${e.pid}`).stdout.match(portExp)
    e.address = port != null ? `127.0.0.1:${port[1]}` : ''
    e.config = 'LDPlayer'
    e.tag = '雷电模拟器'
    return e
  }

  protected async getAdbDevices (): Promise<Emulator[]> {
    const emulators: Emulator[] = []
    const e = await this.getNox('', '')
    return emulators
  }

  async getEmulators (): Promise<Emulator[]> {
    inUsePorts.splice(0, inUsePorts.length)
    const emulators: Emulator[] = []
    const { stdout: tasklist } = await $`tasklist`
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
    emulators.forEach(async (e) => {
      if (e.pname === 'HD-Player.exe') {
        e = await this.getBluestack(e.pname, e.pid)
      } else if (e.pname === 'NoxVMHandle.exe') {
        e = await this.getNox(e.pname, e.pid)
      } else if (e.pname === 'NemuHeadless.exe') {
        e = await this.getMumu(e.pname, e.pid)
      } else if (e.pname === 'LdVBoxHeadless.exe') {
        e = await this.getLd(e.pname, e.pid)
      }
    })

    // const blueStackPath = execSync(expBlueStackConfPath);
    // console.log(blueStackPath.toString());
    emulators.forEach(async (e) => {
      const uuid = await getDeviceUuid(e.address as string)
      if (uuid) {
        e.uuid = uuid
      }
    })
    console.log(emulators)
    return emulators
  }
}

export default new WindowsEmulator()
