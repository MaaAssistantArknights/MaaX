export type ConnectionInfoMapper = {
  Reconnecting: {
    why: ''
    details: {
      reconnect: string
      cmd: string
      times: number
    }
  }
  Reconnected: {
    why: ''
    details: {
      reconnect: string
      cmd: string
      times: number
    }
  }
  Disconnect: {
    why: string // "Reconnect failed"
    details: {
      cmd: string
    }
  }
  ConnectFailed: {
    why: string // "ConfigNotFound" | "Connection command failed to exec" | "Uuid command failed to exec" | "Display command failed to exec"
    details: {
      adb: string
      address: string
      config: string
    }
  }
  UuidGot: {
    why: ''
    details: {
      adb: string
      address: string
      config: string
      uuid: string
    }
  }
  ResolutionGot: {
    why: ''
    details: {
      adb: string
      address: string
      config: string
      width: number
      height: number
    }
  }
  ResolutionError: {
    why: string // "Get resolution failed"
    details: {
      adb: string
      address: string
      config: string
      width: number
      height: number
    }
  }
  Connected: {
    why: ''
    details: {
      adb: string
      address: string
      config: string
    }
  }
  ScreencapFailed: {
    why: string // "ScreencapFailed"
    details: {}
  }
  TouchModeNotAvailable: {
    why: ''
    details: {
      adb: string
      address: string
      config: string
    }
  }
  UnsupportedPlayTools: {
    why: string // "NeedUpgrade"
    // details: {}
  }
  UnsupportedResolution: {
    why: string // "Low screen resolution" | "Not 16:9"
    details: {
      width: number
      height: number
    }
  }
}

type ConnectionInfoWhat = keyof ConnectionInfoMapper

type ConnectionInfoCallbackTemplate<What extends ConnectionInfoWhat> = {
  uuid: string
  what: What
}

export type ConnectionInfoCallbackGenerator<Whats extends ConnectionInfoWhat = ConnectionInfoWhat> =
  Whats extends unknown ? ConnectionInfoCallbackTemplate<Whats> : never
