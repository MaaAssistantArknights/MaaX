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
      levels: [
        {
          stage: {
            stage_metadata: {
              stage_id: "main_00-01",
              stage_type: "MAIN",
              stage_code: "0-1",
              stage_ap_cost: 6,
            },
            zone_metadata: {
              zone_id: "main_0",
              zone_name: "序章",
              zone_type: "MAINLINE",
            },
            stage_i18n: {
              zh: "0-1",
              ko: "0-1",
              ja: "0-1",
              en: "0-1",
            },
            zone_i18n: {
              zh: "序章",
              ko: "프롤로그",
              ja: "序章",
              en: "Prologue",
            },
            existence: {
              cn: {
                exist: true,
                open: null,
                close: null,
              },
              jp: {
                exist: true,
                open: null,
                close: null,
              },
              kr: {
                exist: true,
                open: null,
                close: null,
              },
              us: {
                exist: true,
                open: null,
                close: null,
              },
            },
          },
          times: 3,
        },
      ],
      special: {
        type: "current",
        times: 3,
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
      deviceTasks: {
        "12345678-90abcdefg": taskDemo,
        connected: taskDemo,
        tasking: taskDemo,
      },
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
  },
});

export default useTaskStore;
