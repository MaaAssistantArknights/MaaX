import {
  app,
  BrowserWindow,
  session,
  dialog,
  WebContents,
  DownloadItem,
  ipcMain,
} from "electron";

import {
  IDownloadFile,
  INewDownloadFile,
} from "./@types";
import {
  getFileExt,
  getFileName,
  isExistFile,
  openFile,
  openFileInFolder,
  pathJoin,
  removeFile,
  renameFile
} from "./util";

import {
  addDownloadItem,
  deleteSourceItem,
  download,
  getDownloadBytes,
  getDownloadData,
  getDownloadItem,
  isExistItem,
  setTaskbar,
  updateDownloadItem,
} from "./helper";

import path from "path";

let win: BrowserWindow | null;
let newDownloadItem: INewDownloadFile | null;
let downloadItemData: IDownloadFile[] = [];
let downloadCompletedIds: string[] = []; // 下载完成的 id
const tempDownloadItemIds: string[] = []; // 下载中的 id

/**
 * 监听下载
 * @param event - electron 事件
 * @param item - 下载项
 * @param webContents - webContents
 */
export const listenerDownload = async (
  event: Event,
  item: DownloadItem,
  webContents: WebContents
): Promise<void> => {
  // 新建下载为空时，会执行 electron 默认的下载处理
  if (!newDownloadItem) return;

  let prevReceivedBytes = 0; // 记录上一次下载的字节数据
  // 添加下载项
  const downloadItem: IDownloadFile = await addDownloadItem({
    item,
    downloadIds: tempDownloadItemIds,
    data: downloadItemData,
    newDownloadItem,
  });

  setTaskbar(downloadItemData, downloadCompletedIds, -1, win);

  // 新下载任务创建完成，渲染进程监听该事件，添加到下载管理器列表
  webContents.send("download:itemNew", { ...downloadItem, _sourceItem: null });

  // 更新下载
  item.on("updated", (e, state) => {
    const receivedBytes = updateDownloadItem({
      item,
      downloadItem,
      data: downloadItemData,
      prevReceivedBytes,
      state,
    });
    prevReceivedBytes = receivedBytes;

    // 获取所有下载中的接受字节和总字节数据
    const bytes = getDownloadBytes(downloadItemData);
    // 更新任务栏进度
    win?.setProgressBar(bytes.receivedBytes / bytes.totalBytes);
    // 通知渲染进程，更新下载状态
    webContents.send("download:itemUpdate", {
      ...downloadItem,
      _sourceItem: null,
    });
  });

  // 下载完成
  item.on("done", (e, state) => {
    downloadItem.state = state;
    downloadItem.receivedBytes = item.getReceivedBytes();

    if (state !== "cancelled") {
      downloadCompletedIds.push(downloadItem.id);
    } else {
      removeFile(downloadItem.path);
    }

    setTaskbar(downloadItemData, downloadCompletedIds, 0, win);
    // 下载成功
    if (state === "completed") {
      let saveFilePath = downloadItem.path;
      if (saveFilePath.endsWith(".download"))
        saveFilePath = saveFilePath.substr(0, downloadItem.path.length - 9);
      let index = 0;
      const ext = getFileExt(saveFilePath);
      let fileNameWithoutExt = path.basename(saveFilePath, ext);
      const arr = fileNameWithoutExt.match(/\(\d+\)$/g);
      if (arr) fileNameWithoutExt = fileNameWithoutExt.substr(0, fileNameWithoutExt.length - 3).trim();
      const p = path.dirname(saveFilePath);
      while (isExistFile(saveFilePath)) {
        if (index !== 0) {
          saveFilePath = path.join(p, `${fileNameWithoutExt} (${index})${ext}`);
        }
        ++index;
      }
      downloadItem.fileName = path.basename(saveFilePath);
      renameFile(downloadItem.path, saveFilePath);
      downloadItem.path = saveFilePath;
      if (process.platform === "darwin")
        app.dock.downloadFinished(downloadItem.path);
    }

    // 通知渲染进程，更新下载状态
    webContents.send("download:itemDone", {
      ...downloadItem,
      _sourceItem: null,
    });
  });
};

/**
 * 处理下载数据
 */
const handleDownloadData = () => {

  downloadItemData.forEach((item) => {
    // 如果下载中或中断的，继续下载
    if (["progressing", "interrupted"].includes(item.state)) {
      newDownloadItem = {
        url: item.url,
        fileName: item.fileName,
        path: item.path,
      };
      item.paused = true;

      tempDownloadItemIds.push(item.id);
      download(item.url, win);
      return;
    }

    downloadCompletedIds.push(item.id);
  });
};

/**
 * 打开文件选择框
 * @param oldPath - 上一次打开的路径
 */
const openFileDialog = async (oldPath: string = app.getPath("downloads")) => {
  if (!win) return oldPath;

  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: "选择保存位置",
    properties: ["openDirectory", "createDirectory"],
    defaultPath: oldPath,
  });

  return !canceled ? filePaths[0] : oldPath;
};

/**
 * 重新下载
 * @param data - 下载项
 */
const retryDownloadFile = (data: IDownloadFile): boolean => {
  console.log(data.path);
  newDownloadItem = {
    fileName: data.fileName + ".download",
    path: data.path + ".download",
    url: data.url,
  };
  tempDownloadItemIds.push(data.id);
  download(data.url, win);

  return true;
};

