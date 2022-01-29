import { app } from 'electron';
import path from 'path';

import bluestackPort from '../interface/bluestack';
import { Assistant, voidPointer, cb } from '../interface';
import storage from '../storage';
import { ipcMainOn } from '../../common/ipc-main';

import type { Type as InfrastructureType } from '../storage/configuration/infrastructure';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../../assets');

const Asst = Assistant.getInstance(RESOURCES_PATH);

ipcMainOn('asst:linkstart', async (event, arg) => {
  const port = bluestackPort(
    storage?.get('configuration').connection[
      'Filepath of bluestack.conf'
    ] as string
  );
  Asst.CreateEx(cb, voidPointer());
  let catchRet = false;
  if (port) {
    storage.set('configuration.connection.address', `127.0.0.1:${port}`);
    const adr = storage.get('configuration.connection.address') as string;
    console.log(`try catchCustom() on ${adr}`);
    catchRet = Asst.CatchCustom(adr);
    console.log(
      catchRet
        ? 'connected to emulator'
        : 'connect custom address failed, try catchDefault()'
    );
  }
  if (!catchRet) {
    const ret = Asst.CatchDefault();
    console.log(ret ? 'connected to emulator' : 'connect failed');
  }
  event.returnValue = catchRet;
});

ipcMainOn('asst:appendTasks', async (event, arg) => {
  const tasks = storage?.get('task');
  tasks?.forEach((singleTask) => {
    if (!singleTask.enabled) {
      return;
    }
    switch (singleTask.value) {
      case 'awake':
        Asst.AppendStartUp();
        break;
      case 'clear sanity':
        // TODO 等关卡信息加入存储后再做
        // Asst.AppendFight();
        break;
      case 'auto recruits':
        {
          const recruit = storage?.get('configuration').recruitment;
          const maxTimes = recruit?.MaximumNumberOfRecruitments;
          // const selectLevel =
          // TODO 等star变成array
        }
        break;
      case 'shift scheduling':
        {
          const infraRecord: Record<string, string> = {
            ControlCenter: 'Control',
            Dormitory: 'Dorm',
            ManufacturingStation: 'Mfg',
            MeetingRoom: 'Reception',
            Office: 'Office',
            PowerStation: 'Power',
            TradingStation: 'Trade',
          };
          const droneUseRecord: Record<string, string> = {
            None: '_NotUse',
            LMD: 'Money',
            Orundum: 'SyntheticJade',
            'Battle Record': 'CombatRecord',
            'Pure Gold': 'PureGold',
            'Originium Shard': 'OriginStone',
            Chip: 'Chip',
          };
          const infra = storage?.get(
            'configuration.infrastructure'
          ) as InfrastructureType;
          const moodLimit = infra.MoodLimit;
          const order = infra.facilities;
          // TODO 基建
          // Asst.AppendInfrast()
        }
        break;
      case 'visit friends':
        Asst.AppendVisit();
        break;
      case 'shopping':
        {
          const buy = storage?.get('configuration').mall.enable as boolean;
          Asst.AppendMall(buy);
        }
        break;
      case 'receive rewards':
        Asst.AppendAward();
        break;
      default:
        break;
    }
  });
});
