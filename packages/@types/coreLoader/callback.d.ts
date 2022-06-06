interface callbackDetail {
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
  [key in AsstMsg]: (msg: number, detail: callbackDetail) => object;
}
