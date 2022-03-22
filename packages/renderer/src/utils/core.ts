import { maa } from "@/api";
import _ from "lodash";
import downloader from "@/hooks/caller/download";
import asst from "@/hooks/caller/asst";
import version from "@/hooks/caller/version";

export async function checkCoreVersion() {
  const success = await asst.load();
  const coreVersion = await version.core();
  if (success && coreVersion) {
    return true;
  } else {
    return false;
  }
}

export async function installCore(currentVersion: string | undefined = undefined) {
  const message = window.$message.loading("开始下载Maa Core", { duration: 0 });
  const os = {
    arch: await window.ipcRenderer.invoke("os:arch") as Api.Maa.Arch,
    platform: await window.ipcRenderer.invoke("os:platform") as Api.Maa.Platform
  };
  const available = await maa.component.getInfo("MaaCore");
  if (_.isError(available)) {
    message.type = "error";
    message.content = "服务器睡着惹(￣o￣) . z Z，待会再试试吧";
    setTimeout(() => {
      message.destroy();
    }, 5000);
    return;
  }
  const supportedVersions = 
    available.versions.filter(v => 
      v.support.findIndex(system => 
        system.arch === os.arch && system.platform === os.platform
      ) !== -1
    );
  if (supportedVersions.length === 0) {
    message.type = "error";
    message.content = "还不支持这个系统哦，再等等吧 (´Д｀ )";
    setTimeout(() => {
      message.destroy();
    }, 5000);
    return;
  }
  const getPackageInfo = async () => {
    if (currentVersion) {
      return await maa.download.getDiffPackage(os.platform, os.arch, currentVersion, supportedVersions[0].version, "MaaCore");
    } else {
      return await maa.download.getCompletePackage(os.platform, os.arch, supportedVersions[0].version, "MaaCore");
    }
  };
  const package_info = await getPackageInfo();
  if (_.isError(package_info)) {
    message.type = "error";
    message.content = "服务器睡着惹(￣o￣) . z Z，待会再试试";
    setTimeout(() => {
      message.destroy();
    }, 5000);
    return;
  }
  const temp_dir = await window.ipcRenderer.invoke("path:app", "temp");
  const core_dir = await window.ipcRenderer.invoke("path:asst");
  downloader.newDownloadFile({
    url: package_info.url,
    path: temp_dir,
  });
  window.ipcRenderer.on("download:itemUpdate", (_, item) => {
    message.content = `MaaCore下载中 ${Math.ceil(item.progress * 100)}%`;
  });
  window.ipcRenderer.on("download:itemDone", (_, item) => {
    message.content = "MaaCore解压中...";
    asst.dispose();
    window.ipcRenderer.send("unzip:file", item.path, core_dir);
  });
  window.ipcRenderer.once("unzip:done", async (event) => {
    const success = await asst.load();
    if (success) {
      message.content = `MaaCore ${version.core()}安装完成`;
      message.type = "success";
      setTimeout(() => {
        message.destroy();
      }, 5000);
    } else {
      message.content = "版本好像不匹配哦";
      message.type = "error";
      setTimeout(() => {
        message.destroy();
      }, 5000);
    }
  });
}

