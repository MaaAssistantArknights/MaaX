import type { DownloadItem } from "electron";

export declare type DownloadItemState = "progressing" | "completed" | "cancelled" | "interrupted"

export declare type IPCEventName =
    | "openDownloadManager"
    | "getDownloadData"
    | "newDownloadFile"
    | "retryDownloadFile"
    | "openFileDialog"
    | "openFile"
    | "openFileInFolder"
    | "initDownloadItem"
    | "pauseOrResume"
    | "removeDownloadItem"
    | "clearDownloadDone"
    | "newDownloadItem"
    | "downloadItemUpdate"
    | "downloadItemDone"
    | "getDownloadPath"
    | "getDownloadItemCount"

export declare interface INewDownloadFile {
    url: string
    fileName?: string
    path: string
}

export declare interface IDownloadFile {
    id: string
    url: string
    fileName: string
    path: string
    state: DownloadItemState
    startTime: number
    speed: number
    progress: number
    totalBytes: number
    receivedBytes: number
    paused: boolean
    _sourceItem?: DownloadItem
}

export declare interface IDownloadBytes {
    receivedBytes: number
    totalBytes: number
}

export declare interface IPagination {
    pageIndex: number
    pageCount: number
}

export declare interface IAddDownloadItem {
    item: DownloadItem
    downloadIds: string[]
    data: IDownloadFile[]
    newDownloadItem: INewDownloadFile | null
}

export declare interface IUpdateDownloadItem {
    item: DownloadItem
    data: IDownloadFile[]
    downloadItem: IDownloadFile
    prevReceivedBytes: number
    state: DownloadItemState
}
