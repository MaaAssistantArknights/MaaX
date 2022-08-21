/* eslint-disable vue/max-len */
import { Singleton } from '@common/function/singletonDecorator'
import path from 'path'
import { readFileSync, existsSync } from 'fs'
import { assert } from 'console'
import _ from 'lodash'
import { $ } from '@main/utils/shell'
import logger from '@main/utils/logger'
import { defaultAdbPath, getDeviceUuid } from '@main/deviceDetector/utils'

console.log('import deviceDetector')

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

// const getPidPath = async (pid: string): Promise<string> => {
//   const result = await $`Get-WmiObject -Query "select ExecutablePath FROM Win32_Process where ProcessId='${pid}'" | Select-Object -Property ExecutablePath | ConvertTo-Json`
//   const path = JSON.parse(result.stdout)
//   return path.ExecutablePath
// }

async function getCommandLine (pid: string | number): Promise<string> {
  // 获取进程启动参数
  const commandLineExp = `Get-WmiObject -Query "select CommandLine FROM Win32_Process where ProcessID='${pid}'" | Select-Object -Property CommandLine | ConvertTo-Json`
  const ret: string = JSON.parse((await $`${commandLineExp}`).stdout).CommandLine
  logger.silly(`getCommandLine: ${ret}`)
  return ret
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
  const instanceExp = /".*"\s"?--instance"?\s"?([^"\s]*)"?/g
  const res = [...cmd.matchAll(instanceExp)].map((v) => v[1])
  console.log('instance Name:')
  console.log(res)
  return res ? res[0] : 'unknown'
}

