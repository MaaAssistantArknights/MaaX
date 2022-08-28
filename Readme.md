# MeoAsstElectronUI

![Build Status](https://github.com/MaaAssistantArknights/MeoAsstElectronUI/workflows/Build%2FRelease/badge.svg) ![platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-blueviolet) ![license](https://img.shields.io/github/license/MaaAssistantArknights/MeoAsstElectronUI) ![commit](https://img.shields.io/github/commit-activity/m/MaaAssistantArknights/MeoAsstElectronUI?color=%23ff69b4)

## UI特点

* **Windows**,**Mac**和**linux**都可以用（一个不落，我全都要
* 使用了**全新**的设计语言（好看就完事辣
* 适配系统的**浅色/深色模式**（熬夜党狂喜
* 活动更新再也不用**重启app**了（好耶↖(^ω^)↗
* 全新的**掉落物**显示（妈妈再也不用担心我看不懂日志了
* 任务现在带有**进度条**和**时间**显示（他卡了吗，戳戳 !?(･_･;?
* 任务配置被丢到了**任务卡片**里面，而且**可展开/收起**（辣么多设置，我眼花了，我不看了
* 一个设备对应**一组**任务配置，保存在app中（继续刷1-7

## 截图



## 下载链接

***注：正式版还未发布，以下列出的链接暂时无效***

[Windows](https://github.com/MaaAssistantArknights/MeoAsstElectronUI/releases/latest/download/MeoAssistantArknights-win-x64-2.0.0.exe)

[Linux](https://github.com/MaaAssistantArknights/MeoAsstElectronUI/releases/latest/download/MeoAssistantArknights-linux-x64-2.0.0.zip)

[macOS](https://github.com/MaaAssistantArknights/MeoAsstElectronUI/releases/latest/download/MeoAssistantArknights-mac-x64-2.0.0.zip)

## 致谢

### npm包及开源库

* boilerplate from [electron-vue-vite](https://github.com/caoxiemeihao/electron-vue-vite)
* 可拖拽组件：[Sortable.Js](https://www.npmjs.com/package/sortablejs)
* API访问：[axios](https://www.npmjs.com/package/axios)
* App框架：[Electron](https://www.electronjs.org/)
* 工具函数：[lodash](https://lodash.com/)
* UI组件：[naive-ui](https://www.naiveui.com/)

## 开发相关

### 调试（以VS Code为例）

* 依赖安装
  1. 打开终端输入`yarn`或`yarn install`

* 调试main进程：
  1. <kbd>Ctrl</kbd>/<kbd>Command</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>呼出命令面板
  2. 输入Debug，找到“Debug: Toggle Auto Attach”（切换自动附加）
  3. 选择“Only with flag”（仅带有标志）
  4. 重启终端，输入`yarn dev`

* 调试renderer
  1. 按照上述步骤启动即可，会帮你打开Chrome Devtools，且带有最新的Vue Dev插件

### 开发者群

QQ 群：655031753