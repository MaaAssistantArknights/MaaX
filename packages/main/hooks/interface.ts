import ffi from "ffi-napi";
import ref from "ref-napi";
import ArrayType from "ref-array-napi";
import path from "path";
import { assert } from "@vue/compiler-core";
import WindowFactory from "../window/factory";
import logger from "../utils/logger";

/** Some types for core */
const BoolType = ref.types.bool;
const IntType = ref.types.int;
const IntArrayType = ArrayType(IntType);
const DoubleType = ref.types.double;
const ULLType = ref.types.ulonglong;
const voidType = ref.types.void;
const StringType = ref.types.CString;
const StringPtrType = ref.refType(StringType);
const StringPtrArrayType = ArrayType(StringType);
const AsstType = ref.types.void;
const AsstPtrType = ref.refType(AsstType);
const TaskPtrType = ref.refType(AsstType);
const CustomArgsType = ref.refType(ref.types.void);
const CallBackType = ffi.Function(ref.types.void, [
  IntType,
  StringType,
  ref.refType(ref.types.void),
]);
const Buff = CustomArgsType;
type AsstInstancePtr = ref.Pointer<void>;
type TaskInstancePtr = ref.Pointer<void>;

interface CallBackFunc {
  (msg: number, detail: string, custom?: any): any;
}

enum AsstMsg {
  /* Global Info */
  InternalError = 0, // 内部错误
  InitFailed, // 初始化失败
  ConnectionInfo, // 连接相关信息
  AllTasksCompleted, // 全部任务完成
  /* TaskChain Info */
  TaskChainError = 10000, // 任务链执行/识别错误
  TaskChainStart, // 任务链开始
  TaskChainCompleted, // 任务链完成
  TaskChainExtraInfo, // 任务链额外信息
  /* SubTask Info */
  SubTaskError = 20000, // 原子任务执行/识别错误
  SubTaskStart, // 原子任务开始
  SubTaskCompleted, // 原子任务完成
  SubTaskExtraInfo, // 原子任务额外信息
}

const dependences: Record<string, Array<string>> = {
  win32: [
    "libiomp5md",
    "mklml",
    "mkldnn",
    "opencv_world453",
    "paddle_inference",
    "ppocr",
    "penguin-stats-recognize",
  ],
  linux: [],
  darwin: ["libpaddle_inference"],
};

const cb = ffi.Callback(
  "void",
  ["int", "string", ref.refType(ref.types.void)],
  (msg, _detail, custom_args) => {
    console.log(msg);
    const detail = JSON.parse(_detail as string);
    const more = detail.details;
    const wc = WindowFactory.getInstance().webContents;

    console.log(detail);
    switch (msg as unknown as number) {
      case AsstMsg.InternalError: {
        break;
      }
      case AsstMsg.InitFailed: {
        break;
      }
      case AsstMsg.ConnectionInfo: {
        switch (detail.what) {
          case "UuidGetted": {
            wc.send("device:connectInfo", {
              what: detail.what,
              address: more.address,
              uuid: more.uuid,
            });
            break;
          }
          case "ConnectFailed": {
            wc.send("device:connectInfo", {
              what: detail.what,
              address: more.address,
            });
            break;
          }
        }
        break;
      }
      case AsstMsg.AllTasksCompleted: {
        break;
      }
      case AsstMsg.TaskChainError: {
        break;
      }
      case AsstMsg.TaskChainStart: {
        break;
      }
      case AsstMsg.TaskChainCompleted: {
        break;
      }
      case AsstMsg.TaskChainExtraInfo: {
        break;
      }
      case AsstMsg.SubTaskError: {
        break;
      }
      case AsstMsg.SubTaskStart: {
        break;
      }
      case AsstMsg.SubTaskCompleted: {
        break;
      }
      case AsstMsg.SubTaskExtraInfo: {
        break;
      }
    }
  }
);

/**
 * make an array to ffi
 * @param array
 * @returns
 */
function makeArray(array: any[]) {
  return typeof array[0] === "number"
    ? IntArrayType(array)
    : array.map((v) => {
        return Buffer.from(v);
      });
}

class Assistant {
  // TODO 可能要针对core版本来适配API
  private static singleton?: Assistant;
  public static libPath: string;
  MeoAsstLib;
  //MeoAsstPtr!: ref.Pointer<void>;
  MeoAsstPtr: Record<string, AsstInstancePtr> = {};
  __CALLBACK!: any;

