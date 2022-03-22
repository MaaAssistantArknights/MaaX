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

function taskStartUp(task: Task["configurations"]) {
  // 无配置选项
  return {};
}

function taskFight(task: Task["configurations"]) {
  return {
    stage: "", // TODO: UI上关卡支持
    mecidine: 0, // TODO: 使用理智药数量
    stones: 0, // TODO: 吃石头数量
    //times: (task.special as any).times,
    times : 1,
    report_to_penguin: true, // TODO: 是否上传到企鹅物流, 可选, 默认false
    penguin_id: "", // TODO: 接受回调的物流id
    server: "CN" // TODO: 企鹅物流上传区服
  };
}

function taskRecruit(task: Task["configurations"]) {
  const select :number[] = [];
  const confirm: number[] = [];
  for (const [key, value] of Object.entries(task.recognitions as Object)) {
    if (value) confirm.push(parseInt(key));
    if (value && parseInt(key)!=3) select.push(parseInt(key)); // 不选择3星词条.
  }

  const ret = {
    refresh: task.refresh_normal_tags,
    select: select,
    confirm: confirm,
    times: task.maximum_times_of_recruitments,
    expedite: task.use_expedited_plan,
    expedite_times: task.maximum_times_of_recruitments, // TODO: 加急次数, UI没有这个选项
  };
  console.log(ret);
  return ret;
}

function taskInfrast(task: Task["configurations"]) {
  const droneTranslate: Record<string, string> = {
    None: "_NotUse",
    LMD: "Money",
    "Originium Shard": "SyntheticJade",
    "Battle Record": "CombatRecord",
    "Pure Gold": "PureGold",
    Orumdum: "OriginStone",
    Chip: "Chip",
  };
  
  const facilityTranslate:Record<string,string> = {
    ManufacturingStation:"Mfg",
    TradingStation:"Trade",
    ControlCenter:"Control",
    PowerStation:"Power",
    MeetingRoom:"Reception",
    Office:"Office",
    Dormitory:"Dorm",
  };

  const facilities:string[] = [];
  (task.facilities as Array<object>).forEach((room:any)=>{
    if(room.enabled)
    facilities.push(facilityTranslate[room.name]);
  });
  const ret =  {
    // "mode": 0, // 换班模式
    facility: facilities, // 换班顺序
    drones: droneTranslate[task.drone_usage as string], // 无人机用途 
    threshold: ((task.mood_limit as number) / 23).toFixed(1), // 换班心情阈值
    replenish: true // TODO: 源石碎片自动补货
  };
  console.log(ret);
  return ret;
}

function taskVisit(task: Task["configurations"]) {
  // 没有配置项
  return {};
}

function taskMall(task: Task["configurations"]) {
  // 领取信用以及商店购物

  return {
    "shopping":true,   // TODO: 可以只收取信用而不购物, UI中无选项, 虽然感觉这个功能没啥用
    "shopping_list": [...(task.exclude as Set<string>).keys()],
    "is_black_list": true,
  };
}

function taskAward(task: Task["configurations"]) {
  // 没有配置项
  return {};
}
function taskRogue(task: Task["configurations"]) {
  enum rogueTranslate{
    ToTheEnd = 0,
    AfterFirstLevel,
    AfterMoney
  }
  return {
    mode: rogueTranslate[task.strategy as number], // 肉鸽战斗模式, 0-尽可能往后打 1-第一层投资完源石就退出 2-投资后退出
    opers:[] // TODO: 参考 https://github.com/MaaAssistantArknights/MaaAssistantArknights/blob/dev/docs/%E9%9B%86%E6%88%90%E6%96%87%E6%A1%A3.md?plain=1#L128-L137
  };
}

export const handleSingleTask: Record<
  string,
  (task: Task["configurations"]) => object
> = {
  startup: taskStartUp,
  fight: taskFight,
  recruit: taskRecruit,
  infrast: taskInfrast,
  visit: taskVisit,
  mall: taskMall,
  award: taskAward,
  rogue: taskRogue,
};

export default useTaskStore;
