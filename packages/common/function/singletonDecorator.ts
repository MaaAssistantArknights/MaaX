export function Singleton<T extends new (...args: any) => any>(C: T): T {
  let instance: T | null = null
  return class extends C {
    constructor(...args: any) {
      if (instance) {
        return instance
      }
      super(...args)
      instance = this as unknown as T
    }
  }
}