/**
 * 下载文件
 * @param newItem - 新下载项
 */
const downloadFile = (newItem: INewDownloadFile) => {
  const { url, fileName, path: savePath } = newItem;
  const newFileName = getFileName(fileName ?? "", url); // 处理文件名

  // 处理保存路径
  const downloadPath = pathJoin(savePath, newFileName) + ".download";
  // 查找下载记录中是否存在历史下载
  const existItem = isExistItem(url, downloadItemData);
  newItem.fileName = newFileName;
  newItem.path = downloadPath;

  // 判断是否存在
  // if (isExistFile(downloadPath)) {
  //   const id = existItem?.id || "";
  //   return { id, ...newItem };
  // }

  if (existItem) {
    retryDownloadFile({ ...existItem, ...newItem });
    return null;
  }

  newDownloadItem = {
    url,
    fileName: newFileName,
    path: downloadPath,
  };
  download(url, win);
  return null;
};

/**
 * 暂停或恢复
 * @param item - 下载项
 */
const pauseOrResume = (item: IDownloadFile) => {
  const sourceItem = getDownloadItem(downloadItemData, item.id);
  if (!sourceItem) return item;

  if (item.paused) {
    sourceItem.resume();
  } else {
    sourceItem.pause();
  }

  item.paused = sourceItem.isPaused();
  return item;
};

/**
 * 移除下载项。下载中会取消下载
 * @param item - 下载项
 * @param index - 下载项的下标
 */
const removeDownloadItem = (item: IDownloadFile, index: number) => {
  const sourceItem = getDownloadItem(downloadItemData, item.id);

  downloadItemData.splice(index, 1);
  // 如果下载项的状态是下载中，需要取消
  if (item.state === "progressing") {
    sourceItem && sourceItem.cancel();
  }

  downloadCompletedIds = downloadCompletedIds.filter((id) => id !== item.id);
  return item;
};

/**
 * 清空已完成的下载项
 */
const clearDownloadDone = () => {
  downloadItemData = downloadItemData.filter(
    (item) => item.state === "progressing"
  );

  downloadCompletedIds = [];
  return deleteSourceItem(downloadItemData);
};

const getDownloadPath = () => {
  return app.getPath("downloads");
};

const getDownloadItemCount = () => {
  return downloadItemData.length;
};

// 添加主进程 ipc 调用事件
const listenerEvent = () => {
  // 获取下载数据
  ipcMain.handle("download:getDownloadData", (event) => {
    return deleteSourceItem(downloadItemData);
  });

  // 新建下载
  ipcMain.on("download:newDownloadFile", (event, data: INewDownloadFile) =>
    downloadFile(data)
  );

  // 重新下载
  ipcMain.on("download:retryDownloadFile", (event, data: IDownloadFile) =>
    retryDownloadFile(data)
  );

  // 选择保存位置对话框
  ipcMain.handle("download:openFileDialog", (event, oldPath?: string) =>
    openFileDialog(oldPath)
  );

  // 打开文件
  ipcMain.handle("download:openFile", (event, path: string) => openFile(path));

  // 打开文件所在路径
  ipcMain.handle("download:openFileInFolder", (event, path: string) =>
    openFileInFolder(path)
  );

  // 暂停或恢复下载
  ipcMain.on("download:pauseOrResume", (event, item: IDownloadFile) =>
    pauseOrResume(item)
  );

  // 清空已完成（非下载中的）的下载项
  ipcMain.handle("download:clearDownloadDone", () => clearDownloadDone());

  // 删除下载项
  ipcMain.handle(
    "download:removeDownloadItem",
    (event, item: IDownloadFile, index: number) =>
      removeDownloadItem(item, index)
  );
  // 获取下载文件夹路径
  ipcMain.handle("download:getDownloadPath", () => getDownloadPath());

  ipcMain.handle("download:getDownloadItemCount", () => getDownloadItemCount());
  // 调用 download 方法后，触发 will-download 事件
  session.defaultSession.on("will-download", listenerDownload);
};

export const registerDownloadService = (window: BrowserWindow | null): void => {
  win = window;
  listenerEvent();
  const onClose = () => {
    // 窗口关闭时，将下载中或中断的项暂停，并删除本地缓存
    downloadItemData.forEach((item) => {
      if (["progressing", "interrupted"].includes(item.state)) {
        item._sourceItem?.pause();
        item.paused = true;
        // removeFile(item.path)
      }
    });

    const data = deleteSourceItem(downloadItemData);

    // 清除全局数据
    downloadItemData = [];
    downloadCompletedIds = [];
    setTaskbar(downloadItemData, downloadCompletedIds, -1, win);
    win = null;
  };
  window?.on("close", (event) => {
    if (
      downloadItemData.filter(
        (item) => item.state === "progressing" || item.state === "interrupted"
      ).length > 0
    ) {
      const result = dialog.showMessageBoxSync({
        type: "info",
        title: "确定关闭?",
        message: "还有下载在进行，确定退出吗？",
        buttons: ["确定", "取消"],
      });
      if (result === 0) {
        onClose();
      } else {
        event.preventDefault();
      }
    }
  });
};
