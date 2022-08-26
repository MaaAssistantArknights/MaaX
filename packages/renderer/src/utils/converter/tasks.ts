import { show } from '../message'
import logger from '@/hooks/caller/logger'

export async function taskEmulator (task: Task['configurations']): Promise<void> {
  console.log('before start emu')
  console.log(task)
  window.ipcRenderer.send('10001', task.uuid, task.taskId) // 启动模拟器 子任务开始
  await window.ipcRenderer.invoke('main.CoreLoader:startEmulator', {
    emulator_path: task.emulator_path,
    arg: task.arg
  })
  console.log('after start')
  setTimeout(() => {
    (async () => {
      const devices: any[] = await window.ipcRenderer.invoke('main.DeviceDetector:getEmulators')
      // 等待时间结束后进行一次设备搜索，但不合并结果
      const device = devices.find(device => device.uuid === task.uuid)// 检查指定uuid的设备是否存在
      if (device) { // 设备活了
        const connectStatus = await window.ipcRenderer.invoke('main.CoreLoader:createExAndConnect', { // 创建连接
          address: device.address,
          uuid: device.uuid,
          adb_path: device.adbPath,
          config: device.config
        })
        logger.debug(connectStatus)
        window.ipcRenderer.send('10002', task.uuid, task.taskId) // 启动模拟器 子任务完成
        await window.ipcRenderer.invoke('main.CoreLoader:start', { uuid: device.uuid }) // 启动后续任务
      } else { // 设备没活
        show('启动设备失败, 请前往github上提交issue', { type: 'error', duration: 0 })
      }
    })()
  }, (task.delay as number) * 1000)
}

function * taskGame (task: Task['configurations']): Generator<object, void, boolean> {
  yield {
    server: task.server // 区服
  }
}

function * taskStartUp (task: Task['configurations']): Generator<object, void, boolean> {
  // 无配置选项
  yield {}
}

function * taskFight (task: Task['configurations']): Generator<object, void, boolean> {
  let ret = {
    stage: { current: '', last: 'LastBattle' }[
      (task.special as any).type as string
    ], // 先整上次/当前关卡
    medicine: task.medicine, // 使用理智药数量
    stones: task.stone, // 使用源石数量
    times: (task.special as any).times,
    report_to_penguin: true, // TODO: 是否上传到企鹅物流, 可选, 默认false
    penguin_id: '', // TODO: 接受回调的物流id
    server: 'CN' // TODO: 企鹅物流上传区服
  }

  //  if (ret.times !== 0)
  yield ret

  for (const level of (task.levels as any)) {
    if (level.times !== 0) {
      ret = {
        stage: level.code,
        medicine: task.medicine, // 使用理智药数量
        stones: task.stone, // 使用源石数量
        times: level.times,
        report_to_penguin: true, // TODO: 是否上传到企鹅物流, 可选, 默认false
        penguin_id: '', // TODO: 接受回调的物流id
        server: 'CN' // TODO: 企鹅物流上传区服
      }
      yield ret
    }
  }
}

function * taskRecruit (task: Task['configurations']): Generator<object, void, boolean> {
  const select: number[] = []
  const confirm: number[] = []
  for (const [key, value] of Object.entries(task.recognitions as Object)) {
    if (value) confirm.push(parseInt(key))
    if (value && parseInt(key) !== 3) select.push(parseInt(key)) // 不选择3星词条.
  }

  const ret = {
    refresh: task.refresh_normal_tags,
    select: select,
    confirm: confirm,
    times: task.maximum_times_of_recruitments,
    expedite: task.use_expedited_plan,
    expedite_times: task.maximum_times_of_recruitments // TODO: 加急次数, UI没有这个选项
  }
  console.log(ret)
  yield ret
}

function * taskInfrast (task: Task['configurations']): Generator<object, void, boolean> {
  const droneTranslate: Record<string, string> = {
    None: '_NotUse',
    LMD: 'Money',
    'Originium Shard': 'SyntheticJade',
    'Battle Record': 'CombatRecord',
    'Pure Gold': 'PureGold',
    Orumdum: 'OriginStone',
    Chip: 'Chip'
  }

  const facilityTranslate: Record<string, string> = {
    ManufacturingStation: 'Mfg',
    TradingStation: 'Trade',
    ControlCenter: 'Control',
    PowerStation: 'Power',
    MeetingRoom: 'Reception',
    Office: 'Office',
    Dormitory: 'Dorm'
  }

  const facilities: string[] = [];
  (task.facilities as object[]).forEach((room: any) => {
    if (room.enabled) facilities.push(facilityTranslate[room.name])
  })
  const ret = {
    // "mode": 0, // 换班模式
    facility: facilities, // 换班顺序
    drones: droneTranslate[task.drone_usage as string], // 无人机用途
    threshold: ((task.mood_limit as number) / 23).toFixed(1), // 换班心情阈值
    replenish: true // TODO: 源石碎片自动补货
  }
  console.log(ret)
  yield ret
}

function * taskVisit (task: Task['configurations']): Generator<object, void, boolean> {
  // 没有配置项
  yield {}
}

function * taskMall (task: Task['configurations']): Generator<object, void, boolean> {
  // 领取信用以及商店购物

  const ret = {
    shopping: true, // TODO: 可以只收取信用而不购物, UI中无选项, 虽然感觉这个功能没啥用
    buy_first: [...(task.buy_first as Set<string>).keys()],
    blacklist: [...(task.blacklist as Set<string>).keys()],
    is_black_list: true
  }

  yield ret
}

function * taskAward (task: Task['configurations']): Generator<object, void, boolean> {
  // 没有配置项
  yield {}
}
function * taskRogue (task: Task['configurations']): Generator<object, void, boolean> {
  enum rogueTranslate {
    ToTheEnd = 0,
    AfterFirstLevel,
    AfterMoney,
  }
  const ret = {
    mode: rogueTranslate[task.strategy as number], // 肉鸽战斗模式, 0-尽可能往后打 1-第一层投资完源石就退出 2-投资后退出
    // eslint-disable-next-line vue/max-len
    opers: [] // TODO: 参考 https://github.com/MaaAssistantArknights/MaaAssistantArknights/blob/dev/docs/%E9%9B%86%E6%88%90%E6%96%87%E6%A1%A3.md?plain=1#L128-L137
  }
  yield ret
}

export function taskShutdown (task: Task['configurations']): void {
  // 没有配置项

}

export const uiTasks = ['emulator', 'shutdown']

export const handleCoreTask: Record<
string,
(task: Task['configurations']) => Generator<object, void, boolean> > = {
  startup: taskStartUp,
  game: taskGame,
  fight: taskFight,
  recruit: taskRecruit,
  infrast: taskInfrast,
  visit: taskVisit,
  mall: taskMall,
  award: taskAward,
  rogue: taskRogue
}
