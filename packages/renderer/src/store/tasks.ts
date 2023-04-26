import { defineStore } from 'pinia'
import _ from 'lodash'
import { compareObjKey } from '@/utils/task_helper'
import logger from '@/hooks/caller/logger'

export interface TaskState {
  deviceTasks: Record<string, TaskGroups>
}

export interface TaskAction {
  updateTaskStatus: (
    uuid: string,
    taskId: number,
    status: TaskStatus,
    progress: number
  ) => void
  mergeTaskResult: (uuid: string, taskId: number, patch: any) => void
  updateTaskConfigurations: (
    uuid: string,
    key: string,
    value: any,
    predicate: (task: Task, index: number) => boolean
  ) => void
  changeTaskOrder: (uuid: string, from: number, to: number) => void
  updateTask: (uuid: string, tasks: Task[]) => void
  newTask: () => Task[]
  initDeviceTask: (uuid: string) => void
  newTaskGroup: (uuid: string) => TaskGroup
  getCurrentTaskGroup: (uuid: string) => TaskGroup | undefined
  changeTaskGroupName: (
    uuid: string,
    task_group_id: number,
    name: string
  ) => void
  deleteTaskGroup: (uuid: string, task_group_id: number) => void
  getTask: (
    uuid: string,
    predicate: (task: Task) => boolean
  ) => Task | undefined
  getTaskProcess: (uuid: string, taskId: string) => number | undefined
  stopAllTasks: (uuid: string) => void
  copyTask: (uuid: string, index: number) => boolean
  copyTaskFromTemplate: (uuid: string, task_name: Task['name']) => boolean
  deleteTask: (uuid: string, index: number) => boolean
  fixTaskList: (uuid: string) => void
  resetToIdle: (uuid: string) => void
}

export const taskTemplate: {
  [key in Exclude<Task['name'], 'CloseDown' | 'Copilot'>]: __GetTask<key>
} = {
  Emulator: {
    name: 'Emulator',
    task_id: -1,
    title: '启动模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      commandLine: '',
      delay: 300, // 执行后续任务的等待延迟
    },
    results: {},
  },
  StartUp: {
    name: 'StartUp',
    task_id: -1,
    title: '开始唤醒',
    status: 'idle',
    enable: true,
    configurations: {
      client_type: 'Official', // 区服 Official | Bilibili
      start_game_enabled: true, // 模拟器启动游戏
    },
    results: {},
  },
  Fight: {
    name: 'Fight',
    task_id: -1,
    title: '代理作战',
    status: 'idle',
    enable: true,
    configurations: {
      stage: '', // 关卡名
      medicine: 0,
      stone: 0,
      times: 999,
      drops: {}, // "30011": 1, 只保留一个元素
      report_to_penguin: false,
      server: 'CN', // 影响掉落识别与上传
      client_type: 'Official', // 断线重连服务器
      DrGrandet: false, // 在碎石确认界面等待，直到当前的 1 点理智恢复完成后再立刻碎石
    },
    results: {},
  },
  Recruit: {
    name: 'Recruit',
    task_id: -1,
    title: '自动公招',
    status: 'idle',
    enable: true,
    configurations: {
      refresh: true, // 自动刷新三星词条
      select: [3, 4, 5, 6],
      confirm: [3, 4],
      times: 4,
      set_time: true,
      expedite: false,
      expedite_times: 0,
      skip_robot: true,
      recruitment_time: {
        3: 540,
        4: 540,
        5: 540,
      },
      report_to_penguin: false,
      report_to_yituliu: false,
    },
    results: {},
  },
  Infrast: {
    name: 'Infrast',
    task_id: -1,
    title: '基建换班',
    status: 'idle',
    enable: true,
    configurations: {
      mode: 0, // 0: 单设置最优  10000: 自定义换班, 读配置
      filename: '', // 自定义换班文件名
      plan_index: 0, // 使用配置中的方案序号，
      facility: [
        'Mfg',
        'Trade',
        'Power',
        'Control',
        'Reception',
        'Office',
        'Dorm',
      ],
      drones: '_NotUse', // 无人机用途
      threshold: 0.3,
      replenish: false, // 自动源石补货
    },
    results: {},
  },
  Mall: {
    name: 'Mall',
    task_id: -1,
    title: '收取信用及购物',
    status: 'idle',
    enable: true,
    configurations: {
      shopping: true,
      buy_first: ['龙门币', '招聘许可', '赤金'],
      blacklist: ['家具零件', '加急许可'],
    },
    results: {},
  },
  Award: {
    name: 'Award',
    task_id: -1,
    title: '领取日常奖励',
    status: 'idle',
    enable: true,
    configurations: {},
    results: {},
  },
  Roguelike: {
    name: 'Roguelike',
    task_id: -1,
    title: '无限刷肉鸽',
    status: 'idle',
    enable: true,
    configurations: {
      theme: 'Phantom',
      mode: 0,
      starts_count: 999,
      investment_enabled: true,
      investments_count: 999,
      stop_when_investment_full: true,
      squad: '指挥分队',
      roles: '取长补短',
      core_char: '',
      use_support: false,
      use_nonfriend_support: false,
    },
    results: {},
  },
  Shutdown: {
    name: 'Shutdown',
    task_id: -1,
    title: '关机/关闭模拟器',
    status: 'idle',
    enable: false,
    configurations: {
      option: 'shutdownComputer',
      delay: 300,
    },
    results: {},
  },
  Idle: {
    name: 'Idle',
    task_id: -1,
    title: '挂机',
    status: 'idle',
    enable: false,
    configurations: {
      delay: 600,
    },
    results: {},
  },
  // ReclamationAlgorithm: {
  //   name: 'ReclamationAlgorithm',
  //   task_id: -1,
  //   title: '生息演算',
  //   status: 'idle',
  //   enable: false,
  //   configurations: {
  //     mode: 0
  //   },
  //   results: {}
  // }
}

