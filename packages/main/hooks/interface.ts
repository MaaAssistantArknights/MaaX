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
        AsstConnect: [
          BoolType,
          [AsstPtrType, StringType, StringType, StringType],
        ],

        AsstAppendTask: [IntType, [AsstPtrType, StringType, StringType]],
        AsstSetTaskParams: [BoolType, [AsstPtrType, IntType, StringType]],

        AsstStart: [BoolType, [AsstPtrType]],
        AsstStop: [BoolType, [AsstPtrType]],

        AsstGetImage: [ULLType, [AsstPtrType, Buff, ULLType]],
        AsstCtrlerClick: [BoolType, [AsstPtrType, IntType, IntType, BoolType]],
        AsstGetVersion: [StringType, []],

        AsstLog: [voidType, [StringType, StringType]],
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
    this.MeoAsstPtr["placeholder"] = this.MeoAsstLib.AsstCreate();
    return this.MeoAsstPtr["placeholder"] ? true : false;
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
    address: string,
    callback: any = cb,
    custom_arg: any = voidPointer()
  ): boolean {
    this.MeoAsstPtr[address] = this.MeoAsstLib.AsstCreateEx(cb, custom_arg);

    return this.MeoAsstPtr[address] ? true : false;
  }

  Destroy(uuid: string) {
    this.MeoAsstLib.AsstDestroy(this.GetUUID(uuid));
  }

  /**
   * 连接
   * @param address 连接地址
   * @param config 模拟器名称, 自定义设备为'General'
   * @param adb_path adb路径
   * @returns 是否连接成功
   */
  Connect(
    /**
     * 连接时是不知道 uuid 的, 所以先用 address 代替 uuid.
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

  /**
   * 添加任务
   * @param uuid 设备唯一标识符
   * @param type 任务类型, 详见文档
   * @param params 任务json字符串, 详见文档
   * @returns
   */
  AppendTask(uuid: string, type: string, params: string): number {
    return this.MeoAsstLib.AsstAppendTask(this.GetUUID(uuid), type, params);
  }

  /**
   * 设置任务参数
   * @param uuid 设备唯一标识符
   * @param task_id 任务唯一id
   * @param params 任务参数
   */
  SetTaskParams(uuid: string, task_id: number, params: string) {
    return this.MeoAsstLib.AsstSetTaskParams(this.GetUUID(uuid),task_id,params);
  }

  /**
   * 开始任务
   * @param uuid 设备唯一标识符
   * @returns 是否成功
   */
  Start(uuid: string): boolean {
    return this.MeoAsstLib.AsstStart(this.GetUUID(uuid));
  }

  /**
   * 停止并清空所有任务
   * @param uuid 设备唯一标识符
   * @returns
   */
  Stop(uuid: string): boolean {
    return this.MeoAsstLib.AsstStop(this.GetUUID(uuid));
  }

  /**
   * 发送点击
   * @param uuid 设备唯一标识符
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

  /**
   * 绑定地址到uuid
   * @param address 设备连接地址
   * @param uuid 要绑定的uuid
   */
  SetUUID(address: string, uuid: string) {
    this.MeoAsstPtr[uuid] = this.MeoAsstPtr[address];
    delete this.MeoAsstPtr[address];
  }

  GetUUID(uuid: string) {
    return this.MeoAsstPtr[uuid];
  }

  Log(level:string,message:string){
    return this.MeoAsstLib.AsstLog(level,message);
  }
}

function voidPointer(){
  return ref.alloc(ref.types.void);
}

export { Assistant };
