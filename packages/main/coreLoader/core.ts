// import ffi, { DynamicLibrary } from 'ffi-napi'
// import ref from 'ref-napi'
// import path from 'path'
// import { existsSync, mkdirSync } from 'fs'
// import WindowManager from '@main/windowManager'
// import logger from '@main/utils/logger'
// import _ from 'lodash'
// import { app } from 'electron'
// import Storage from '@main/storageManager'

// const storage = new Storage()

// /** Some types for core */
// const BoolType = ref.types.bool
// const IntType = ref.types.int
// // const IntArrayType = ArrayType(IntType)
// // const DoubleType = ref.types.double
// const ULLType = ref.types.ulonglong
// const voidType = ref.types.void
// const StringType = ref.types.CString
// // const StringPtrType = ref.refType(StringType)
// // const StringPtrArrayType = ArrayType(StringType)
// const AsstType = ref.types.void
// const AsstPtrType = ref.refType(AsstType)
// // const TaskPtrType = ref.refType(AsstType)
// const CustomArgsType = ref.refType(ref.types.void)
// /**
// const CallBackType = ffi.Function(ref.types.void, [
//   IntType,
//   StringType,
//   ref.refType(ref.types.void)
// ])
//  */
// const Buff = CustomArgsType
// type AsstInstancePtr = ref.Pointer<void>
// // type TaskInstancePtr = ref.Pointer<void>

// // type CallBackFunc = (msg: number, detail: string, custom?: any) => any

// enum AsstMsg {
//   /* Global Info */
//   InternalError = 0, // 内部错误
//   InitFailed, // 初始化失败
//   ConnectionInfo, // 连接相关信息
//   AllTasksCompleted, // 全部任务完成
//   /* TaskChain Info */
//   TaskChainError = 10000, // 任务链执行/识别错误
//   TaskChainStart, // 任务链开始
//   TaskChainCompleted, // 任务链完成
//   TaskChainExtraInfo, // 任务链额外信息
//   /* SubTask Info */
//   SubTaskError = 20000, // 原子任务执行/识别错误
//   SubTaskStart, // 原子任务开始
//   SubTaskCompleted, // 原子任务完成
//   SubTaskExtraInfo, // 原子任务额外信息
// }

// /** 暂时不对subStaskStart做处理 */
// // const subTaskStart: Record<string, (detail: callbackDetailType) => object> = {
// //   StartUp: (detail: callbackDetailType) => { return { task: detail.details.task } }
// // }

// type taskchainProps = {
//   [key in AsstMsg]: (msg: number, detail: callbackDetail) => object;
// }

// const handleCallback: taskchainProps = {
//   [AsstMsg.InternalError]: (msg, detail): object => {
//     return { name: msg }
//   },
//   [AsstMsg.InitFailed]: (msg, detail): object => {
//     return { name: msg, uuid: detail.uuid }
//   },
//   [AsstMsg.ConnectionInfo]: (msg, detail): object => {
//     return {
//       // name: msg,
//       name: detail.what, // 连接类型
//       address: detail.details.address,
//       ...{ UuidGot: { uuid: detail.details.uuid }, ConnectFailed: {} }[
//         detail.what
//       ]
//     }
//   },
//   [AsstMsg.AllTasksCompleted]: (msg, detail): object => {
//     return { name: msg, uuid: detail.uuid }
//   },
//   [AsstMsg.TaskChainError]: (msg, detail): object => {
//     return {
//       name: msg,
//       task: taskChainTranslate[detail.taskchain],
//       uuid: detail.uuid
//     }
//   },
//   [AsstMsg.TaskChainStart]: (msg, detail): object => {
//     return {
//       name: msg,
//       task: taskChainTranslate[detail.taskchain],
//       uuid: detail.uuid
//     }
//   },
//   [AsstMsg.TaskChainCompleted]: (msg, detail): object => {
//     return {
//       name: msg,
//       task: taskChainTranslate[detail.taskchain],
//       uuid: detail.uuid
//     }
//   },
//   [AsstMsg.TaskChainExtraInfo]: (msg, detail): object => {
//     return { name: msg }
//   },
//   [AsstMsg.SubTaskError]: (msg, detail): object => {
//     return { name: `${detail.taskchain}:${detail.details.task}` }
//   },
//   [AsstMsg.SubTaskStart]: (msg, detail): object => {
//     console.log(`CALL: ${detail.taskchain}:Start:${detail.details.task}`)
//     return {
//       name: `${detail.taskchain}:Start:${detail.details.task}`,
//       execTimes: detail.details.exec_times,
//       task: taskChainTranslate[detail.taskchain],
//       uuid: detail.uuid
//     }
//   },
//   [AsstMsg.SubTaskCompleted]: (msg, detail): object => {
//     console.log(`CALL: ${detail.taskchain}:Completed:${detail.details.task}`)
//     return { name: `${detail.taskchain}:Completed:${detail.details.task}`, ...detail }
//   },
//   [AsstMsg.SubTaskExtraInfo]: (msg, detail): object => {
//     console.log(`CALL: ${detail.taskchain}:Extra:${detail.what}`)
//     return { name: `${detail.taskchain}:Extra:${detail.what}`, ...detail }
//   }
// }

