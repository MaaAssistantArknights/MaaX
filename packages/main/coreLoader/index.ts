import { Singleton } from '@common/function/singletonDecorator'
import { getComponentBaseDir } from '@main/componentManager/utils/path'
import Storage from '@main/storageManager'
import logger from '@main/utils/logger'
import _ from 'lodash'
import path from 'path'

import { existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import koffi, { type IKoffiRegisteredCallback, type KoffiFunction, type pointer } from 'koffi'
import { callbackHandle } from './callback'
import { getAppBaseDir } from '@main/utils/path'
import type { TouchMode } from '@type/misc'
import { InstanceOptionKey } from '@type/misc'
import { extractFile, unzipFile } from '@main/utils/extract'
import type { ResourceType } from '@type/game'
import { loadLibrary } from './utils'
import { type MaaCoreExports, load } from './api'
import { AsstApiCallback } from './types'
import type { AsstMsg } from '@type/task/callback'
export * from './types'


const storage = new Storage()

@Singleton
class CoreLoader {

  public static libPath: string

  private lib!: koffi.IKoffiLib
  private func!: MaaCoreExports
  private static readonly libPathKey = 'libPath'
  private static readonly defaultLibPath = path.join(getAppBaseDir(), 'core')
  private static loadStatus: boolean // core加载状态
  MeoAsstPtr: Record<string, unknown> = {}
  screenshotCache: Record<string, Buffer> = {}
  callback: IKoffiRegisteredCallback

  constructor() {
    // 在构造函数中创建core存储文件夹
    CoreLoader.loadStatus = false
    CoreLoader.libPath = storage.get(CoreLoader.libPathKey) as string
    if (!_.isString(CoreLoader.libPath) || !existsSync(CoreLoader.libPath)) {
      logger.error(`[CoreLoader] Update resource folder: ${CoreLoader.libPath} --> ${CoreLoader.defaultLibPath}`)
      CoreLoader.libPath = CoreLoader.defaultLibPath
      if (!existsSync(CoreLoader.libPath)) mkdirSync(CoreLoader.libPath)
    }
    if (path.isAbsolute(CoreLoader.libPath)) {
      CoreLoader.libPath = path.resolve(CoreLoader.libPath)
      storage.set(CoreLoader.libPathKey, CoreLoader.libPath)
    }
    this.callback = koffi.register(callbackHandle, AsstApiCallback)
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
      this.lib?.unload()
    } catch (e) {
      logger.error(e)
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
      this.lib = loadLibrary(path.join(CoreLoader.libPath, 'MaaCore'))
      this.func = load(this.lib)

      
      const version = this.GetCoreVersion()
      if (version) {
        logger.info(`core loaded: version ${version}`)
      }
    } catch (error) {
      logger.error((error as Error).message)
      this.dispose()
    }
  }

  /**
   * 指定资源路径
   * @param path? 未指定就用libPath
   * @returns
   */
  public LoadResource(corePath: string = path.join(getComponentBaseDir(), 'core')): Boolean {
    if (!existsSync(corePath)) {
      // cache文件夹可能不存在
      logger.warn(`[LoadResource] path not exists ${path}`)
      return false
    }
    return this.func.AsstLoadResource(corePath ?? CoreLoader.libPath)
  }

  /**
   * 创建普通实例, 即无回调版
   * @returns 实例指针{ref.Pointer}
   */
  public Create(): boolean {
    this.MeoAsstPtr.placeholder = this.func.AsstCreate()
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
    // callback: any = this.callBackHandle,
    // customArg: any = 0
  ): boolean {
    if (!this.MeoAsstPtr[uuid]) {
      this.MeoAsstPtr[uuid] = this.func.AsstCreateEx(this.callback, 0)
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
      this.func.AsstDestroy(this.MeoAsstPtr[uuid])
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.MeoAsstPtr[uuid]
    }
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
    return this.func.AsstAsyncConnect(
      this.MeoAsstPtr[uuid],
      `"${adbPath}"`,
      address,
      config,
      block == true ? 1 : 0
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
    return this.func.AsstAppendTask(this.GetCoreInstanceByUUID(uuid), type, params)
  }

  /**
   * 设置任务参数
   * @param uuid 设备唯一标识符
   * @param taskId 任务唯一id
   * @param params 任务参数
   */

  public SetTaskParams(uuid: string, taskId: number, params: string): boolean {
    return this.func.AsstSetTaskParams(this.GetCoreInstanceByUUID(uuid), taskId, params)
  }

  /**
   * 开始任务
   * @param uuid 设备唯一标识符
   * @returns 是否成功
   */
  public Start(uuid: string): boolean {
    return this.func.AsstStart(this.GetCoreInstanceByUUID(uuid))
  }

  /**
   * 停止并清空所有任务
   * @param uuid 设备唯一标识符
   * @returns
   */
  public Stop(uuid: string): boolean {
    if (!this.GetCoreInstanceByUUID(uuid)) {
      logger.warn(`[Stop] uuid not exists ${uuid}`)
      return true
    }
    return this.func.AsstStop(this.GetCoreInstanceByUUID(uuid))
  }
  /**
   * 异步请求截图, 在回调中取得截图完成事件后再使用GetImage获取截图
   * @param uuid
   * @param block 阻塞
   * @returns
   */
  public AsyncScreencap(uuid: string, block: boolean = true): number | boolean {
    if (!this.MeoAsstPtr[uuid]) return false
    return this.func.AsstAsyncScreencap(this.GetCoreInstanceByUUID(uuid), block)
  }

  public GetImage(uuid: string): string {
    if (!this.screenshotCache[uuid]) {
      this.screenshotCache[uuid] = Buffer.alloc(5114514)
    }
    const buffer = this.screenshotCache[uuid]
    const len = this.func.AsstGetImage(
      this.GetCoreInstanceByUUID(uuid),
      buffer,
      buffer.length
    )
    const bufferImage = buffer.subarray(0, len as number)
    const bufferBase64 = 'data:image/png;base64,' + bufferImage.toString('base64')
    return bufferBase64
  }

  /**
   * @description core版本
   * @returns 版本
   */
  public GetCoreVersion(): string | null {
    if (!this.loadStatus) return null
    return this.func.AsstGetVersion()
  }

  public GetCoreInstanceByUUID(uuid: string): any {
    console.log('type of this.MeoAsstPtr[uuid]', typeof this.MeoAsstPtr[uuid])
    return this.MeoAsstPtr[uuid]
  }

  public Log(level: string, message: string): void {
    return this.func.AsstLog(level, message)
  }

  public SetInstanceOption(uuid: string, key: InstanceOptionKey, value: string): boolean {
    return this.func.AsstSetInstanceOption(this.GetCoreInstanceByUUID(uuid), key, value)
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

  public IsCoreInited(uuid: string): boolean {
    return this.MeoAsstPtr[uuid] !== undefined
  }

  public UpdateTaskJson(type: ResourceType, data: string): void {
    const dirPath = path.join(getComponentBaseDir(), 'core', 'cache', type, 'resource')
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
    const currentVersionFile = path.join(getComponentBaseDir(), 'core', 'version')
    const currentVersion = existsSync(currentVersionFile)
      ? readFileSync(currentVersionFile, 'utf-8')
      : null
    const upgradeVersionFile = path.join(getComponentBaseDir(), 'core', 'upgradable')
    const upgradeVersion = existsSync(upgradeVersionFile)
      ? readFileSync(upgradeVersionFile, 'utf-8')
      : null
    if (currentVersion && upgradeVersion && currentVersion !== upgradeVersion) {
      const upgradeFilePath = path.join(getComponentBaseDir(), 'core', 'upgrade')
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
        const dist = path.join(getComponentBaseDir(), 'core')
        if (existsSync(compressedFile)) {
          // 升级前删除cache文件夹
          const cacheDir = path.join(getComponentBaseDir(), 'core', 'cache')
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
