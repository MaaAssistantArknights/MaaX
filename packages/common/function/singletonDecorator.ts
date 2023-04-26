export const SINGLETON_KEY = Symbol('SINGLETON')

type SingletonType<T extends new (...args: any[]) => any> = T & {
  [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
}

export const Singleton = <T extends new (...args: any[]) => any>(type: T): T =>
  new Proxy(type, {
    // this will hijack the constructor
    construct(target: SingletonType<T>, argsList, newTarget) {
      // we should skip the proxy for children of our target class
      if (target.prototype !== newTarget.prototype) {
        return Reflect.construct(target, argsList, newTarget)
      }
      // if our target class does not have an instance, create it
      if (!target[SINGLETON_KEY]) {
        target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget)
      }
      // return the instance we created!
      return target[SINGLETON_KEY]
    },
  })
