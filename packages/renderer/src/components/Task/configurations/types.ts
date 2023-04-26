export type GetConfig<T extends Task['name']> = Required<
  __GetTask<T>['configurations']
>
