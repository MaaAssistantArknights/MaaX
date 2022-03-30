function taskEmulator (task: Task['configurations']) {
  console.log('before start emu')
  console.log(task)
  window.ipcRenderer.send('10001', task.uuid, task.taskId) //
  window.ipcRenderer.invoke('asst:startEmulator', {
    emulator_path: task.emulator_path,
    arg: task.arg
  })
  console.log('after start')
  setTimeout(() => {
    window.ipcRenderer.send('10002', task.uuid, task.taskId)
  }, (task.delay as number) * 1000)
}

function taskGame (task: Task['configurations']) {
  return {
    server: task.server // 区服
  }
}

function taskStartUp (task: Task['configurations']) {
  // 无配置选项
  return {}
}

function taskFight (task: Task['configurations']) {
  const ret = [
    {
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
  ];
  (task.levels as any).forEach((level: any) => {
    if (level.times != 0) {
      ret.push({
        stage: level.code,
        medicine: task.medicine, // 使用理智药数量
        stones: task.stone, // 使用源石数量
        times: level.times,
        report_to_penguin: true, // TODO: 是否上传到企鹅物流, 可选, 默认false
        penguin_id: '', // TODO: 接受回调的物流id
        server: 'CN' // TODO: 企鹅物流上传区服
      })
    }
  })
  return ret
}

function taskRecruit (task: Task['configurations']) {
  const select: number[] = []
  const confirm: number[] = []
  for (const [key, value] of Object.entries(task.recognitions as Object)) {
    if (value) confirm.push(parseInt(key))
    if (value && parseInt(key) != 3) select.push(parseInt(key)) // 不选择3星词条.
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
  return ret
}

function taskInfrast (task: Task['configurations']) {
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
  return ret
}

function taskVisit (task: Task['configurations']) {
  // 没有配置项
  return {}
}

function taskMall (task: Task['configurations']) {
  // 领取信用以及商店购物

  return {
    shopping: true, // TODO: 可以只收取信用而不购物, UI中无选项, 虽然感觉这个功能没啥用
    shopping_list: [...(task.exclude as Set<string>).keys()],
    is_black_list: true
  }
}

function taskAward (task: Task['configurations']) {
  // 没有配置项
  return {}
}
function taskRogue (task: Task['configurations']) {
  enum rogueTranslate {
    ToTheEnd = 0,
    AfterFirstLevel,
    AfterMoney,
  }
  return {
    mode: rogueTranslate[task.strategy as number], // 肉鸽战斗模式, 0-尽可能往后打 1-第一层投资完源石就退出 2-投资后退出
    // eslint-disable-next-line vue/max-len
    opers: [] // TODO: 参考 https://github.com/MaaAssistantArknights/MaaAssistantArknights/blob/dev/docs/%E9%9B%86%E6%88%90%E6%96%87%E6%A1%A3.md?plain=1#L128-L137
  }
}

function taskShutdown (task: Task['configurations']) {
  // 没有配置项
  return {}
}

export const uiTasks = ['emulator', 'shutdown']

export const handleSingleTask: Record<
string,
(task: Task['configurations']) => object | void | object[]
> = {
  emulator: taskEmulator,
  startup: taskStartUp,
  fight: taskFight,
  recruit: taskRecruit,
  infrast: taskInfrast,
  visit: taskVisit,
  mall: taskMall,
  award: taskAward,
  rogue: taskRogue
}