  private constructor() {
    assert(Boolean(Assistant.libPath), "path undefined");
    dependences[process.platform].forEach((lib) => {
      ffi.Library(path.join(Assistant.libPath, lib));
    });
    console.log(Assistant.libPath);

    this.MeoAsstLib = ffi.Library(
      path.join(Assistant.libPath, "MeoAssistant"),
      {
        AsstLoadResource: [BoolType, [StringType]],

        AsstCreate: [AsstPtrType, []],
        AsstCreateEx: [AsstPtrType, ["pointer", CustomArgsType]],
        AsstDestroy: [voidType, [AsstPtrType]],

        /** deprecated after v3.0.6
          AsstCatchDefault: [BoolType, [AsstPtrType]],
          AsstCatchEmulator: [BoolType, [AsstPtrType]],
          AsstCatchCustom: [BoolType, [AsstPtrType, StringType]],
          AsstCatchFake: [BoolType, [AsstPtrType]],
          */
        AsstConnect: [
          BoolType,
          [AsstPtrType, StringType, StringType, StringType],
        ], // dev

        /**deprecated
        AsstAppendStartUp: [BoolType, [AsstPtrType]],
        AsstAppendFight: [
          BoolType,
          [AsstPtrType, StringType, IntType, IntType, IntType],
        ],
        AsstAppendAward: [BoolType, [AsstPtrType]],
        AsstAppendVisit: [BoolType, [AsstPtrType]],
        AsstAppendMall: [BoolType, [AsstPtrType, BoolType]],
        AsstAppendInfrast: [
          BoolType,
          [
            AsstPtrType,
            IntType,
            StringPtrArrayType,
            IntType,
            StringType,
            DoubleType,
          ],
        ],
        AsstAppendRecruit: [
          BoolType,
          [
            AsstPtrType,
            IntType,
            IntArrayType,
            IntType,
            IntArrayType,
            IntType,
            BoolType,
          ],
        ],
        AsstAppendRoguelike: [BoolType, [AsstPtrType]],

        AsstAppendDebug: [BoolType, [AsstPtrType]],
         
        AsstStartRecruitCalc: [
          BoolType,
          [AsstPtrType, IntArrayType, IntType, BoolType],
        ],

         */

        AsstAppendTask: [TaskPtrType, [AsstPtrType, StringType, StringType]],
        // AsstSetTaskParams: [BoolType, [AsstPtrType, TaskPtrType, StringType]],
        // AsstSetParam: [BoolType, [AsstPtrType, TaskPtrType, StringType]],

        AsstStart: [BoolType, [AsstPtrType]],
        AsstStop: [BoolType, [AsstPtrType]],

        //AsstSetPenguinId: [BoolType, [AsstPtrType, IntType]],

        AsstGetImage: [ULLType, [AsstPtrType, Buff, ULLType]],
        AsstCtrlerClick: [BoolType, [AsstPtrType, IntType, IntType, BoolType]],
        AsstGetVersion: [StringType, []],

        AsstLog: [voidType, [AsstPtrType, StringType, StringType]],
      }
    );
  }

  public static getInstance(): Assistant | undefined {
    if (Assistant.libPath) Assistant.libPath = path.resolve(Assistant.libPath);
    //TODO: Check is dll available
    if (!this.singleton) {
      try {
        this.singleton = new Assistant();
        this.singleton.LoadResource(Assistant.libPath);
      } catch (error) {
        logger.error("error while loading core");
      }
    }
    return this.singleton;
  }

  public static dispose(): void {
    if (this.singleton) {
      for (const [uuid] of Object.entries(this.singleton.MeoAsstPtr)) {
        this.singleton.Stop(uuid);
        this.singleton.Destroy(uuid);
      }
      delete this.singleton;
    }
  }

  /**
   * 指定资源路径
   * @param path? 未指定就用libPath
   * @returns
   */
  LoadResource(path?: string) {
    return this.MeoAsstLib.AsstLoadResource(path ? path : Assistant.libPath);
  }

  /**
   * 创建普通实例, 即无回调版
   * @returns 实例指针{ref.Pointer}
   */
  Create() {
    // const asstCreate = ffi.ForeignFunction(
    //   this.MeoAsst.get('AsstCreate'),
    //   AsstPtr,
    //   ['string'],
    //   ffi.FFI_STDCALL
    // );
    // this.MeoAsstPtr = asstCreate(dirname);
    this.MeoAsstPtr["placeholder"] = this.MeoAsstLib.AsstCreate();
    return this.MeoAsstPtr["placeholder"] ? true : false;
    //return this.MeoAsstPtr;
  }