// const dependences: Record<string, string[]> = {
//   win32: [
//     'libiomp5md',
//     'mklml',
//     'mkldnn',
//     'opencv_world453',
//     'paddle_inference',
//     'ppocr'
//     // 'penguin-stats-recognize'
//   ],
//   linux: [],
//   darwin: ['libpaddle_inference.dylib']
// }

// const libName: Record<string, string> = {
//   win32: 'MeoAssistant',
//   darwin: 'MeoAssistant.dylib',
//   linux: 'libMeoAssistant.so'
// }

// /**
// type handleCallback  = Record<string, (detail:any)=>object>;
// // 下面注释起来的key应该是用不上的回调信息.

// const handleConnectionInfo: handleCallback = {
//   UuidGot: (detail) => {
//     return { what: detail.what, address: detail.details.address, uuid: detail.details.uuid };
//   },
//   ConnectFailed: (detail) => {
//     return { what: detail.what, address: detail.details.address };
//   }
// };

// const handleTaskChianStart: handleCallback = {
//     StartUp:(detail) =>{return {uuid:detail.uuid};} // 开始唤醒任务链_开始
// };

// const handleSubTaskStart: handleCallback = {
//   //StartUp: (detail,more) => {return {uuid:detail.uuid};}, //  开始唤醒任务链子任务_预处理
//   StartToWakeUp:(detail) => {return {uuid:detail.uuid};},  //   开始唤醒任务子任务_开始
//   AwardBegin:(detail)=>{return {uuid:detail.uuid};}, // 领取每日_开始

// };

// const handleSubTaskCompleted: handleCallback = {
//   // StartUp
//   StartToWakeUp: (detail) =>{ return {uuid:detail.uuid};}, // 开始唤醒任务子任务_结束
// };

//  */

// const taskChainTranslate: Record<string, string> = {
//   StartUp: 'startup',
//   Fight: 'fight',
//   Recruit: 'recruit',
//   Infrast: 'infrast',
//   Visit: 'visit',
//   Mall: 'mall',
//   Award: 'award',
//   Roguelike: 'rogue'
// }

// //  "idle" | "processing" | "success" | "exception"
// /**
//  *       event,
//       uuid: string,
//       taskId: string,
//       status: TaskStatus,
//       progress: number

//  */

// const cb = ffi.Callback(
//   'void',
//   ['int', 'string', ref.refType(ref.types.void)],
//   (_msg, _detail, _customArgs) => {
//     console.log(_msg)
//     const msg: number = _msg as unknown as number
//     const detail = JSON.parse(_detail as string)
//     console.log(detail)
//     const callback = handleCallback[msg as AsstMsg](msg, detail)

//     new WindowManager().getWindow().webContents.send(
//       (callback as any).name.toString(),
//       callback
//     )
//   }
// )

// /**
//  * make an array to ffi
//  * @param array
//  * @returns
//  */
// // function makeArray (array: any[]) {
// //   return typeof array[0] === 'number'
// //     ? IntArrayType(array)
// //     : array.map((v) => {
// //       return Buffer.from(v)
// //     })
// // }

// class Assistant {
//   private static singleton?: Assistant;
//   // public static libPath: string;
//   public MeoAsstLib;
//   // MeoAsstPtr!: ref.Pointer<void>;
//   private readonly DLib;
//   private readonly DepLibs: DynamicLibrary[] = [];
//   MeoAsstPtr: Record<string, AsstInstancePtr> = {};
//   __CALLBACK!: any;

//   private static readonly libPathKey = 'libPath';

//   private static readonly defaultLibPath = path.join(app.getPath('appData'), app.getName(), 'core');

//   public static get libPath (): string {
//     let libPath = storage.get(Assistant.libPathKey) as string
//     if (!_.isString(libPath) || !existsSync(libPath)) {
//       logger.error(`原资源路径： ${libPath}, 更新后：${this.defaultLibPath}`)
//       libPath = this.defaultLibPath
//       if (!existsSync(libPath)) mkdirSync(libPath)
//     }
//     if (path.isAbsolute(libPath)) {
//       libPath = path.resolve(libPath)
//       storage.set(Assistant.libPathKey, libPath)
//     }
//     return libPath
//   }

