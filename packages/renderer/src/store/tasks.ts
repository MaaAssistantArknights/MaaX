import { defineStore } from 'pinia'
import _ from 'lodash'
import compareObjKey from '@/utils/task_configure'
import { show } from '@/utils/message'
import { i18n } from '@/i18n'
import { TaskChainMap } from '@common/enum/callback'

const { t } = i18n.global
export interface TaskState {
  selfIncreaseId: number // 奇怪的全局任务自增id, 用于查找任务
  deviceTasks: Record<string, Task[]>
}

export interface TaskAction {
  updateTaskStatus: (
    uuid: string,
    taskId: number,
    status: TaskStatus,
    progress: number
  ) => void
  mergeTaskResult: (uuid: string, taskId: number, patch: any) => void
  updateTaskConfigurations: (uuid: string, taskId: number, key: string, value: any) => void
  changeTaskOrder: (uuid: string, from: number, to: number) => void
  updateTask: (uuid: string, tasks: Task[]) => void
  newTask: (uuid: string) => void
  getTask: (uuid: string, predicate: (task: Task) => boolean) => Task | undefined
  getTaskProcess: (uuid: string, taskId: string) => number | undefined
  stopAllTasks: (uuid: string) => void
  genUniqueId: () => number
  copyTask: (uuid: string, index: number) => boolean
  deleteTask: (uuid: string, index: number) => boolean
  fixTaskList: (uuid: string) => void
  run: (uuid: string) => Promise<void>
}

export const defaultSelfIncreaseId = 100000 // 初始自增id

const defaultTaskConf: Record<string, Task> = {
  emulator: {
    name: 'emulator',
    task_id: -1,
    title: '启动模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      commandLine: '',
      delay: 300 // 执行后续任务的等待延迟
    },
    results: {}
  },
  startup: {
    name: 'startup',
    task_id: -1,
    title: '开始唤醒',
    status: 'idle',
    enable: true,
    configurations: {
      client_type: 'Official', // 区服 Official | Bilibili
      start_game_enabled: true // 模拟器启动游戏
    },
    results: {}
  },
  fight: {
    name: 'fight',
    task_id: -1,
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
    },
    results: {}
  },
  recruit: {
    name: 'recruit',
    task_id: -1,
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
    },
    results: {}
  },
  infrast: {
    name: 'infrast',
    task_id: -1,
    title: '基建换班',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0, // 保留模式
      facility: [
        'Mfg',
        'Trade',
        'Power',
        'Control',
        'Reception',
        'Office',
        'Dorm'
      ],
      drones: '_NotUse', // 无人机用途
      threshold: 0.3,
      replenish: false, // 自动源石补货
      drone_usage: 'None',
      mood_limit: 6
    },
    results: {}
  },
  visit: {
    name: 'visit',
    task_id: -1,
    title: '访问好友',
    status: 'idle',
    enable: true,
    configurations: {},
    results: {}
  },
  mall: {
    name: 'mall',
    task_id: -1,
    title: '收取信用及购物',
    status: 'idle',
    enable: true,
    configurations: {
      shopping: true,
      buy_first: ['龙门币', '招聘许可', '赤金'],
      blacklist: ['家具零件', '加急许可']
    },
    results: {}
  },
  award: {
    name: 'award',
    task_id: -1,
    title: '领取日常奖励',
    status: 'idle',
    enable: true,
    configurations: {},
    results: {}
  },
  rogue: {
    name: 'rogue',
    task_id: -1,
    title: '无限刷肉鸽',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0
    },
    results: {}
  },
  shutdown: {
    name: 'shutdown',
    task_id: -1,
    title: '关机/关闭模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      option: 'shutdownComputer',
      delay: 300
    },
    results: {}
  }
}

export const defaultTask = Object.values(defaultTaskConf)

const useTaskStore = defineStore<'tasks', TaskState, {}, TaskAction>('tasks', {
  state: () => {
    return {
      deviceTasks: {},
      selfIncreaseId: 0
    }
  },
  actions: {
    updateTaskConfigurations (uuid, taskId, key, value) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.task_id === taskId)
      if (task) {
        _.set(task.configurations, key, value)
      }
    },
    updateTaskStatus (uuid, taskId, status, progress) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.task_id === taskId)
      if (task) {
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
    mergeTaskResult (uuid, taskId, patch) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.task_id === taskId)
      if (task) {
        _.merge(task.results, patch)
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
        deviceTasks[uuid].push(_.cloneDeep(v))
      }
    },
    getTask (uuid, predicate) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find(predicate)
      return task
    },
    getTaskProcess (uuid, taskId) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.name === taskId)
      return task != null ? task.progress : 0
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
    copyTask (uuid, index) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.at(index)
      if (task) {
        const newTask: Task = {
          ..._.cloneDeep(task),
          task_id: -1,
          showResult: false,
          status: 'idle',
          startTime: undefined,
          endTime: undefined,
          progress: undefined,
          results: {}
        }
        origin.splice(index, 0, newTask)
        return true
      }
      return false
    },
    deleteTask (uuid, index) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      if (origin) {
        const target = origin[index]
        const nameCount = origin.reduce(
          (acc, cur) => (cur.name === target.name ? acc + 1 : acc),
          0
        )
        if (nameCount < 2) return false
        origin.splice(index, 1)
        return true
      }
      return false
    },
    fixTaskList (uuid) {
      console.log('call fixTaskList')
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      origin?.forEach((task) => {
        if (
          !compareObjKey(
            task.configurations,
            defaultTaskConf[task.name].configurations
          )
        ) {
          show(
            t('task.common.fixTask', [task.title]),
            { type: 'warning', duration: 0, closable: true },
            false
          )
          task.configurations = defaultTaskConf[task.name].configurations
        }
      })
    },
    async run (uuid) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.status === 'idle' && task.enable) // find next task to execute
      if (task) {
        if (task.name === 'emulator') {
          // TODO
        } else if (task.name === 'shutdown') {
          // TODO
        } else {
          task.status = 'waiting'
          const taskId = await window.ipcRenderer.invoke(
            'main.CoreLoader:appendTask',
            {
              uuid: uuid,
              type: TaskChainMap[task.name],
              params: _.cloneDeep(task.configurations)
            }
          )
          task.task_id = taskId
          await this.run(uuid)
        }
      }
    }
  }
})

export default useTaskStore
