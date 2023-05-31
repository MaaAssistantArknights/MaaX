type Category<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main'
> = keyof Event extends `${Scope}.${infer Cate}:${infer Rest}` ? Cate : never

type CategoryChild<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main',
  Cate extends Category<Event, Scope>,
  Keys extends keyof Event = keyof Event
> = Keys extends `${Scope}.${Cate}:${infer SubC}` ? SubC : never

type UnPromise<T> = T extends Promise<infer X> ? X : T

type CleanVoid<T> = T extends Promise<void> ? void : T

type CallerWrapper<Func extends (...args: any[]) => any> = (
  ...args: Parameters<Func>
) => CleanVoid<Promise<UnPromise<ReturnType<Func>>>>

type CalleeWrapper<Func extends (...args: any[]) => any> = (
  ...args: Parameters<Func>
) => ReturnType<Func>

export type CallerProxyObjectType<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main'
> = {
  [Cate in Category<Event, Scope>]: {
    [SubC in CategoryChild<Event, Scope, Cate>]: `${Scope}.${Cate}:${SubC}` extends keyof Event
      ? CallerWrapper<Event[`${Scope}.${Cate}:${SubC}`]>
      : never
  }
}

export type CalleeProxyObjectType<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main'
> = {
  [Cate in Category<Event, Scope>]: {
    [SubC in CategoryChild<Event, Scope, Cate>]?: `${Scope}.${Cate}:${SubC}` extends keyof Event
      ? CalleeWrapper<Event[`${Scope}.${Cate}:${SubC}`]>
      : never
  }
}

export function createCallerProxy<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main'
>(scope: Scope, action: <K extends keyof Event>(key: K, ...args: Parameters<Event[K]>) => void) {
  return new Proxy(
    {},
    {
      get(_target: Record<string, unknown>, key: string) {
        if (!(key in _target)) {
          _target[key] = new Proxy(
            {},
            {
              get(_target2: Record<string, unknown>, subk: string) {
                if (!(subk in _target2)) {
                  _target2[subk] = (...args: any[]) => {
                    // @ts-ignore
                    action(`${scope}.${key}:${subk}`, ...args)
                    // window.ipcRenderer.invoke(`main.${key}:${subk}` as IpcMainHandleEvent, ...args)
                  }
                }
                return _target2[subk]
              },
            }
          )
        }
        return _target[key]
      },
    }
  ) as CallerProxyObjectType<Event, Scope>
}

export function createCalleeProxy<
  Event extends Record<string, (...args: any[]) => any>,
  Scope extends 'renderer' | 'main'
>(
  scope: Scope,
  add: <K extends keyof Event>(
    key: K,
    func: (e: unknown, ...args: Parameters<Event[K]>) => ReturnType<Event[K]>
  ) => void,
  del: (key: keyof Event) => void
) {
  return new Proxy(
    {},
    {
      get(_target: Record<string, unknown>, key: string) {
        if (!(key in _target)) {
          _target[key] = new Proxy(
            {},
            {
              set(_target2: Record<string, unknown>, subk: string, value: (...args: any[]) => any) {
                add(`${scope}.${key}:${subk}`, (event: unknown, ...args: any[]) => {
                  return value(...args, event)
                })
                return true
              },
              deleteProperty(_target: unknown, subk: string) {
                del(`${scope}.${key}:${subk}`)
                return true
              },
            }
          )
        }
        return _target[key]
      },
      set(
        _target: Record<string, unknown>,
        key: string,
        value: Record<string, (...args: any[]) => any>
      ) {
        for (const subk in value) {
          add(`${scope}.${key}:${subk}`, value[subk])
        }
        return true
      },
    }
  ) as CalleeProxyObjectType<Event, Scope>
}
