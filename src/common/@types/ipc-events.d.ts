type StorageEvents =
  | 'storage:get'
  | 'storage:set'
  | 'storage:has'
  | 'storage:error';

type AsstEvents = 'asst:linkstart' | 'asst:appendTasks';

type IPCEvents = StorageEvents | AsstEvents;
