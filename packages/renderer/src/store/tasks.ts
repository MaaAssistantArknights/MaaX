import { defineStore } from "pinia"
import _ from "lodash"

export interface TaskState {
  deviceTasks: Record<string, Task[]>
}

export interface TaskAction {
  updateTaskStatus(
    uuid: string,
    taskId: string,
    status: TaskStatus,
    progress: number
  ): void
  changeTaskOrder(uuid: string, from: number, to: number): void
  updateTask(uuid: string, tasks: Task[]): void
}

// Demo only
const taskDemo: Task[] = [
  {
    id: "startup",
    title: "开始唤醒",
    status: "processing",
    progress: 50,
    startTime: Date.now(),
    enable: true,
    configurations: {},
  },
  {
    id: "fight",
    title: "刷理智",
    status: "idle",
    enable: true,
    configurations: {
      medicine: true,
      expiration_first: true,
      originite_prime: true,
      levels: [],
    },
  },
  {
    id: "recruit",
    title: "自动公招",
    status: "idle",
    enable: true,
    configurations: {
      refresh_normal_tags: true,
      use_expedited_plan: false,
      maximum_times_of_recruitments: 6,
      recognitions: {
        "3 Stars": true,
        "4 Stars": true,
        "5 Stars": true,
      },
    },
  },
  {
    id: "infrast",
    title: "基建换班",
    status: "idle",
    enable: true,
    configurations: {
      facilities: [
        {
          name: "ManufacturingStation",
          enabled: true,
        },
        {
          name: "TradingStation",
          enabled: true,
        },
        {
          name: "ControlCenter",
          enabled: true,
        },
        {
          name: "PowerStation",
          enabled: true,
        },
        {
          name: "MeetingRoom",
          enabled: true,
        },
        {
          name: "Office",
          enabled: true,
        },
        {
          name: "Dormitory",
          enabled: true,
        },
      ],
      drone_usage: "None",
      mood_limit: 6,
    },
  },
  {
    id: "visit",
    title: "访问好友",
    status: "idle",
    enable: true,
    configurations: {},
  },
  {
    id: "mall",
    title: "收取信用及购物",
    status: "idle",
    enable: true,
    configurations: {},
  },
  {
    id: "award",
    title: "领取日常奖励",
    status: "idle",
    enable: true,
    configurations: {},
  },
]

const useTaskStore = defineStore<"tasks", TaskState, {}, TaskAction>("tasks", {
  state: () => {
    return {
      deviceTasks: {
        "12345678-90abcdefg": taskDemo,
        connected: taskDemo,
        tasking: taskDemo,
      },
    }
  },
  actions: {
    updateTaskStatus(uuid, taskId, status, progress) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      const task = origin?.find((task) => task.id === taskId)
      if (task) {
        task.status = status
        task.progress = progress
      }
    },
    changeTaskOrder(uuid, from, to) {
      const { deviceTasks } = this
      const origin = deviceTasks[uuid]
      if (origin) {
        const item = origin.splice(from, 1)
        origin.splice(to, 0, item[0])
      }
    },
    updateTask(uuid, tasks) {
      const { deviceTasks } = this
      deviceTasks[uuid] = tasks
    },
  },
})

export default useTaskStore
