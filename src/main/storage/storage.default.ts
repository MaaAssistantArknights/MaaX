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
  task: [
    {
      label: '开始唤醒',
      value: 'awake',
      enabled: true,
    },
    {
      label: '刷理智',
      value: 'clear sanity',
      enabled: true,
    },
    {
      label: '自动公招',
      value: 'auto recruits',
      enabled: true,
    },
    {
      label: '基建换班',
      value: 'shift scheduling',
      enabled: true,
    },
    {
      label: '访问好友',
      value: 'visit friends',
      enabled: true,
    },
    {
      label: '收取信用及购物',
      value: 'shopping',
      enabled: true,
    },
    {
      label: '领取日常奖励',
      value: 'receive rewards',
      enabled: true,
    },
  ],
};

export default defaults;
