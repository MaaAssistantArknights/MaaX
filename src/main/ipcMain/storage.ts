import { ipcMain } from 'electron';
import storage from '../../common/storage';

ipcMain.on('electron-store-get', async (event, key) => {
  event.returnValue = storage.get(key);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  storage.set(key, val);
});
ipcMain.on('electron-store-has', async (event, key) => {
  event.returnValue = storage.has(key);
});