  /**
   * 创建实例
   * @param dirname 本体路径{string}
   * @param callback 回调函数, 必须要有msg,detail参数, 可选custom_arg
   * @param custom_arg 自定义参数{???}
   * @returns  实例指针{ref.Pointer}
   */
  CreateEx(
    /**
     * 逻辑: 接受一个连接地址, 先把指针存在这个地址上, 等后续回调再把地址名称改成uuid
     */
    //callback: CallBackFunc,
    address: string,
    callback: any = cb,
    custom_arg: any = voidPointer()
  ): boolean {
    /**
    this.__CALLBACK = ffi.Callback(
      "void",
      ["int", "string", ref.refType(ref.types.void)],
      (msg, detail, custom_args) => {
        callback(
          msg as unknown as number,
          detail as unknown as string,
          custom_args
        );
      }
    );

    this.MeoAsstPtr["placeholder"] = this.MeoAsstLib.AsstCreateEx(
      this.__CALLBACK,
      custom_arg
    );
     */

    this.MeoAsstPtr[address] = this.MeoAsstLib.AsstCreateEx(cb, custom_arg);

    return this.MeoAsstPtr[address] ? true : false;
    //return this.MeoAsstPtr;
  }

  Destroy(uuid: string) {
    this.MeoAsstLib.AsstDestroy(this.GetUUID(uuid));
  }

  /**
  CatchDefault(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstCatchDefault(p_asst);
  }

  CatchEmulator(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstCatchEmulator(p_asst);
  }

  CatchCustom(
    address: string,
    p_asst: ref.Pointer<void> = this.MeoAsstPtr
  ): boolean {
    return this.MeoAsst.AsstCatchCustom(p_asst, address);
  }

  CatchFake(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstCatchDefault(p_asst);
  }
  */

  /**
   * 连接
   * @param address 连接地址
   * @param config 模拟器名称, 自定义设备为'default'
   * @param adb_path adb路径
   * @returns 是否连接成功
   */
  Connect(
    /**
     * 这块逻辑: 连接时是不知道 uuid 的, 所以先用 address 代替 uuid.
     */
    address: string,
    adb_path: string,
    config: string
  ): boolean {
    return this.MeoAsstLib.AsstConnect(
      this.GetUUID(address),
      adb_path,
      address,
      config
    );
  }

  AppendTask(uuid: string, type: string, params: string): TaskInstancePtr {
    return this.MeoAsstLib.AsstAppendTask(this.GetUUID(uuid), type, params);
  }

  SetTaskParams(
    handle: ref.Pointer<void>,
    task: ref.Pointer<void>,
    params: string
  ) {}

  /**
   * 添加开始唤醒任务
   * @param p_asst 实例指针
   * @returns
   */

  /*   AppendStartUp(uuid: string): boolean {
    return this.MeoAsstLib.AsstStart(this.GetUUID(uuid));
  } */

  /**
   * 添加作战任务
   * @param p_asst 实例指针
   * @param stage 关卡, 当前关卡:"" , 上次作战:"lastBattle" , 剿灭作战:"Annihilation" , 龙门币-5:"CE-5", 红票-5:"AP-5", 经验-5:"LS-5", 技能-5:"CA-5",
   * @param max_mecidine 最多使用理智药数量
   * @param max_stone 最多使用源石数量
   * @param max_times 最多刷几次关卡
   * @returns
   */
  /*   AppendFight(
    stage: string,
    max_mecidine: number,
    max_stone: number,
    max_times: number,
    uuid: string
  ): boolean {
    return this.MeoAsstLib.AsstAppendFight(
      this.GetUUID(uuid),
      stage,
      max_mecidine,
      max_stone,
      max_times
    );
  } */

  /**
   * 添加领取奖励任务
   * @param p_asst 实例指针
   * @returns
   */
  /*   AppendAward(uuid: string): boolean {
    return this.MeoAsstLib.AsstAppendAward(this.GetUUID(uuid));
  } */

  /**
   * 添加访问好友基建任务
   * @param p_asst 实例指针
   * @returns
   */
  /*   AppendVisit(uuid: string): boolean {
    return this.MeoAsstLib.AsstAppendVisit(this.GetUUID(uuid));
  } */

  /**
   * 添加信用购物任务
   * @param with_shopping 是否购物{boolean}
   * @returns
   */
  /*   AppendMall(uuid: string, with_shopping: boolean) {
    return this.MeoAsstLib.AsstAppendMall(this.GetUUID(uuid), with_shopping);
  } */

