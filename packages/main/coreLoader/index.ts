import { Singleton } from '@common/function/singletonDecorator'
import Storage from '@main/storageManager'
import path from 'path'
import _ from 'lodash'
import logger from '@main/utils/logger'
import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import ffi, { DynamicLibrary } from '@tigerconnect/ffi-napi'
import ref from '@tigerconnect/ref-napi'
import { getAppBaseDir } from '@main/utils/path'
import type { TouchMode } from '@type/misc'
import { InstanceOptionKey } from '@type/misc'
import { extractFile, unzipFile } from '@main/utils/extract'
import type { ResourceType } from '@type/game'
import { MaaCoreLoader, AsstInstance, type AsstMsg as AsstMsg_Loader } from '@nekosu/loader'
import type { AsstMsg } from '@type/task/callback'

const storage = new Storage()

@Singleton
class CoreLoader {
  private loader: MaaCoreLoader
  private static libPath: string
  private static readonly libPathKey = 'libPath'
  private static readonly defaultLibPath = path.join(getAppBaseDir(), 'core')
  private static loadStatus: boolean // core加载状态
  private readonly DepLibs: DynamicLibrary[] = []
  MeoAsstPtr: Record<string, AsstInstance> = {}
  screenshotCache: Record<string, Buffer> = {}

  constructor() {
    // 在构造函数中创建core存储文件夹
    this.loader = new MaaCoreLoader()
    CoreLoader.loadStatus = false
    CoreLoader.libPath = storage.get(CoreLoader.libPathKey) as string
    if (!_.isString(CoreLoader.libPath) || !existsSync(CoreLoader.libPath)) {
      logger.error(`Update resource folder: ${CoreLoader.libPath} --> ${CoreLoader.defaultLibPath}`)
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
    if (!this.loader.dispose()) {
      logger.error('close core error')
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
      if (!this.loader.load(this.libPath)) {
        // TODO: 改下loader的实现, 把error扔出来
        throw new Error('MaaCore load error')
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
  public LoadResource(path: string = this.libPath): Boolean {
    if (!existsSync(path)) {
      // cache文件夹可能不存在
      logger.warn(`[LoadResource] path not exists ${path}`)
      return false
    }
    return this.loader.loadResource(path ?? this.libPath)
  }

  /**
   * 创建普通实例, 即无回调版
   * @returns 实例指针{ref.Pointer}
   */
  public Create(): boolean {
    this.MeoAsstPtr.placeholder = new AsstInstance(this.loader)
    return !!this.MeoAsstPtr.placeholder
  }

  /**
   * @description 创建实例
   * @param uuid 设备唯一标识符
   * @param callback 回调函数
   * @param customArg 自定义参数{???}
   * @returns  是否创建成功
   */
  public CreateEx(uuid: string): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      this.MeoAsstPtr[uuid] = new AsstInstance(
        this.loader,
        (code: AsstMsg_Loader, data: string) => {
          logger.silly(code)
          logger.silly(data)
          globalThis.renderer.CoreLoader.callback({
            code: code as unknown as AsstMsg,
            data: JSON.parse(data),
          })
        }
      )
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
      this.MeoAsstPtr[uuid].destroy()
      delete this.MeoAsstPtr[uuid]
    }
  }

  /** @deprecated 已废弃，将在接下来的版本中移除 */
  public Connect(address: string, uuid: string, adbPath: string, config: string): boolean {
    // return this.MeoAsstLib.AsstConnect(this.MeoAsstPtr[uuid], `"${adbPath}"`, address, config)
    return false
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
  ): void {
    this.MeoAsstPtr[uuid].connect(`"${adbPath}"`, address, config)
  }

  /**
   * 添加任务
   * @param uuid 设备唯一标识符
   * @param type 任务类型, 详见文档
   * @param params 任务json字符串, 详见文档
   * @returns
   */
  public AppendTask(uuid: string, type: string, params: string): number {
    return this.MeoAsstPtr[uuid].appendTask(type, JSON.parse(params))
  }

  /**
   * 设置任务参数
   * @param uuid 设备唯一标识符
   * @param taskId 任务唯一id
   * @param params 任务参数
   */

  public SetTaskParams(uuid: string, taskId: number, params: string): boolean {
    return this.MeoAsstPtr[uuid].setTaskParams(taskId, JSON.parse(params))
  }

  /**
   * 开始任务
   * @param uuid 设备唯一标识符
   * @returns 是否成功
   */
  public Start(uuid: string): boolean {
    return this.MeoAsstPtr[uuid].start()
  }

  /**
   * 停止并清空所有任务
   * @param uuid 设备唯一标识符
   * @returns
   */
  public Stop(uuid: string): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      logger.warn(`[Stop] uuid not exists ${uuid}`)
      return true
    }
    return this.MeoAsstPtr[uuid].stop()
  }

