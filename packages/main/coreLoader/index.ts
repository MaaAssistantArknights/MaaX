import { Singleton } from '@main/../common/function/singletonDecorator'
import Storage from '@main/storageManager'
import path from 'path'
import _ from 'lodash'
import logger from '@main/utils/logger'
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs'
import ffi, { DynamicLibrary } from '@tigerconnect/ffi-napi'
import ref from '@tigerconnect/ref-napi'
import callbackHandle from './callback'
import { getAppBaseDir } from '@main/utils/path'
import { InstanceOptionKey } from '@main/../common/enum/core'
import { TouchMode } from '@common/enum/settings'
import extract from 'extract-zip'

const storage = new Storage()

/** Some types for core */
const BoolType = ref.types.bool
const IntType = ref.types.int
const AsstAsyncCallIdType = ref.types.int
// const AsstBoolType = ref.types.uint8
// const IntArrayType = ArrayType(IntType)
// const DoubleType = ref.types.double
const ULLType = ref.types.ulonglong
const VoidType = ref.types.void
const StringType = ref.types.CString
// const StringPtrType = ref.refType(StringType)
// const StringPtrArrayType = ArrayType(StringType)
const AsstType = ref.types.void
const AsstPtrType = ref.refType(AsstType)
// const TaskPtrType = ref.refType(AsstType)
const CustomArgsType = ref.refType(ref.types.void)
const IntPointerType = ref.refType(IntType)
/**
const CallBackType = ffi.Function(ref.types.void, [
  IntType,
  StringType,
  ref.refType(ref.types.void)
])
 */
const Buff = CustomArgsType
type AsstInstancePtr = ref.Pointer<void>
// type TaskInstancePtr = ref.Pointer<void>

// type CallBackFunc = (msg: number, detail: string, custom?: any) => any

function createVoidPointer(): ref.Value<void> {
  return ref.alloc(ref.types.void)
}
@Singleton
class CoreLoader {
  private readonly dependences: Record<string, string[]> = {
    win32: [
      'opencv_world4_maa.dll',
      'onnxruntime_maa.dll',
      'MaaDerpLearning.dll',
    ],
    linux: [
      'libopencv_world4.so',
      'libonnxruntime.so',
      'libMaaDerpLearning.so',
    ],
    darwin: [
      'libopencv_world4.dylib',
      'libonnxruntime.dylib',
      'libMaaDerpLearning.dylib',
    ],
  }

  private readonly libName: Record<string, string> = {
    win32: 'MaaCore.dll',
    darwin: 'libMaaCore.dylib',
    linux: 'libMaaCore.so',
  }

  private DLib!: ffi.DynamicLibrary
  private static libPath: string
  private static readonly libPathKey = 'libPath'
  private static readonly defaultLibPath = path.join(getAppBaseDir(), 'core')
  private static loadStatus: boolean // core加载状态
  public MeoAsstLib!: any
  private readonly DepLibs: DynamicLibrary[] = []
  MeoAsstPtr: Record<string, AsstInstancePtr> = {}

  constructor() {
    // 在构造函数中创建core存储文件夹
    CoreLoader.loadStatus = false
    CoreLoader.libPath = storage.get(CoreLoader.libPathKey) as string
    if (!_.isString(CoreLoader.libPath) || !existsSync(CoreLoader.libPath)) {
      logger.error(
        `Update resource folder: ${CoreLoader.libPath} --> ${CoreLoader.defaultLibPath}`
      )
      CoreLoader.libPath = CoreLoader.defaultLibPath
      if (!existsSync(CoreLoader.libPath)) mkdirSync(CoreLoader.libPath)
    }
    if (path.isAbsolute(CoreLoader.libPath)) {
      CoreLoader.libPath = path.resolve(CoreLoader.libPath)
      storage.set(CoreLoader.libPathKey, CoreLoader.libPath)
    }
  }

  /**
   * @description 返回组件名
   */
  public get name(): string {
    return 'CoreLoader'
  }

  /**
   * @description 返回组件版本
   */
  public get version(): string {
    return '1.0.0'
  }

  public get loadStatus(): boolean {
    return CoreLoader.loadStatus
  }

  /**
   * @description 返回core所在目录
   */
  public get libPath(): string {
    return CoreLoader.libPath
  }