@Singleton
class WindowsAdapter implements EmulatorAdapter {
  protected async getBluestack (e: Emulator): Promise<void> {
    // const confPortExp = /bst.instance.Nougat64_?\d?.status.adb_port="(\d{4,6})"/g
    // const e: Emulator = { pname, pid }
    e.config = 'BlueStacks'
    e.adbPath = path.join(
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
    if (e.adbPath.includes('BluestacksCN')) {
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
              e.displayName = 'BlueStack CN [regedit]'
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
        e.displayName = 'BlueStack CN [no regedit]'
      }
    } else {
      assert(
        existsSync(confPath),
        `bluestacks.conf not exist! path: ${confPath}`
      )
      const conf = readFileSync(confPath, 'utf-8') // 读bluestacks.conf文件
      const confPortInstanceExp = arg ? RegExp(`bst.instance.${arg}.status.adb_port="(\\d{4,6})"`) : /bst.instance.(?:.*).status.adb_port="(\d{4,6})"/
      const confPort = conf.match(confPortInstanceExp)
      console.log('confport:')
      e.displayName = 'BlueStack Global'
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
    /**
     * 逍遥模拟器获取流程：
     *  1. 根据"MEmuHeadless.exe"获取pid
     *  2. 通过GetCommandLine获取命令行, 其--comment参数为模拟器实际文件夹名, 假设为vm1
     *  3. 构造路径"F:\EMULATORS\xyaz\Microvirt\MEmu\MemuHyperv VMs\vm1"
     *  4. 在路径下面有Memu.memu文件，构造正则提取以下示例行中的hostport
     *  <Forwarding name="ADB" proto="1" hostip="127.0.0.1" hostport="21503" guestip="10.0.2.15" guestport="5555"/>
     */
    logger.silly('Get XY info')
    e.adbPath = path.resolve(
      path.dirname(await getPnamePath('Memu.exe')),
      'adb.exe'
    )
    logger.silly('XY adb_path: ', e.adbPath)

    e.commandLine = await getCommandLine(e.pid)
    const confName = e.commandLine.match(/--comment ([^\s]+)/)
    if (confName) {
      const confPath = path.resolve(path.dirname(await getPnamePath('Memu.exe')), 'MemuHyperv VMs', confName[1], `${confName[1]}.memu`)
      logger.silly(`XY conf_path: ${confPath}`)
      assert(
        existsSync(confPath),
        `Memu.memu not exist! path: ${confPath}`
      )
      const confDetail = readFileSync(confPath, 'utf-8') // 读Memu.memu文件
      const confPortExp = confDetail.match(/<Forwarding name="ADB" proto="1" hostip="127.0.0.1" hostport="(\d+)"/)
      if (confPortExp) {
        e.address = `127.0.0.1:${confPortExp[1]}`
      }
    }
    e.config = 'XYAZ'
    e.displayName = '逍遥模拟器'
  }

  protected async getNox (e: Emulator): Promise<void> {
    // const e: Emulator = { pname, pid }

    e.adbPath = path.resolve(
      path.dirname(await getPnamePath('Nox.exe')),
      'nox_adb.exe'
    )
    logger.silly(`nox adb_path: ${e.adbPath}`)
    const regExp = /127.0.0.1:(\d{4,5})\s*/g;
    [...(await $`"${e.adbPath}" devices`).stdout.matchAll(regExp)]
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
    e.displayName = '夜神模拟器'
    // return e
  }

  protected async getMumu (e: Emulator): Promise<void> {
    // MuMu的adb端口仅限7555, 所以, 请不要使用MuMu多开!
    // 流程: 有"NemuHeadless.exe"进程后，就去抓'NemuPlayer.exe'的路径.
    const emuPathExp = await getPnamePath('NemuPlayer.exe') // 模拟器启动器路径
    e.adbPath = path.resolve(emuPathExp, '../../vmonitor/bin/adb_server.exe') // 模拟器adb路径
    e.address = '127.0.0.1:7555' // 不测端口了，唯一指定7555
    const cmd = await getCommandLine(e.pid) // 启动命令, 提取出--startvm选项, 然后和emuPathExp拼接得到实际启动命令.
    const startvm = cmd.match(/--startvm ([^\s]+)/) // FIXME: 写错了
    if (startvm) {
      e.commandLine = '"' + emuPathExp + '" -m ' + startvm[1] // 实际命令行启动指令
    }
    e.displayName = 'MuMu模拟器'
    e.config = 'MuMuEmulator'
  }

  protected async getLd (e: Emulator): Promise<void> {
    // 雷电模拟器识别
    e.config = 'LDPlayer'
    e.displayName = '雷电模拟器'
    const emulatorPath = await getPnamePath('dnplayer.exe') // dnplayer.exe路径, 和模拟器配置信息等在一起
    const consolePath = path.resolve(path.dirname(emulatorPath), 'dnconsole.exe') // dnconsole.exe路径, 用于启动模拟器
    e.adbPath = path.resolve(path.dirname(emulatorPath), 'adb.exe') // adb路径
    const cmd = await getCommandLine(e.pid) // headless.exe的启动参数, 实际上是不可用的, 提取其中的comment为模拟器真实名称, statvm为模拟器uuid
    const statvm = cmd.match(/--startvm (\w*-\w*-\w*-\w*-\w*)/) // 获取模拟器uuid, statvm
    const realName = cmd.match(/--comment ([\d+\w]*) /) // 获取真实名称, realName
    logger.silly('realname', realName)
    logger.silly('startvm', statvm)
    if (!realName || !statvm) return
    const confPath = path.resolve(path.dirname(emulatorPath), 'vms', 'config', `${realName[1]}.config`) // 模拟器配置文件路径
    logger.silly(`LD conf_path: ${confPath}`)
    assert(
      existsSync(confPath),
      `${realName[1]}.config not exist! path: ${confPath}`
    )
    const confDetail = readFileSync(confPath, 'utf-8') // 读config
    const displayName = confDetail.match(/"statusSettings.playerName":\s*"([^"]+)"/) // 读配置文件, 获取模拟器显示名称 displayName
    if (displayName) { // 当新建模拟器时, 不一定会有此选项, 如果没有, 则取realName最后一个数字, 手动拼接
      e.commandLine = '"' + consolePath + '" launch --name ' + displayName[1] // 真实命令行启动指令
    } else {
      e.commandLine = '"' + consolePath + '" launch --name 雷电模拟器-' + realName[1].slice(-1) // 真实命令行启动指令
    }
    const LdVBoxHeadlessPath = await getPnamePath('LdVBoxHeadless.exe') // LdVBoxHeadless.exe路径
    const VBoxManagePath = path.resolve(path.dirname(LdVBoxHeadlessPath), 'VBoxManage.exe') // VBoxManage.exe路径
    const port = (await $`"${VBoxManagePath}" showvminfo ${statvm[1]} --machinereadable`).stdout.match(/Forwarding\(1\)="tcp_5\d\d\d_5\d\d\d,tcp,,(\d*),,/)
    logger.silly('port', port)
    if (port) {
      e.address = `127.0.0.1:${port[1]}`
    }
    console.log(e)
  }

  async getAdbDevices (): Promise<Device[]> {
    const emulators: Device[] = []
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
    // await $`"${defaultAdbPath}" disconnect`
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
      const uuid = await getDeviceUuid(e.address as string, defaultAdbPath) // 不再使用模拟器自带的adb来获取uuid
      if (uuid) {
        e.uuid = uuid
      }
      logger.silly(`emulator: ${JSON.stringify(e)}`)
    }
    return emulators
  }
}

export default new WindowsAdapter()
