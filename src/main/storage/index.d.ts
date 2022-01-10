import { Type as ConfigurationsType } from './configuration';

type StorageType = {
  [props: string]: unknown;
  configuration: ConfigurationsType;
};
