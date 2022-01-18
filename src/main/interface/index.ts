import ffi from 'ffi-napi';
import ref from 'ref-napi';
import ArrayType from 'ref-array-napi';
import path from 'path';

const CallBack = ffi.Function(ref.types.void, [
  ref.types.int,
  'string',
  ref.refType(ref.types.void),
]);
const CallBackPtr = ref.refType(CallBack);
const Asst = ref.types.void;
const AsstPtr = ref.refType(Asst);
const Bool = ref.types.bool;
const CustomArgs = ref.refType(ref.types.void);
const String = 'string';
const StringPtr = ref.refType(String);
const StringPtrArray = ArrayType(String);
const Int = 'int';
const IntArray = ArrayType(Int);

interface CallbackFunc {
  (msg: number, detail: string, custom_arg?: any): any;
}

/**
 * 造一个用于传入的数组
 * @param array
 * @returns
 */
function ffiArray(array: any[]) {
  if (typeof array[0] === 'number') {
    return IntArray(array);
  }

  const stringArray = new Array<any>();
  array.forEach((v) => {
    stringArray.push(Buffer.from(v));
  });
  return StringPtrArray(stringArray);
}

const dependences: Record<string, Array<string>> = {
  win32: [
    'libiomp5md',
    'mklml',
    'mkldnn',
    'opencv_world453',
    'paddle_inference',
    'ppocr',
    'penguin-stats-recognize',
  ],
  linux: [],
  darwin: [],
};

class Assistant {
  lib_others: string;

  lib_asst: string;

  lib_main = 'MeoAssistant';

  MeoAsst;

  MeoAsstPtr!: ref.Pointer<void>;

  /**
   * 初始化, 加载全部链接库, 在windows上第三方库与主程序位于同一路径, 所以lib_asst等于lib_others, 在其他os上可能需要区分两个路径
   * @params lib_others 第三方库文件绝对路径 {string}
   * @params lib_asst 本体路径
   *
   */
  constructor(lib_others: string, lib_asst: string = lib_others) {
    this.lib_others = path.resolve(lib_others);
    this.lib_asst = path.resolve(lib_asst);

    dependences[process.platform].forEach((lib) => {
      ffi.Library(path.join(this.lib_others, lib));
    });

    console.log(this.lib_others);
    console.log(this.lib_main);
    this.MeoAsst = ffi.Library(path.join(this.lib_others, this.lib_main), {
      /* AsstCallback:[ref.refType(ref.types.void),[ref.types.int,'string',ref.refType(ref.types.void)]], */
      AsstCreate: [AsstPtr, ['string']],
      AsstCreateEx: [AsstPtr, ['string', 'pointer', CustomArgs]],
      AsstDestroy: [AsstPtr, [AsstPtr]],

      AsstCatchDefault: [Bool, [AsstPtr]],
      AsstCatchEmulator: [Bool, [AsstPtr]],
      AsstCatchCustom: [Bool, [AsstPtr, 'string']],
      AsstCatchFake: [Bool, [AsstPtr]],

      AsstAppendStartUp: [Bool, [AsstPtr]],
      AsstAppendFight: [Bool, [AsstPtr, 'string', 'int', 'int', 'int']],
      AsstAppendAward: [Bool, [AsstPtr]],
      AsstAppendVisit: [Bool, [AsstPtr]],
      AsstAppendMall: [Bool, [AsstPtr, Bool]],
      AsstAppendInfrast: [
        Bool,
        [AsstPtr, 'int', StringPtrArray, 'int', 'string', 'double'],
      ],
      AsstAppendRecruit: [
        Bool,
        [AsstPtr, 'int', IntArray, 'int', IntArray, 'int', Bool],
      ],
      AsstAppendDebug: [Bool, [AsstPtr]],

      AsstStartRecruitCalc: [Bool, [AsstPtr, IntArray, 'int', Bool]],
      AsstStart: [Bool, [AsstPtr]],
      AsstStop: [Bool, [AsstPtr]],

      AsstSetPenguinId: [Bool, [AsstPtr, 'int']],

      AsstGetVersion: ['string', []],
    });

    // this.MeoAsst = new ffi.DynamicLibrary(
    //   path.join(this.lib_others, this.lib_main)
    // );
  }

  /**
   * 创建普通实例
   * @param dirname 路径{string}
   * @returns 实例指针{ref.Pointer}
   */
  Create(dirname: string) {
    // const asstCreate = ffi.ForeignFunction(
    //   this.MeoAsst.get('AsstCreate'),
    //   AsstPtr,
    //   ['string'],
    //   ffi.FFI_STDCALL
    // );
    // this.MeoAsstPtr = asstCreate(dirname);
    this.MeoAsstPtr = this.MeoAsst.AsstCreate(dirname);

    return this.MeoAsstPtr;
  }

