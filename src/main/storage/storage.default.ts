import { StorageType } from './index.d';

const defaults: StorageType = {
  configuration: {
    connection: {},
    infrastructure: {
      enable: {
        ManufacturingStation: true,
        TradingStation: true,
        ControlCenter: true,
        PowerStation: true,
        MeetingRoom: true,
        Office: true,
        Dormitory: true,
      },
      DroneUsage: 'Trading Station',
      MoodLimit: 5,
    },
    mall: {
      enable: true,
    },
    recruitment: {
      NormalTagRefreshing: true,
      UseExpeditedPlan: false,
      MaximumNumberOfRecruitments: 4,
      recognitions: {
        '3 Stars': true,
        '4 Stars': true,
        '5 Stars': true,
      },
    },
    report: {},
    update: {
      enable: true,
    },
  },
};

export default defaults;
