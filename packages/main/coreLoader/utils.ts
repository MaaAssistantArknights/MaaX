import koffi from 'koffi'
import path from 'path'

type AcceptPlatform = 'win32' | 'linux' | 'darwin'

const plat = process.platform as AcceptPlatform

const libName: Record<AcceptPlatform, (d: string, l: string) => string> = {
  win32: (d, l) => path.join(d, `${l}.dll`),
  linux: (d, l) => path.join(d, `lib${l}.so`),
  darwin: (d, l) => path.join(d, `lib${l}.dylib`)
}

let win_dll_paths: string[] | null = null

export function loadLibrary(file: string) {
  const dir = path.resolve(path.dirname(file))
  const lib = path.basename(file)

  if (plat === 'win32') {
    const kernel = koffi.load('kernel32.dll')
    if (!win_dll_paths) {
      kernel.stdcall('int32 SetDefaultDllDirectories(uint32)')(0x1000)
      win_dll_paths = []
    }
    if (!win_dll_paths.includes(dir)) {
      kernel.stdcall('int32 AddDllDirectory(str16)')(dir)
      win_dll_paths.push(dir)
    }
  }

  return koffi.load(libName[plat](dir, lib))
}

export type PromiseInfo<T> = {
  resolve: (state: T) => void
  promise: Promise<T>
}
export function getPromise<T>(): PromiseInfo<T> {
  const result: Partial<PromiseInfo<T>> = {}
  result.promise = new Promise<T>(resolve => {
    result.resolve = resolve
  })
  return result as PromiseInfo<T>
}
