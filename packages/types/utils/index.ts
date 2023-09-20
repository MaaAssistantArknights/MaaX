/**
 * 对象转换为路径对象
 */
export type NestedPath<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedPath<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

/**
 * 获取函数第一个参数以外的参数
 */
export type GetFnRemoveFirstParams<T extends (...args: any) => any> = T extends (
  first: any,
  ...args: infer U
) => any
  ? U
  : never