  /**
   * 创建实例
   * @param dirname 本体路径{string}
   * @param callback 回调函数, 必须要有msg,detail参数, 可选custom_arg
   * @param custom_arg 自定义参数{???}
   * @returns  实例指针{ref.Pointer}
   */
  CreateEx(
    callback: CallbackFunc,
    custom_arg: any,
    dirname: string = this.lib_asst
  ): ref.Pointer<void> {
    const cb = ffi.Callback(
      'void',
      ['int', 'string', ref.refType(ref.types.void)],
      (msg, detail, custom_args) => {
        callback(
          msg as unknown as number,
          detail as unknown as string,
          custom_args
        );
      }
    );

    this.MeoAsstPtr = this.MeoAsst.AsstCreateEx(dirname, cb, custom_arg);

    return this.MeoAsstPtr;
  }

  Destroy(p_asst: ref.Pointer<void> = this.MeoAsstPtr): ref.Pointer<void> {
    return this.MeoAsst.AsstDestroy(p_asst);
  }

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

  /**
   * 添加开始唤醒任务
   * @param p_asst 实例指针
   * @returns
   */
  AppendStartUp(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstStart(p_asst);
  }

  /**
   * 添加作战任务
   * @param p_asst 实例指针
   * @param stage 关卡, 当前关卡:"" , 上次作战:"lastBattle" , 剿灭作战:"Annihilation" , 龙门币-5:"CE-5", 红票-5:"AP-5", 经验-5:"LS-5", 技能-5:"CA-5",
   * @param max_mecidine 最多使用理智药数量
   * @param max_stone 最多使用源石数量
   * @param max_times 最多刷几次关卡
   * @returns
   */
  AppendFight(
    stage: string,
    max_mecidine: number,
    max_stone: number,
    max_times: number,
    p_asst: ref.Pointer<void>
  ): boolean {
    return this.MeoAsst.AsstAppendFight(
      p_asst,
      stage,
      max_mecidine,
      max_stone,
      max_times
    );
  }

  /**
   * 添加领取奖励任务
   * @param p_asst 实例指针
   * @returns
   */
  AppendAward(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstAppendAward(p_asst);
  }

  /**
   * 添加访问好友基建任务
   * @param p_asst 实例指针
   * @returns
   */
  AppendVisit(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstAppendVisit(p_asst);
  }

  /**
   * 添加信用购物任务
   * @param with_shopping 是否购物{boolean}
   * @returns
   */
  AppendMall(
    with_shopping: boolean,
    p_asst: ref.Pointer<void> = this.MeoAsstPtr
  ) {
    return this.MeoAsst.AsstAppendMall(p_asst, with_shopping);
  }

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
  AppendInfrast(
    work_mode: number,
    order: string[],
    order_size: number,
    uses_of_drones: string,
    dorm_threshold: number,
    p_asst: ref.Pointer<void> = this.MeoAsstPtr
  ): boolean {
    return this.MeoAsst.AsstAppendInfrast(
      p_asst,
      work_mode,
      ffiArray(order),
      order_size,
      uses_of_drones,
      dorm_threshold
    );
  }

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
  AppendRecruit(
    max_times: number,
    select_level: number[],
    select_len: number,
    confirm_level: number[],
    confirm_len: number,
    need_refresh: boolean,
    p_asst: ref.Pointer<void> = this.MeoAsstPtr
  ): boolean {
    return this.MeoAsst.AsstAppendRecruit(
      p_asst,
      max_times,
      ffiArray(select_level),
      select_len,
      ffiArray(confirm_level),
      confirm_len,
      need_refresh
    );
  }

  /**
   *
   * @param p_asst
   * @returns
   */
  AppendDebug(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstAppendDebug(p_asst);
  }

  /**
   * 进行公招计算
   * @param p_asst 实例指针
   * @param select_level 选择的Tags等级{number[]}
   * @param required_len select_level的长度{number}
   * @param set_time 是否点击九小时{boolean}
   * @returns
   */
  StartRecruitCalc(
    select_level: number[],
    required_len: number,
    set_time: boolean,
    p_asst: ref.Pointer<void> = this.MeoAsstPtr
  ): boolean {
    return this.MeoAsst.AsstStartRecruitCalc(
      p_asst,
      ffiArray(select_level),
      required_len,
      set_time
    );
  }

  /**
   * 开始任务
   * @param p_asst
   * @returns
   */
  Start(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstStart(p_asst);
  }

  /**
   * 停止并清空所有任务
   * @param p_asst
   * @returns
   */
  Stop(p_asst: ref.Pointer<void> = this.MeoAsstPtr): boolean {
    return this.MeoAsst.AsstStop(p_asst);
  }

  /**
   * 设置企鹅物流id
   * @param p_asst 实例指针
   * @param id 企鹅物流id
   * @returns
   */
  SetPenguinId(
    p_asst: ref.Pointer<void> = this.MeoAsstPtr,
    id: number
  ): boolean {
    return this.MeoAsst.AsstSetPenguinId(p_asst, id);
  }

  /**
   * 主程序版本
   * @returns 版本{string}
   *
   */
  GetVersion = () => {
    return this.MeoAsst.AsstGetVersion();
  };
}

/**
 * 返回空指针
 * @returns
 */
function voidPointer() {
  return ref.alloc(ref.types.void);
}

export { Assistant, voidPointer };