  /**
   * 添加基建事件
   * @param p_asst 实例指针
   * @param work_mode 目前仅支持1
   * @param order 换班{string[]} 数组中可选项  "Mfg", "Trade", "Control", "Power", "Reception", "Office", "Dorm"
   * @param order_size 换班list的长度
   * @param uses_of_drones 无人机用处, 可选项 "_NotUse"、"Money"、"SyntheticJade"、"CombatRecord"、"PureGold"、"OriginStone"、"Chip"
   * @param dorm_threshold 换班心情阈值,范围[0,1.0]
   * @returns
   */
  /*   AppendInfrast(
    work_mode: number,
    order: string[],
    order_size: number,
    uses_of_drones: string,
    dorm_threshold: number,
    uuid: string
  ): boolean {
    return this.MeoAsstLib.AsstAppendInfrast(
      this.GetUUID(uuid),
      work_mode,
      makeArray(order),
      order_size,
      uses_of_drones,
      dorm_threshold
    );
  } */

  /**
   * 添加公招任务
   * @param p_asst 实例指针
   * @param max_times 自动公招次数{number}
   * @param select_level 要选择的tag等级{number[]}
   * @param select_len select_level的长度{number}
   * @param confirm_level 要点击'开始招募'的tag等级
   * @param confirm_len confirm_level的长度{number}
   * @param need_refresh 是否刷新3级tag{boolean}
   * @returns
   */
  /*   AppendRecruit(
    max_times: number,
    select_level: number[],
    select_len: number,
    confirm_level: number[],
    confirm_len: number,
    need_refresh: boolean,
    uuid: string
  ): boolean {
    return this.MeoAsstLib.AsstAppendRecruit(
      this.GetUUID(uuid),
      max_times,
      makeArray(select_level),
      select_len,
      makeArray(confirm_level),
      confirm_len,
      need_refresh
    );
  } */

  /**
   *
   * @param p_asst
   * @returns
   */
  /*   AppendDebug(uuid: string): boolean {
    return this.MeoAsstLib.AsstAppendDebug(this.GetUUID(uuid));
  } */

  /**
   * 进行公招计算
   * @param p_asst 实例指针
   * @param select_level 选择的Tags等级{number[]}
   * @param required_len select_level的长度{number}
   * @param set_time 是否点击九小时{boolean}
   * @returns
   */
  /*   StartRecruitCalc(
    select_level: number[],
    required_len: number,
    set_time: boolean,
    uuid: string
  ): boolean {
    return this.MeoAsstLib.AsstStartRecruitCalc(
      this.GetUUID(uuid),
      makeArray(select_level),
      required_len,
      set_time
    );
  } */

  /**
   * 开始任务
   * @param p_asst
   * @returns
   */
  Start(uuid: string): boolean {
    return this.MeoAsstLib.AsstStart(this.GetUUID(uuid));
  }

  /**
   * 停止并清空所有任务
   * @param p_asst
   * @returns
   */
  Stop(uuid: string): boolean {
    return this.MeoAsstLib.AsstStop(this.GetUUID(uuid));
  }

  /**
   * 设置企鹅物流id
   * @param p_asst 实例指针
   * @param id 企鹅物流id
   * @returns
   */
  /**
  SetPenguinId(uuid: string, id: number): boolean {
    return this.MeoAsstLib.AsstSetPenguinId(this.GetUUID(uuid), id);
  }
 */
  /**
   * 发送点击
   * @param p_asst 实例指针
   * @param x x坐标
   * @param y y坐标
   * @param block 是否阻塞，true会阻塞直到点击完成才返回，false异步返回
   * @returns
   */
  CtrlerClick(uuid: string, x: number, y: number, block: boolean): boolean {
    return this.MeoAsstLib.AsstCtrlerClick(this.GetUUID(uuid), x, y, block);
  }

  /**
   * 主程序版本
   * @returns 版本{string}
   *
   */
  GetVersion() {
    return this.MeoAsstLib.AsstGetVersion();
  }

  SetUUID(address: string, uuid: string) {
    this.MeoAsstPtr[uuid] = this.MeoAsstPtr[address];
    delete this.MeoAsstPtr[address];
  }

  GetUUID(uuid: string) {
    return this.MeoAsstPtr[uuid];
  }
}

/**
 * 返回空指针
 * @returns
 */
function voidPointer() {
  return ref.alloc(ref.types.void);
}

export { Assistant, CallBackFunc, cb, voidPointer };
