import { defineStore } from 'pinia'
import _ from 'lodash'
import compareObjKey from '@/utils/task_configure'
import { show } from '@/utils/message'
import { i18n } from '@/i18n'

const { t } = i18n.global
export interface TaskState {
  selfIncreaseId: number // 奇怪的全局任务自增id, 用于查找任务
  deviceTasks: Record<string, Task[]>
}

export interface TaskAction {
  updateTaskStatus: (
    uuid: string,
    taskId: string,
    status: TaskStatus,
    progress: number
  ) => void
  changeTaskOrder: (uuid: string, from: number, to: number) => void
  updateTask: (uuid: string, tasks: Task[]) => void
  newTask: (uuid: string) => void
  getTask: (uuid: string, taskId: string) => Task | undefined
  getTaskProcess: (uuid: string, taskId: string) => number | undefined
  stopAllTasks: (uuid: string) => void
  genUniqueId: () => number
  copyTask: (uuid: string, id: number) => boolean
  deleteTask: (uuid: string, id: number, name: string) => boolean
  fixTaskList: (uuid: string) => void
}

export const defaultSelfIncreaseId = 100000// 初始自增id

const defaultTaskConf = {
  emulator: {
    id: 'emulator',
    ui_id: 0,
    core_id: -1,
    title: '启动模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      commandLine: '',
      delay: 300 // 执行后续任务的等待延迟
    }
  },
  startup: {
    id: 'startup',
    ui_id: 0,
    core_id: -1,
    title: '启动客户端与自动唤醒',
    status: 'idle',
    enable: true,
    configurations: {
      client_type: 'Official', // 区服 Official | Bilibili
      start_game_enable: true // 模拟器启动游戏
    }
  },
  fight: {
    id: 'fight',
    ui_id: 0,
    core_id: -1,
    title: '代理作战',
    status: 'idle',
    enable: true,
    configurations: {
      stage: '', // 关卡名
      medicine: 0,
      stone: 0,
      times: 0,
      drops: {}, // "30011": 1, 只保留一个元素
      report_to_penguin: true,
      server: 'CN', // 影响掉落识别与上传
      client_type: 'Official' // 断线重连服务器
    }
  },
  recruit: {
    id: 'recruit',
    ui_id: 0,
    core_id: -1,
    title: '自动公招',
    status: 'idle',
    enable: true,
    configurations: {
      refresh: false, // 自动刷新三星词条
      select: [3, 4],
      confirm: [3, 4],
      times: 0,
      set_time: true,
      expedite: false,
      expedite_times: 0,
      skip_robot: true
    }
  },
  infrast: {
    id: 'infrast',
    ui_id: 0,
    core_id: -1,
    title: '基建换班',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0, // 保留模式
      facility: ['Mfg', 'Trade', 'Power', 'Control', 'Reception', 'Office', 'Dorm'],
      drones: '_NotUse', // 无人机用途
      threshold: 0.3,
      replenish: false, // 自动源石补货
      drone_usage: 'None',
      mood_limit: 6
    }
  },
  visit: {
    id: 'visit',
    ui_id: 0,
    core_id: -1,
    title: '访问好友',
    status: 'idle',
    enable: true,
    configurations: {}
  },
  mall: {
    id: 'mall',
    ui_id: 0,
    core_id: -1,
    title: '收取信用及购物',
    status: 'idle',
    enable: true,
    configurations: {
      shopping: true,
      buy_first: ['龙门币', '招聘许可', '赤金'],
      blacklist: ['家具零件', '加急许可']
    }
  },
  award: {
    id: 'award',
    ui_id: 0,
    core_id: -1,
    title: '领取日常奖励',
    status: 'idle',
    enable: true,
    configurations: {}
  },
  rogue: {
    id: 'rogue',
    ui_id: 0,
    core_id: -1,
    title: '无限刷肉鸽',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0
    }
  },
  shutdown: {
    id: 'shutdown',
    ui_id: 0,
    core_id: -1,
    title: '关机/关闭模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      option: 'shutdownComputer',
      delay: 300
    }
  }
}