  /**
   * @description 释放core
   */
  public dispose(): void {
    if (!CoreLoader.loadStatus) {
      logger.silly('core already disposed, ignore...')
      return
    }
    for (const uuid of Object.keys(this.MeoAsstPtr)) {
      this.Stop(uuid)
      this.Destroy(uuid)
    }
    try {
      this.DLib.close()
    } catch (e) {
      logger.error('close core error')
    }
    for (const dep of this.DepLibs) {
      dep.close()
    }
    CoreLoader.loadStatus = false
  }

  /**
   * 加载core
   */
  public load(): void {
    if (CoreLoader.loadStatus) {
      logger.silly('core already loaded, ignore..')
      return
    }
    try {
      CoreLoader.loadStatus = true
      this.dependences[process.platform].forEach(lib => {
        this.DepLibs.push(ffi.DynamicLibrary(path.join(this.libPath, lib)))
      })
      this.DLib = ffi.DynamicLibrary(
        path.join(this.libPath, this.libName[process.platform]),
        ffi.RTLD_NOW
      )
      this.MeoAsstLib = {
        AsstSetUserDir: ffi.ForeignFunction(
          this.DLib.get('AsstSetUserDir'),
          BoolType,
          [StringType],
          ffi.FFI_STDCALL
        ),

        AsstLoadResource: ffi.ForeignFunction(
          this.DLib.get('AsstLoadResource'),
          BoolType,
          [StringType],
          ffi.FFI_STDCALL
        ),

        AsstSetStaticOption: ffi.ForeignFunction(
          this.DLib.get('AsstSetStaticOption'),
          BoolType,
          [IntType, StringType],
          ffi.FFI_STDCALL
        ),

        AsstCreate: ffi.ForeignFunction(
          this.DLib.get('AsstCreate'),
          AsstPtrType,
          [],
          ffi.FFI_STDCALL
        ),

        AsstCreateEx: ffi.ForeignFunction(
          this.DLib.get('AsstCreateEx'),
          AsstPtrType,
          ['pointer', CustomArgsType],
          ffi.FFI_STDCALL
        ),

        AsstDestroy: ffi.ForeignFunction(
          this.DLib.get('AsstDestroy'),
          VoidType,
          [AsstPtrType],
          ffi.FFI_STDCALL
        ),

        AsstSetInstanceOption: ffi.ForeignFunction(
          this.DLib.get('AsstSetInstanceOption'),
          BoolType,
          [AsstPtrType, IntType, StringType],
          ffi.FFI_STDCALL
        ),

        AsstConnect: ffi.ForeignFunction(
          this.DLib.get('AsstConnect'),
          BoolType,
          [AsstPtrType, StringType, StringType, StringType],
          ffi.FFI_STDCALL
        ),

        AsstAppendTask: ffi.ForeignFunction(
          this.DLib.get('AsstAppendTask'),
          IntType,
          [AsstPtrType, StringType, StringType],
          ffi.FFI_STDCALL
        ),

        AsstSetTaskParams: ffi.ForeignFunction(
          this.DLib.get('AsstSetTaskParams'),
          BoolType,
          [AsstPtrType, IntType, StringType],
          ffi.FFI_STDCALL
        ),

        AsstStart: ffi.ForeignFunction(
          this.DLib.get('AsstStart'),
          BoolType,
          [AsstPtrType],
          ffi.FFI_STDCALL
        ),

        AsstStop: ffi.ForeignFunction(
          this.DLib.get('AsstStop'),
          BoolType,
          [AsstPtrType],
          ffi.FFI_STDCALL
        ),

        AsstRunning: ffi.ForeignFunction(
          this.DLib.get('AsstRunning'),
          BoolType,
          [AsstPtrType],
          ffi.FFI_STDCALL
        ),

        AsstAsyncConnect: ffi.ForeignFunction(
          this.DLib.get('AsstAsyncConnect'),
          AsstAsyncCallIdType,
          [AsstPtrType, StringType, StringType, StringType, BoolType],
          ffi.FFI_STDCALL
        ),

        AsstAsyncClick: ffi.ForeignFunction(
          this.DLib.get('AsstAsyncClick'),
          AsstAsyncCallIdType,
          [AsstPtrType, IntType, IntType, BoolType],
          ffi.FFI_STDCALL
        ),

        AsstAsyncScreencap: ffi.ForeignFunction(
          this.DLib.get('AsstAsyncScreencap'),
          AsstAsyncCallIdType,
          [AsstPtrType, BoolType],
          ffi.FFI_STDCALL
        ),

        AsstGetImage: ffi.ForeignFunction(
          this.DLib.get('AsstGetImage'),
          ULLType,
          [AsstPtrType, Buff, ULLType],
          ffi.FFI_STDCALL
        ),

        AsstGetUUID: ffi.ForeignFunction(
          this.DLib.get('AsstGetUUID'),
          ULLType,
          [AsstPtrType, StringType, ULLType],
          ffi.FFI_STDCALL
        ),

        AsstGetTasksList: ffi.ForeignFunction(
          this.DLib.get('AsstGetTasksList'),
          ULLType,
          [AsstPtrType, IntPointerType, ULLType],
          ffi.FFI_STDCALL
        ),

        AsstGetNullSize: ffi.ForeignFunction(
          this.DLib.get('AsstGetNullSize'),
          ULLType,
          [],
          ffi.FFI_STDCALL
        ),

        AsstGetVersion: ffi.ForeignFunction(
          this.DLib.get('AsstGetVersion'),
          StringType,
          [],
          ffi.FFI_STDCALL
        ),

        AsstLog: ffi.ForeignFunction(
          this.DLib.get('AsstLog'),
          VoidType,
          [StringType, StringType],
          ffi.FFI_STDCALL
        ),
      }
      const version = this.GetCoreVersion()
      if (version) {
        logger.info(`core loaded: version ${version}`)
      }
    } catch (error) {
      // console.error()
      logger.error((error as Error).message)
      this.dispose()
    }
  }

