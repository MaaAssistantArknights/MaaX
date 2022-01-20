/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { is } from 'electron-util';
import type { Type as InfrastructureType } from 'main/storage/configuration/infrastructure';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import storage from './storage';

import interfaceTest from './interface/sample';
import bluestackPort from './interface/bluestack';
import { Assistant, voidPointer, cb } from './interface';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function reply(event: Electron.IpcMainEvent, msg: string) {
  event.sender.send('asynchronous-reply', msg);
}

let mainWindow: BrowserWindow | null = null;
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const Asst = Assistant.getInstance(RESOURCES_PATH);

ipcMain.on('linkstart', async (event, arg) => {
  const port = bluestackPort(
    storage?.get('configuration').connection[
      'Filepath of bluestack.conf'
    ] as string
  );
  Asst.CreateEx(cb, voidPointer());
  let catchRet = false;
  if (port) {
    storage?.set('configuration.connection.address', `127.0.0.1:${port}`);
    const adr = storage?.get('configuration.connection.address') as string;
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

ipcMain.on('appendTasks', async (event, arg) => {
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
          const order = infra.enable as Record<string, boolean>;
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

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // 初始化storage
    // storage本身自带错误处理
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    storage;
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    console.log = log.log;
    console.error = log.error;

    log.transports.file.resolvePath = () =>
      path.join(app.getPath('userData'), 'main.log');
    log.transports.file.level = is.development ? 'verbose' : 'info';
    // interfaceTest();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