export const defaultTask: Task[] = [
  {
    id: 'emulator',
    ui_id: 0,
    core_id: -1,
    title: '启动模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      commandLine: '',
      delay: 300 // 执行后续任务的等待延迟
    }
  },
  {
    id: 'startup',
    ui_id: 0,
    core_id: -1,
    title: '启动客户端与自动唤醒',
    status: 'idle',
    enable: true,
    configurations: {
      client_type: 'Official', // 区服 Official | Bilibili
      start_game_enable: true // 模拟器启动游戏
    }
  },
  {
    id: 'fight',
    ui_id: 0,
    core_id: -1,
    title: '代理作战',
    status: 'idle',
    enable: true,
    configurations: {
      stage: '', // 关卡名
      medicine: 0,
      stone: 0,
      times: 0,
      drops: {}, // "30011": 1, 只保留一个元素
      report_to_penguin: true,
      server: 'CN', // 影响掉落识别与上传
      client_type: 'Official' // 断线重连服务器
    }
  },
  {
    id: 'recruit',
    ui_id: 0,
    core_id: -1,
    title: '自动公招',
    status: 'idle',
    enable: true,
    configurations: {
      refresh: false, // 自动刷新三星词条
      select: [3, 4],
      confirm: [3, 4],
      times: 0,
      set_time: true,
      expedite: false,
      expedite_times: 0,
      skip_robot: true
      // refresh_normal_tags: true,
      // use_expedited_plan: false,
      // maximum_times_of_recruitments: 6,
      // recognitions: {
      //   '3 Stars': true,
      //   '4 Stars': true,
      //   '5 Stars': true
      // }
    }
  },
  {
    id: 'infrast',
    ui_id: 0,
    core_id: -1,
    title: '基建换班',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0, // 保留模式
      facility: ['Mfg', 'Trade', 'Power', 'Control', 'Reception', 'Office', 'Dorm'],
      drones: '_NotUse', // 无人机用途
      threshold: 0.3,
      replenish: false, // 自动源石补货
      // facilities: [
      //   {
      //     name: 'ManufacturingStation',
      //     enabled: true
      //   },
      //   {
      //     name: 'TradingStation',
      //     enabled: true
      //   },
      //   {
      //     name: 'ControlCenter',
      //     enabled: true
      //   },
      //   {
      //     name: 'PowerStation',
      //     enabled: true
      //   },
      //   {
      //     name: 'MeetingRoom',
      //     enabled: true
      //   },
      //   {
      //     name: 'Office',
      //     enabled: true
      //   },
      //   {
      //     name: 'Dormitory',
      //     enabled: true
      //   }
      // ],
      drone_usage: 'None',
      mood_limit: 6
    }
  },
  {
    id: 'visit',
    ui_id: 0,
    core_id: -1,
    title: '访问好友',
    status: 'idle',
    enable: true,
    configurations: {}
  },
  {
    id: 'mall',
    ui_id: 0,
    core_id: -1,
    title: '收取信用及购物',
    status: 'idle',
    enable: true,
    configurations: {
      shopping: true,
      buy_first: ['龙门币', '招聘许可', '赤金'],
      blacklist: ['家具零件', '加急许可']
    }
  },
  {
    id: 'award',
    ui_id: 0,
    core_id: -1,
    title: '领取日常奖励',
    status: 'idle',
    enable: true,
    configurations: {}
  },
  {
    id: 'rogue',
    ui_id: 0,
    core_id: -1,
    title: '无限刷肉鸽',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0
      // duration: 3600,
      // strategy: 'ToTheEnd',
      // operators: [{ name: '煌', skill: 2, skill_usage: 0 }, { name: '棘刺', skill: 3, skill_usage: 1 }]
    }
  },
  {
    id: 'shutdown',
    ui_id: 0,
    core_id: -1,
    title: '关机/关闭模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      option: 'shutdownComputer',
      delay: 300
    }
  }
]

const useTaskStore = defineStore<'tasks', TaskState, {}, TaskAction>('tasks', {
  state: () => {
    return {
      deviceTasks: {},
      selfIncreaseId: 0
    }
  },
  actions: {
    updateTaskStatus (uuid, taskId, status, progress) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.id === taskId)
      if (task != null) {
        const statusChanged = status !== task.status

        if (statusChanged) {
          switch (status) {
            case 'waiting':
              task.startTime = 0
              task.endTime = 0
              break
            case 'processing':
              task.startTime = Date.now()
              break
            case 'success':
            case 'exception':
              task.endTime = Date.now()
              break
          }
        }

        task.status = status
        task.progress = progress
      }
    },
    changeTaskOrder (uuid, from, to) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      if (origin) {
        const item = origin.splice(from, 1)
        origin.splice(to, 0, item[0])
      }
    },
    updateTask (uuid, tasks) {
      const { deviceTasks } = this
      deviceTasks[uuid] = tasks
    },
    newTask (uuid) {
      const { deviceTasks } = this
      deviceTasks[uuid] = []
      for (const [, v] of Object.entries(defaultTaskConf)) {
        deviceTasks[uuid].push(_.cloneDeep(v as Task))
      }
    },
    getTask (uuid, taskId) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.id === taskId)
      return task
    },
    getTaskProcess (uuid, taskId) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.id === taskId)
      return (task != null) ? task.progress : 0
    },
    stopAllTasks (uuid) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      if (origin) {
        origin.forEach((task) => {
          if (task.status !== 'idle') {
            task.status = 'stopped'
          }
        })
      }
    },
    genUniqueId () {
      this.selfIncreaseId++
      return this.selfIncreaseId
    },
    copyTask (uuid, id) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.ui_id === id)
      if (task) {
        const newTask = _.cloneDeep(task)
        newTask.ui_id = this.genUniqueId()
        newTask.core_id = -1
        origin.push(newTask)
        return true
      }
      return false
    },
    deleteTask (uuid, id, name) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const nameCount = origin?.filter((task) => task.id === name).length
      if (nameCount < 2) return false
      const task = origin?.find((task) => task.ui_id === id)
      if (task) {
        origin.splice(origin.indexOf(task), 1)
        return true
      }
      return false
    },
    fixTaskList (uuid) {
      console.log('call fixTaskList')
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      origin?.forEach((task) => {
        if (!compareObjKey(task.configurations, defaultTaskConf[task.id].configurations)) {
          show(t('task.common.fixTask', [task.title]), { type: 'warning', duration: 0, closable: true }, false)
          task.configurations = defaultTaskConf[task.id].configurations
        }
      })
    }
  }
})

export default useTaskStore
