import { defineStore } from "pinia";

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
      "可用理智液": true
    },
  },
  {
    id: "recruit",
    title: "自动公招",
    status: "idle",
    enable: true,
    configurations: {},
  },
  {
    id: "infrast",
    title: "基建换班",
    status: "idle",
    enable: true,
    configurations: {},
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
];

const useTaskStore = defineStore<"tasks", TaskState, {}, TaskAction>("tasks", {
  state: () => {
    return {
      deviceTasks: {
        "12345678-90abcdefg": taskDemo,
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
  },
});

export default useTaskStore;
