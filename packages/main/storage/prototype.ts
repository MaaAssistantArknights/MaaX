import path from "path";
import fs from "fs";
import { app, shell } from "electron";
import _ from "lodash";
import logger from "../utils/logger";
import { Observable } from "object-observer";

type StorageOption<T> = Partial<{
  defaults: T;
  cwd: string;
  ext: string;
  name: string;
  serialize: (value: T) => string;
  deserialize: (raw: string) => T;
}>;

const convertExt = (str?: string) => (/\.\w+/.test(str || "") ? str : false);

class Storage<T extends Object> {
  constructor(option: StorageOption<T>) {
    this.m_storage = option.defaults || Object.create({});
    this.m_cwd = option.cwd || app.getPath("userData");
    this.m_ext = convertExt(option.ext) || ".json";
    this.m_name = option.name || "config";
    this.m_serialize =
      option.serialize || ((value: T) => JSON.stringify(value, null, "\t"));
    this.m_deserialize = option.deserialize || JSON.parse;

    this.m_watcher = fs.watch(this.filepath, (eventType) => {
      if (eventType === "change") {
        if (!this.m_updateBySelf) {
          this.readFromFile();
        }
        this.m_updateBySelf = false;
      }
    });
  }

  get(key: string) {}

  set(key: string, value: unknown) {}

  has(key: string) {}

  public get filepath(): string {
    return path.join(this.m_cwd, this.m_name + this.m_ext);
  }

  private saveToFile = _.debounce(() => {
    fs.writeFile(this.filepath, this.m_serialize(this.m_storage), (error) => {
      if (error) {
        logger.error("error while write config file:", this.filepath, error);
      } else {
        this.m_updateBySelf = true;
      }
    });
  }, 1000);

  private readFromFile = () => {
    fs.readFile(this.filepath, (error, data) => {
      if (error) {
        logger.error("error while read config file:", this.filepath, error);
      } else {
        this.m_storage = this.m_deserialize(data.toString());
      }
    });
  };

  private m_cwd: string;
  private m_name: string;
  private m_ext: string;
  private m_serialize;
  private m_deserialize;
  private m_storage: T;

  private m_timer: number | null = null;
  private m_watcher: fs.FSWatcher;
  private m_updateBySelf = false;
}

export default Storage;
