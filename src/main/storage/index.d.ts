import { Type as ConfigurationsType } from './configuration';
import { Type as TaskType } from './task';

type StorageType = {
  [props: string]: unknown;
  configuration: ConfigurationsType;
  task: TaskType;
};
