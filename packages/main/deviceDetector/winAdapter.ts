/* eslint-disable vue/max-len */
import EmulatorAdapter from './adapterBase'
import { Singleton } from '@common/function/singletonDecorator'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { assert } from 'console'
import _ from 'lodash'
import { $ } from '@main/utils/shell'
import logger from '@main/utils/logger'

const defaultAdbPath = path.join(__dirname, '../platform-tools', 'adb.exe')

const inUsePorts: string[] = [] // 本次识别已被使用的端口，将会在此暂存。

const emulatorList = [
  'HD-Player.exe', // 蓝叠模拟器
  'LdVBoxHeadless.exe', // 雷电模拟器
  'NoxVMHandle.exe', // 夜神模拟器
  'NemuHeadless.exe', // mumu模拟器
  'MEmuHeadless.exe' // 逍遥模拟器
]
const regPNamePid = /(.{3,25}[^\s*])\s*([0-9]*)\s.*\s*/g
// get "HD-Player.exe  3396 Console    1  79,692 K"

const getPnamePath = async (pname: string): Promise<string> => {
  const result = await $`Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where Name='${pname}'" | Select-Object -Property ExecutablePath | ConvertTo-Json`
  const path = JSON.parse(result.stdout)
  return path.length > 1 ? path[0].ExecutablePath : path.ExecutablePath
}

async function getCommandLine (pid: string | number): Promise<any> {
  // 获取进程启动参数
  const commandLineExp = `Get-WmiObject -Query "select CommandLine FROM Win32_Process where ProcessID='${pid}'" | Select-Object -Property CommandLine | ConvertTo-Json`
  const ret: string = JSON.parse((await $`${commandLineExp}`).stdout).CommandLine
  logger.debug(`getCommandLine: ${ret}`)
  return ret
}

async function getDeviceUuid (address: string, adbPath = defaultAdbPath): Promise<string | false> {
  if (!adbPath) {
    logger.error('adb_path is null')
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
  return _.trim((await $`${exp}`).stdout).includes('True')
}

function getBluestackInstanceName (cmd: string): string {
  const instanceExp = /".*"\s"?--instance"?\s"?([^"]*)"?/g
  const res = [...cmd.matchAll(instanceExp)].map((v) => v[1])
  console.log('instance Name:')
  console.log(res)
  return res ? res[0] : 'unknown'
}

@Singleton
class WindowsEmulator extends EmulatorAdapter {
  protected async getBluestack (e: Emulator): Promise<void> {
    // const confPortExp = /bst.instance.Nougat64_?\d?.status.adb_port="(\d{4,6})"/g
    // const e: Emulator = { pname, pid }
    e.config = 'BlueStacks'
    e.adb_path = path.join(
      path.dirname(JSON.parse(
        (await $`Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessID=${e.pid}" | Select-Object -Property ExecutablePath | ConvertTo-Json`).stdout
      ).ExecutablePath),
      'HD-Adb.exe'
    )
    const cmd = await getCommandLine(e.pid)
    e.commandLine = cmd // 从命令行启动的指令
    const arg = getBluestackInstanceName(await cmd)
    console.log('arg:')
    console.log(arg)
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
        console.log('emulator name:')
        console.log(emulatorName)
        if (emulatorName.length === 0) success = false
        else {
          for await (const v of emulatorName) {
            const port: string = JSON.parse(
              (await $`Get-ItemProperty -Path Registry::HKEY_LOCAL_MACHINE\\SOFTWARE\\BlueStacks_china_gmgr\\Guests\\${v}\\Network\\0 | Select-Object -Property InboundRules | ConvertTo-Json`).stdout
            ).InboundRules[0].split(':').pop()
            if (
              !inUsePorts.includes(port) &&
              await testPort('127.0.0.1', port) &&
              !success
            ) {
              // 端口没有被占用, 测试端口成功, 本次循环未使用这个端口
              console.log('use bs cn')
              inUsePorts.push(port)
              e.address = `127.0.0.1:${port}`
              e.tag = 'BlueStack CN [regedit]'
              success = true
            }
            if (success) break
          }
        }
      } catch (err) {
        console.log(err)
        success = false
      }

      console.log('success status:')
      console.log(success)
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
      const confPortInstanceExp = RegExp(`bst.instance.${arg}.status.adb_port="(\\d{4,6})"`)
      const confPort = conf.match(confPortInstanceExp)
      console.log('confport:')
      e.tag = 'BlueStack Global'
      if (confPort) { e.address = `127.0.0.1:${confPort[1]}` }
      /**
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
     */
    }
    console.log('e:::')
    console.log(e)
    // return e
  }

  protected async getXY (e: Emulator): Promise<void> {
    logger.debug('get XY info')
    e.adb_path = path.resolve(
      path.dirname(await getPnamePath('Memu.exe')),
      'adb.exe'
    )
    console.log(`XY adb_path: ${e.adb_path}`)

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
    e.config = 'XYAZ'
    e.tag = '逍遥模拟器'
    // return e
  }

  protected async getNox (e: Emulator): Promise<void> {
    // const e: Emulator = { pname, pid }

    e.adb_path = path.resolve(
      path.dirname(await getPnamePath('Nox.exe')),
      'nox_adb.exe'
    )
    logger.debug(`nox adb_path: ${e.adb_path}`)
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
    e.tag = '夜神模拟器'
    // return e
  }

  protected async getMumu (e: Emulator): Promise<void> {
    // const e: Emulator = { pname, pid }
    // MuMu无法多开，且adb端口仅限7555
    // 流程: 有"NemuHeadless.exe"进程后，就去抓'NemuPlayer.exe'的路径.
    const emuPathExp = await getPnamePath('NemuPlayer.exe')
    e.adb_path = path.resolve(emuPathExp, '../../vmonitor/bin/adb_server.exe')
    e.address = '127.0.0.1:7555' // 不测端口了，唯一指定7555
    e.tag = 'MuMu模拟器'
    e.config = 'MuMuEmulator'
    // return e
  }

  protected async getLd (e: Emulator): Promise<void> {
    // const e: Emulator = { pname, pid }
    // 雷电模拟器识别
    const portExp = /\s*TCP\s*0.0.0.0:(5\d{3,4})\s*0.0.0.0:0\s*/g
    const emulatorPath = await getPnamePath('dnplayer.exe')
    e.adb_path = path.resolve(path.dirname(emulatorPath), 'adb.exe')
    const port = (await $`netstat -ano | findstr ${e.pid}`).stdout.match(portExp)
    e.address = port != null ? `127.0.0.1:${port[1]}` : ''
    e.config = 'LDPlayer'
    e.tag = '雷电模拟器'
    // return e
  }

  protected async getAdbDevices (): Promise<Emulator[]> {
    const emulators: Emulator[] = []
    const e = await this.getNox({})
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
    for await (const e of emulators) {
      if (e.pname === 'HD-Player.exe') {
        await this.getBluestack(e)
      } else if (e.pname === 'NoxVMHandle.exe') {
        await this.getNox(e)
      } else if (e.pname === 'NemuHeadless.exe') {
        await this.getMumu(e)
      } else if (e.pname === 'LdVBoxHeadless.exe') {
        await this.getLd(e)
      } else if (e.pname === 'MEmuHeadless.exe') {
        await this.getXY(e)
      }
    }

    for await (const e of emulators) {
      const uuid = await getDeviceUuid(e.address as string, e.adb_path)
      if (uuid) {
        e.uuid = uuid
      }
    }
    return emulators
  }
}

export default new WindowsEmulator()