//   private constructor () {
//     dependences[process.platform].forEach((lib) => {
//       // ffi.Library(path.join(Assistant.libPath, lib));
//       this.DepLibs.push(ffi.DynamicLibrary(path.join(Assistant.libPath, lib)))
//     })
//     this.DLib = ffi.DynamicLibrary(path.join(Assistant.libPath, libName[process.platform]), ffi.RTLD_NOW)
//     this.MeoAsstLib =
//     {
//       AsstLoadResource: ffi.ForeignFunction(this.DLib.get('AsstLoadResource'), BoolType,
//         [StringType], ffi.FFI_STDCALL),
//       AsstCreate: ffi.ForeignFunction(this.DLib.get('AsstCreate'), AsstPtrType, [], ffi.FFI_STDCALL),
//       AsstCreateEx: ffi.ForeignFunction(this.DLib.get('AsstCreateEx'), AsstPtrType,
//         ['pointer', CustomArgsType], ffi.FFI_STDCALL),
//       AsstDestroy: ffi.ForeignFunction(this.DLib.get('AsstDestroy'), voidType, [AsstPtrType], ffi.FFI_STDCALL),
//       AsstConnect: ffi.ForeignFunction(this.DLib.get('AsstConnect'),
//         BoolType,
//         [AsstPtrType, StringType, StringType, StringType],
//         ffi.FFI_STDCALL),

//       AsstAppendTask: ffi.ForeignFunction(this.DLib.get('AsstAppendTask'), IntType,
//         [AsstPtrType, StringType, StringType], ffi.FFI_STDCALL),
//       AsstSetTaskParams: ffi.ForeignFunction(this.DLib.get('AsstSetTaskParams'), BoolType,
//         [AsstPtrType, IntType, StringType], ffi.FFI_STDCALL),

//       AsstStart: ffi.ForeignFunction(this.DLib.get('AsstStart'), BoolType,
//         [AsstPtrType], ffi.FFI_STDCALL),
//       AsstStop: ffi.ForeignFunction(this.DLib.get('AsstStop'), BoolType,
//         [AsstPtrType], ffi.FFI_STDCALL),

//       AsstGetImage: ffi.ForeignFunction(this.DLib.get('AsstGetImage'), ULLType,
//         [AsstPtrType, Buff, ULLType], ffi.FFI_STDCALL),
//       AsstCtrlerClick: ffi.ForeignFunction(this.DLib.get('AsstCtrlerClick'), BoolType,
//         [AsstPtrType, IntType, IntType, BoolType], ffi.FFI_STDCALL),
//       AsstGetVersion: ffi.ForeignFunction(this.DLib.get('AsstGetVersion'), StringType,
//         [], ffi.FFI_STDCALL),
//       AsstLog: ffi.ForeignFunction(this.DLib.get('AsstLog'), voidType,
//         [StringType, StringType], ffi.FFI_STDCALL)
//     }
//   }

//   public static getInstance (): Assistant | undefined {
//     const libPath = Assistant.libPath
//     if (this.singleton == null) {
//       try {
//         this.singleton = new Assistant()
//         this.singleton.LoadResource(libPath)
//       } catch (error) {
//         logger.error('error while loading core')
//         logger.error(error)
//       }
//     }
//     return this.singleton
//   }

//   public static dispose (): void {
//     if (this.singleton != null) {
//       for (const uuid of Object.keys(this.singleton.MeoAsstPtr)) {
//         this.singleton.Stop(uuid)
//         this.singleton.Destroy(uuid)
//       }
//       for (const dep of this.singleton.DepLibs) {
//         console.log(dep.path())
//         dep.close()
//       }
//       this.singleton.DLib.close()
//       delete this.singleton
//     }
//   }

//   /**
//    * 指定资源路径
//    * @param path? 未指定就用libPath
//    * @returns
//    */
//   LoadResource (path?: string): Boolean {
//     return this.MeoAsstLib.AsstLoadResource(path ?? Assistant.libPath)
//   }

//   /**
//    * 创建普通实例, 即无回调版
//    * @returns 实例指针{ref.Pointer}
//    */
//   Create (): boolean {
//     this.MeoAsstPtr.placeholder = this.MeoAsstLib.AsstCreate()
//     return !!this.MeoAsstPtr.placeholder
//   }