function hasTemplate(
  task_name: Task['name']
): task_name is Exclude<Task['name'], 'CloseDown' | 'Copilot'> {
  return task_name in taskTemplate
}

Object.freeze(taskTemplate)

const defaultTaskConf: typeof taskTemplate = {
  Emulator: _.cloneDeep(taskTemplate.Emulator),
  StartUp: _.cloneDeep(taskTemplate.StartUp),
  Fight: _.cloneDeep(taskTemplate.Fight),
  Recruit: _.cloneDeep(taskTemplate.Recruit),
  Infrast: _.cloneDeep(taskTemplate.Infrast),
  Mall: _.cloneDeep(taskTemplate.Mall),
  Award: _.cloneDeep(taskTemplate.Award),
  Roguelike: _.cloneDeep(taskTemplate.Roguelike),
  Shutdown: _.cloneDeep(taskTemplate.Shutdown),
  Idle: _.cloneDeep(taskTemplate.Idle),
}

export const defaultTask = Object.values(defaultTaskConf)

const useTaskStore = defineStore<'tasks', TaskState, {}, TaskAction>('tasks', {
  state: () => {
    return {
      deviceTasks: {},
    }
  },
  actions: {
    updateTaskConfigurations(uuid, key, value, predicate) {
      const tasks = this.getCurrentTaskGroup(uuid)?.tasks
      const task = tasks?.find(predicate)
      if (task) {
        const configurations = _.set(task.configurations, key, value)
        if (
          task.task_id > 0 &&
          ['processing', 'waiting'].includes(task.status)
        ) {
          window.ipcRenderer.invoke('main.CoreLoader:setTaskParams', {
            uuid,
            task_id: task.task_id,
            params: configurations,
          })
        }
      }
    },
    updateTaskStatus(uuid, taskId, status, progress) {
      const task = this.getTask(uuid, task => task.task_id === taskId)
      if (!task) {
        logger.warn(`Task ${uuid}|${taskId} not found`)
      }
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
              task.results = {}
              break
            case 'skipped':
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
    mergeTaskResult(uuid, taskId, patch) {
      const task = this.getTask(uuid, task => task.task_id === taskId)
      if (task) {
        _.mergeWith(task.results, patch, (objValue, srcValue) => {
          if (_.isArray(objValue)) {
            return objValue.concat(srcValue)
          }
        })
      }
    },
    changeTaskOrder(uuid, from, to) {
      const taskGroup = this.getCurrentTaskGroup(uuid)
      if (taskGroup) {
        const item = taskGroup.tasks.splice(from, 1)
        taskGroup.tasks.splice(to, 0, item[0])
      }
    },
    updateTask(uuid, tasks) {
      const taskGroup = this.getCurrentTaskGroup(uuid)
      if (taskGroup) taskGroup.tasks = tasks
    },
    newTask() {
      const tasks = []
      for (const [, v] of Object.entries(defaultTaskConf)) {
        tasks.push(_.cloneDeep(v))
      }
      return tasks
    },
    getTask(uuid, predicate) {
      const tasks = this.getCurrentTaskGroup(uuid)?.tasks
      const task = tasks?.find(predicate)
      return task
    },
    getTaskProcess(uuid, taskId) {
      const task = this.getTask(uuid, task => task.name === taskId)
      return task != null ? task.progress : 0
    },
    stopAllTasks(uuid) {
      const origin = this.getCurrentTaskGroup(uuid)?.tasks

      if (origin) {
        origin.forEach(task => {
          if (task.status !== 'idle') {
            task.status = 'stopped'
          }
          if (task.schedule_id) {
            clearTimeout(task.schedule_id)
            task.schedule_id = null
          }
        })
      }
      this.resetToIdle(uuid)
    },
    copyTask(uuid, index) {
      const tasks = this.getCurrentTaskGroup(uuid)?.tasks
      const task = tasks?.at(index)
      if (tasks && task) {
        const newTask: Task = {
          ..._.cloneDeep(task),
          task_id: -1,
          showResult: false,
          status: 'idle',
          startTime: undefined,
          endTime: undefined,
          progress: undefined,
          results: {},
        }
        tasks.splice(index, 0, newTask)
        return true
      }
      return false
    },
    deleteTask(uuid, index) {
      const taskGroup = this.getCurrentTaskGroup(uuid)?.tasks
      const origin = taskGroup?.at(index)
      if (taskGroup && origin) {
        const target = taskGroup[index]
        const nameCount = taskGroup.reduce(
          (acc, cur) => (cur.name === target.name ? acc + 1 : acc),
          0
        )
        // 允许删除只有一份的任务
        if (nameCount < 1) return false
        taskGroup.splice(index, 1)
        return true
      }
      return false
    },
    fixTaskList(uuid) {
      const origin = this.getCurrentTaskGroup(uuid)?.tasks
      if (!origin) return
      // STEP 1. update task config.
      origin.forEach(task => {
        if (!hasTemplate(task.name)) {
          return
        }
        task.title = defaultTaskConf[task.name].title
        if (
          !compareObjKey(
            task.configurations,
            defaultTaskConf[task.name].configurations
          )
        ) {
          // show(
          //   t('task.common.fixTask', [task.title]),
          //   { type: 'warning', duration: 0, closable: true },
          //   false
          // )
          logger.info('task fixed')
          task.configurations = defaultTaskConf[task.name].configurations
        }
      })

      // STEP 2. add new tasks.
      for (const [, conf] of Object.entries(defaultTaskConf)) {
        if (!origin?.some(t => t.name === conf.name)) {
          origin?.push(_.cloneDeep(conf))
        }
      }
    },
    copyTaskFromTemplate(uuid, task_name) {
      const origin = this.getCurrentTaskGroup(uuid)?.tasks
      if (hasTemplate(task_name)) {
        origin?.push(taskTemplate[task_name])
        return true
      } else {
        return false
      }
    },
    newTaskGroup(uuid) {
      // 新建任务组
      const origin = this.deviceTasks[uuid]
      let group_id = 1
      if (origin) {
        group_id = Math.max(...origin.groups.map(group => group.id), 1) + 1
      }
      const newTaskGroup: TaskGroup = {
        id: group_id,
        name: `New Task Group #${group_id}`,
        tasks: this.newTask(),
      }
      return newTaskGroup
    },
    initDeviceTask(uuid) {
      const newGroup = this.newTaskGroup(uuid)
      this.deviceTasks[uuid] = {
        currentId: 1,
        groups: [newGroup],
      }
    },
    getCurrentTaskGroup(uuid) {
      const origin = this.deviceTasks[uuid]
      const current = origin?.currentId
      return origin?.groups.find(group => group.id === current)
    },
    resetToIdle(uuid) {
      this.deviceTasks[uuid].groups.forEach(group => {
        group.tasks.forEach(task => {
          task.status = 'idle'
          task.progress = 0
          task.startTime = undefined
          task.endTime = undefined
        })
      })
    },
    changeTaskGroupName(uuid: string, task_group_id: number, name: string) {
      const origin = this.deviceTasks[uuid]
      const group = origin?.groups.find(group => group.id === task_group_id)
      if (group) {
        group.name = name
      }
    },
    deleteTaskGroup(uuid: string, task_group_id: number) {
      const origin = this.deviceTasks[uuid]
      if (origin.groups.length === 1) {
        throw new Error('taskGroupIsLast')
      }
      const group = origin?.groups.find(group => group.id === task_group_id)
      if (group) {
        if (group.tasks.some(task => task.status !== 'idle')) {
          throw new Error('taskIsRunning')
        }
        const index = origin.groups.indexOf(group)
        origin.groups.splice(index, 1)
        // 回到上一个任务组
        origin.currentId = origin.groups[index > 0 ? index - 1 : 0].id
      }
    },
  },
})

export default useTaskStore
