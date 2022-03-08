import { Type as ConfigurationsType } from '../../main/storage/configuration';
import { Type as TaskType } from '../../main/storage/task';

type StorageType = {
  [props: string]: unknown;
  configuration: ConfigurationsType;
  task: TaskType;
};
