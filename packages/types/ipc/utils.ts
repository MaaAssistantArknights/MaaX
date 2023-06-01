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

type CalleeWrapper<Func extends (...args: any[]) => any, Event> = (
  ...args: [...args: Parameters<Func>, event: Event]
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
  Scope extends 'renderer' | 'main',
  ExtEvent
> = {
  [Cate in Category<Event, Scope>]: {
    [SubC in CategoryChild<Event, Scope, Cate>]?: `${Scope}.${Cate}:${SubC}` extends keyof Event
      ? CalleeWrapper<Event[`${Scope}.${Cate}:${SubC}`], ExtEvent>
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
                    return action(`${scope}.${key}:${subk}`, ...args)
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
  Scope extends 'renderer' | 'main',
  ExtEvent
>(
  scope: Scope,
  add: <K extends keyof Event>(
    key: K,
    func: (e: ExtEvent, ...args: Parameters<Event[K]>) => ReturnType<Event[K]>
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
                add(`${scope}.${key}:${subk}`, (event: ExtEvent, ...args: any[]) => {
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
          const func = value[subk]
          add(`${scope}.${key}:${subk}`, (event: ExtEvent, ...args: any[]) => {
            return func(...args, event)
          })
        }
        return true
      },
    }
  ) as CalleeProxyObjectType<Event, Scope, ExtEvent>
}