  /**
   * 指定资源路径
   * @param path? 未指定就用libPath
   * @returns
   */
  public LoadResource(path?: string): Boolean {
    return this.MeoAsstLib.AsstLoadResource(path ?? this.libPath)
  }

  /**
   * 创建普通实例, 即无回调版
   * @returns 实例指针{ref.Pointer}
   */
  public Create(): boolean {
    this.MeoAsstPtr.placeholder = this.MeoAsstLib.AsstCreate()
    return !!this.MeoAsstPtr.placeholder
  }

  /**
   * @description 创建实例
   * @param uuid 设备唯一标识符
   * @param callback 回调函数
   * @param customArg 自定义参数{???}
   * @returns  是否创建成功
   */
  public CreateEx(
    uuid: string,
    callback: any = callbackHandle,
    customArg: any = createVoidPointer()
  ): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      this.MeoAsstPtr[uuid] = this.MeoAsstLib.AsstCreateEx(callback, customArg)
      return true
    }
    return false // 重复创建
  }

  /**
   * @description 摧毁实例
   * @param uuid 设备唯一标识符
   */
  public Destroy(uuid: string): void {
    if (this.MeoAsstPtr[uuid]) {
      this.MeoAsstLib.AsstDestroy(this.MeoAsstPtr[uuid])
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.MeoAsstPtr[uuid]
    }
  }

  /** @deprecated 已废弃，将在接下来的版本中移除 */
  public Connect(
    address: string,
    uuid: string,
    adbPath: string,
    config: string
  ): boolean {
    return this.MeoAsstLib.AsstConnect(
      this.MeoAsstPtr[uuid],
      adbPath,
      address,
      config
    )
  }

  /**
   * @description 连接
   * @param address 连接地址
   * @param uuid 设备唯一标识符
   * @param adbPath adb路径
   * @param config 模拟器名称, 自定义设备为'General'
   * @param block 是否阻塞
   * @returns 是否连接成功
   */
  public AsyncConnect(
    address: string,
    uuid: string,
    adbPath: string,
    config: string,
    block: boolean = false
  ): number {
    return this.MeoAsstLib.AsstAsyncConnect(
      this.MeoAsstPtr[uuid],
      adbPath,
      address,
      config,
      block
    )
  }

  /**
   * 添加任务
   * @param uuid 设备唯一标识符
   * @param type 任务类型, 详见文档
   * @param params 任务json字符串, 详见文档
   * @returns
   */
  public AppendTask(uuid: string, type: string, params: string): number {
    return this.MeoAsstLib.AsstAppendTask(
      this.GetCoreInstanceByUUID(uuid),
      type,
      params
    )
  }

  /**
   * 设置任务参数
   * @param uuid 设备唯一标识符
   * @param taskId 任务唯一id
   * @param params 任务参数
   */

  public SetTaskParams(uuid: string, taskId: number, params: string): boolean {
    return this.MeoAsstLib.AsstSetTaskParams(
      this.GetCoreInstanceByUUID(uuid),
      taskId,
      params
    )
  }

  /**
   * 开始任务
   * @param uuid 设备唯一标识符
   * @returns 是否成功
   */
  public Start(uuid: string): boolean {
    return this.MeoAsstLib.AsstStart(this.GetCoreInstanceByUUID(uuid))
  }

  /**
   * 停止并清空所有任务
   * @param uuid 设备唯一标识符
   * @returns
   */
  public Stop(uuid: string): boolean {
    return this.MeoAsstLib.AsstStop(this.GetCoreInstanceByUUID(uuid))
  }

  /**
   * 发送点击
   * @param uuid 设备唯一标识符
   * @param x x坐标
   * @param y y坐标
   * @returns
   */
  public Click(uuid: string, x: number, y: number): boolean {
    return this.MeoAsstLib.AsstClick(this.GetCoreInstanceByUUID(uuid), x, y)
  }

  /**
   * 异步请求截图, 在回调中取得截图完成事件后再使用GetImage获取截图
   * @param uuid
   * @param block 阻塞
   * @returns
   */
  public AsyncScreencap(uuid: string, block: boolean = true): number | boolean {
    if (!this.MeoAsstPtr[uuid]) return false
    return this.MeoAsstLib.AsstAsyncScreencap(
      this.GetCoreInstanceByUUID(uuid),
      block
    )
  }

  public GetImage(uuid: string): string {
    const buf = Buffer.alloc(5114514)
    const len = this.MeoAsstLib.AsstGetImage(
      this.GetCoreInstanceByUUID(uuid),
      buf as any,
      buf.length
    )
    const buf2 = buf.slice(0, len as number)
    const v2 = buf2.toString('base64')
    return v2
  }

  /**
   * @description core版本
   * @returns 版本
   */
  public GetCoreVersion(): string | null {
    if (!this.loadStatus) return null
    return this.MeoAsstLib.AsstGetVersion()
  }

  public GetCoreInstanceByUUID(uuid: string): AsstInstancePtr {
    return this.MeoAsstPtr[uuid]
  }

  public Log(level: string, message: string): void {
    return this.MeoAsstLib.AsstLog(level, message)
  }

  public SetInstanceOption(
    uuid: string,
    key: InstanceOptionKey,
    value: string
  ): boolean {
    return this.MeoAsstLib.AsstSetInstanceOption(
      this.GetCoreInstanceByUUID(uuid),
      key,
      value
    )
  }

  public SetTouchMode(uuid: string, mode: TouchMode): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      return false
    }
    return this.SetInstanceOption(uuid, InstanceOptionKey.TouchMode, mode)
  }

  /**
   * @description change touchmode for all instances
   * @param mode TouchMode
   * @returns is all changes success
   */
  public ChangeTouchMode(mode: TouchMode): boolean {
    for (const uuid in this.MeoAsstPtr) {
      if (this.MeoAsstPtr[uuid]) {
        const status = this.SetTouchMode(uuid, mode)
        if (!status) {
          logger.error(`Change touch mode failed on uuid: ${uuid}`)
          return status
        }
      }
    }
    return true
  }

  public async Upgrade(): Promise<void> {
    logger.info('Start upgrade core')
    const currentVersionFile = path.join(
      getAppBaseDir(),
      'core',
      'core_version'
    )
    const currentVersion = existsSync(currentVersionFile)
      ? readFileSync(currentVersionFile, 'utf-8')
      : 'CUR_NOT_FOUND'
    const upgradeVersionFile = path.join(
      getAppBaseDir(),
      'core',
      'core_upgradable'
    )
    const upgradeVersion = existsSync(upgradeVersionFile)
      ? readFileSync(upgradeVersionFile, 'utf-8')
      : 'UPG_NOT_FOUND'
    if (currentVersion !== upgradeVersion) {
      const upgradeFilePath = path.join(getAppBaseDir(), 'core', 'core_upgrade')
      const upgradeFileName = existsSync(upgradeFilePath)
        ? readFileSync(upgradeFilePath, 'utf-8')
        : null
      if (upgradeFileName) {
        // eslint-disable-next-line vue/max-len
        logger.info(
          `[CoreLoader] Start upgrade core, current version: ${currentVersion}, upgrade version: ${upgradeVersion}, upgrade file: ${upgradeFileName}`
        )
        unlinkSync(upgradeFilePath) // 提前删除, 防止因为压缩包损坏导致重复尝试更新
        const unzipFile = path.join(
          getAppBaseDir(),
          'download',
          upgradeFileName
        )
        const dist = path.join(getAppBaseDir(), 'core')
        if (existsSync(unzipFile)) {
          await extract(unzipFile, { dir: dist })
        }
      }
    }
  }
}

// (new CoreLoader()).load()

export default CoreLoader