//   /**
//    * 创建实例
//    * @param uuid 设备唯一标识符{string}
//    * @param callback 回调函数,
//    * @param customArg 自定义参数{???}
//    * @returns  是否创建成功
//    */
//   CreateEx (
//     /**
//      *
//      */
//     uuid: string,
//     callback: any = cb,
//     customArg: any = voidPointer()
//   ): boolean {
//     if (!this.MeoAsstPtr[uuid]) {
//       this.MeoAsstPtr[uuid] = this.MeoAsstLib.AsstCreateEx(callback, customArg)
//       return true
//     }
//     return false // 重复创建
//   }

//   Destroy (uuid: string): void {
//     if (this.MeoAsstPtr[uuid]) {
//       this.MeoAsstLib.AsstDestroy(this.MeoAsstPtr[uuid])
//       // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//       delete this.MeoAsstPtr[uuid]
//     }
//   }

//   /**
//    * 连接
//    * @param address 连接地址
//    * @param uuid 设备唯一标识符
//    * @param adbPath adb路径
//    * @param config 模拟器名称, 自定义设备为'General'
//    * @returns 是否连接成功
//    */
//   Connect (
//     /**
//      *
//      */
//     address: string,
//     uuid: string,
//     adbPath: string,
//     config: string
//   ): boolean {
//     return this.MeoAsstLib.AsstConnect(
//       this.MeoAsstPtr[uuid],
//       adbPath,
//       address,
//       config
//     )
//   }

//   /**
//    * 添加任务
//    * @param uuid 设备唯一标识符
//    * @param type 任务类型, 详见文档
//    * @param params 任务json字符串, 详见文档
//    * @returns
//    */
//   AppendTask (uuid: string, type: string, params: string): number {
//     return this.MeoAsstLib.AsstAppendTask(this.GetUUID(uuid), type, params)
//   }

//   /**
//    * 设置任务参数
//    * @param uuid 设备唯一标识符
//    * @param taskId 任务唯一id
//    * @param params 任务参数
//    */

//   SetTaskParams (uuid: string, taskId: number, params: string): boolean {
//     return this.MeoAsstLib.AsstSetTaskParams(
//       this.GetUUID(uuid),
//       taskId,
//       params
//     )
//   }

//   /**
//    * 开始任务
//    * @param uuid 设备唯一标识符
//    * @returns 是否成功
//    */
//   Start (uuid: string): boolean {
//     return this.MeoAsstLib.AsstStart(this.GetUUID(uuid))
//   }

//   /**
//    * 停止并清空所有任务
//    * @param uuid 设备唯一标识符
//    * @returns
//    */
//   Stop (uuid: string): boolean {
//     return this.MeoAsstLib.AsstStop(this.GetUUID(uuid))
//   }

//   /**
//    * 发送点击
//    * @param uuid 设备唯一标识符
//    * @param x x坐标
//    * @param y y坐标
//    * @param block 是否阻塞，true会阻塞直到点击完成才返回，false异步返回
//    * @returns
//    */
//   CtrlerClick (uuid: string, x: number, y: number, block: boolean): boolean {
//     return this.MeoAsstLib.AsstCtrlerClick(this.GetUUID(uuid), x, y, block)
//   }

//   GetImage (uuid: string): string {
//     logger.silly('enter GetImage')
//     const buf = Buffer.alloc(5114514)
//     logger.silly(`allocated size ${buf.length}`)
//     const len = this.MeoAsstLib.AsstGetImage(this.GetUUID(uuid), buf as any, buf.length)
//     const buf2 = buf.slice(0, len as number)
//     logger.silly('received image len: ', len)
//     const v2 = buf2.toString('base64')
//     // logger.silly(v2)
//     return v2
//   }

//   /**
//    * 主程序版本
//    * @returns 版本{string}
//    *
//    */
//   GetVersion (): string | null {
//     return this.MeoAsstLib.AsstGetVersion()
//   }

//   /**
//    * 绑定地址到uuid
//    * @param address 设备连接地址
//    * @param uuid 要绑定的uuid
//    */
//   /**
//   SetUUID(address: string, uuid: string) {
//     this.MeoAsstPtr[uuid] = this.MeoAsstPtr[address];
//     delete this.MeoAsstPtr[address];
//   }
//  */
//   GetUUID (uuid: string): AsstInstancePtr {
//     return this.MeoAsstPtr[uuid]
//   }

//   Log (level: string, message: string): void {
//     return this.MeoAsstLib.AsstLog(level, message)
//   }
// }

// function voidPointer (): ref.Value<void> {
//   return ref.alloc(ref.types.void)
// }

// export { Assistant, AsstMsg }
