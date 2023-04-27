import type { GetTask, Task } from '@type/task'

export type GetConfig<T extends Task['name']> = Required<
  GetTask<T>['configurations']
>