  /**
   * 发送点击
   * @param uuid 设备唯一标识符
   * @param x x坐标
   * @param y y坐标
   * @returns
   */
  // public Click(uuid: string, x: number, y: number): boolean {
  //   return this.MeoAsstLib.AsstClick(this.GetCoreInstanceByUUID(uuid), x, y)
  // }

  /**
   * 异步请求截图, 在回调中取得截图完成事件后再使用GetImage获取截图
   * @param uuid
   * @param block 阻塞
   * @returns
   */
  public AsyncScreencap(uuid: string): void {
    if (!this.MeoAsstPtr[uuid]) {
      return
    }
    this.MeoAsstPtr[uuid].screencap()
  }

  public GetImage(uuid: string): string {
    const buffer = this.MeoAsstPtr[uuid].image(5114514)
    if (!buffer) {
      return ''
    }
    const bufferBase64 = 'data:image/png;base64,' + buffer.toString('base64')
    return bufferBase64
  }

  /**
   * @description core版本
   * @returns 版本
   */
  public GetCoreVersion(): string | null {
    if (!this.loadStatus) return null
    return this.loader.version()
  }

  public Log(level: string, message: string): void {
    return this.loader.log(level, message)
  }

  public SetTouchMode(uuid: string, mode: TouchMode): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      return false
    }
    return this.MeoAsstPtr[uuid].setTouchMode(mode)
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

  public IsCoreInited(uuid: string): boolean {
    return this.MeoAsstPtr[uuid] !== undefined
  }

  public UpdateTaskJson(type: ResourceType, data: string): void {
    const dirPath = path.join(getAppBaseDir(), 'core', 'cache', type, 'resource')
    if (!existsSync(dirPath)) {
      logger.info(`Create dir ${dirPath}`)
      mkdirSync(dirPath, { recursive: true })
    }
    const filePath = path.join(dirPath, 'tasks.json')
    writeFileSync(filePath, data, 'utf-8')
    logger.info(`[UpdateTaskJson] ${type} updated`)
  }

  public async Upgrade(): Promise<void> {
    logger.info('Start upgrade core')
    const currentVersionFile = path.join(getAppBaseDir(), 'core', 'version')
    const currentVersion = existsSync(currentVersionFile)
      ? readFileSync(currentVersionFile, 'utf-8')
      : 'CUR_NOT_FOUND'
    const upgradeVersionFile = path.join(getAppBaseDir(), 'core', 'upgradable')
    const upgradeVersion = existsSync(upgradeVersionFile)
      ? readFileSync(upgradeVersionFile, 'utf-8')
      : 'UPG_NOT_FOUND'
    if (currentVersion !== upgradeVersion) {
      const upgradeFilePath = path.join(getAppBaseDir(), 'core', 'upgrade')
      const upgradeFileName = existsSync(upgradeFilePath)
        ? readFileSync(upgradeFilePath, 'utf-8')
        : null
      if (upgradeFileName) {
        // eslint-disable-next-line vue/max-len
        logger.info(
          `[CoreLoader] Start upgrade core, current version: ${currentVersion}, upgrade version: ${upgradeVersion}, upgrade file: ${upgradeFileName}`
        )
        unlinkSync(upgradeFilePath) // 提前删除, 防止因为压缩包损坏导致重复尝试更新
        const compressedFile = path.join(getAppBaseDir(), 'download', upgradeFileName)
        const dist = path.join(getAppBaseDir(), 'core')
        if (existsSync(compressedFile)) {
          // 升级前删除cache文件夹
          const cacheDir = path.join(getAppBaseDir(), 'core', 'cache')
          if (existsSync(cacheDir)) {
            rmdirSync(cacheDir, { recursive: true })
          }
          await extractFile(compressedFile, dist)
        }
      }
    }
  }
}

export default CoreLoader
