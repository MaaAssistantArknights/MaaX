import path from "path";
import fs from "fs";
import { app } from "electron";
import _ from "lodash";
import logger from "../utils/logger";
// import { Observable } from "object-observer";

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
  constructor(option?: StorageOption<T>) {
    this.m_storage = option?.defaults || Object.create({});
    this.m_cwd = option?.cwd || app.getPath("userData");
    this.m_ext = convertExt(option?.ext) || ".json";
    this.m_name = option?.name || "config";
    this.m_serialize =
      option?.serialize || ((value: T) => JSON.stringify(value, null, "  "));
    this.m_deserialize = option?.deserialize || JSON.parse;

    if (!fs.existsSync(this.m_cwd)) {
      fs.mkdirSync(this.m_cwd);
    }

    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, "{}");
    } else {
      this.readFromFile();
    }

    // this.m_watcher = fs.watch(this.filepath, (eventType) => {
    //   if (eventType === "change") {
    //     console.log("config file changed");
    //     this.readFromFile();
    //   }
    // });

    // this.m_observer = Observable.from(this.m_storage);
    // Observable.observe(this.m_observer, )
  }

  get(key: string) {
    return _.get(this.m_storage, key);
  }

  set(key: string, value: unknown) {
    _.set(this.m_storage, key, value);
    this.saveToFile();
  }

  has(key: string) {
    return _.has(this.m_storage, key);
  }

  public get filepath(): string {
    return path.join(this.m_cwd, this.m_name + this.m_ext);
  }

  private saveToFile = _.debounce(() => {
    fs.writeFileSync(this.filepath, this.m_serialize(this.m_storage));
  }, 200);

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

  // private m_timer: number | null = null;
  // private m_watcher: fs.FSWatcher;
  // private m_observer;
}

export default Storage;
