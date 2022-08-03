interface CallbackDetail {
  uuid: string
  what: string
  taskchain: string
  details: {
    task: string
    address: string
    uuid: string
    exec_times: number | string
  }
}

type taskchainProps = {
  [key in import('../../common/enum/callback').AsstMsg]: (detail: CallbackDetail) => object;
}

interface Callback {
  code: import('../../common/enum/callback').AsstMsg
  detail: CallbackDetail
  customArgs: string | int | object
}
