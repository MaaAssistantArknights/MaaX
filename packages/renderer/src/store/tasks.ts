import { defineStore } from "pinia";
import _ from "lodash";

export interface TaskState {
  deviceTasks: Record<string, Task[]>;
}

export interface TaskAction {
  updateTaskStatus(
    uuid: string,
    taskId: string,
    status: TaskStatus,
    progress: number
  ): void;
  changeTaskOrder(uuid: string, from: number, to: number): void;
  updateTask(uuid: string, tasks: Task[]): void;
  newTask(uuid: string): void;
  getTask(uuid:string, taskId:string) : any;
  getTaskProcess(uuid: string, taskId:string): number | undefined;
}

export const defaultTask: Task[] = [
  {
    id: "startup",
    title: "开始唤醒",
    status: "idle",
    //progress: 50,
    //startTime: Date.now(),
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
      special: {
        type: "current",
        times: 0,
      },
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
    configurations: {
      exclude: new Set([]),
    },
  },
  {
    id: "award",
    title: "领取日常奖励",
    status: "idle",
    enable: true,
    configurations: {},
  },
  {
    id: "rogue",
    title: "无限刷肉鸽",
    status: "idle",
    enable: true,
    configurations: {
      strategy: "ToTheEnd",
      operators: [],
    },
  },
];

const useTaskStore = defineStore<"tasks", TaskState, {}, TaskAction>("tasks", {
  state: () => {
    return {
      deviceTasks: {},
    };
  },
  actions: {
    updateTaskStatus(uuid, taskId, status, progress) {
      const { deviceTasks } = this;
      const origin = deviceTasks[uuid];
      const task = origin?.find((task) => task.id === taskId);
      if (task) {
        task.status = status;
        task.progress = progress;
      }
    },
    changeTaskOrder(uuid, from, to) {
      const { deviceTasks } = this;
      const origin = deviceTasks[uuid];
      if (origin) {
        const item = origin.splice(from, 1);
        origin.splice(to, 0, item[0]);
      }
    },
    updateTask(uuid, tasks) {
      const { deviceTasks } = this;
      deviceTasks[uuid] = tasks;
    },
    newTask(uuid) {
      const { deviceTasks } = this;
      deviceTasks[uuid] = defaultTask;
    },
    getTask(uuid,taskId){
      const { deviceTasks } = this;
      const origin = deviceTasks[uuid];
      const task = origin?.find((task) => task.id === taskId);
      return task?task:{};
    },
    getTaskProcess(uuid,taskId){
      const { deviceTasks } = this;
      const origin = deviceTasks[uuid];
      const task = origin?.find((task) => task.id === taskId);
      return task?task.progress:0;
    },
  },
});

export default useTaskStore;
