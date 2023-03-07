enum TouchMode {
    minitouch = 'minitouch',
    maatouch = 'maatouch',
    adb = 'adb'
  }

type InitCoreParam = {
    address: string
    uuid: string
    adb_path: string
    config: string
    touch_mode: TouchMode
}