import { defineStore } from "pinia"

export interface SettingState {
  reportId: string
  version: {
    core: {
      current: string
      latest: string
    }
    ui: {
      current: string
      latest: string
    }
  }
}

export interface SettingAction {
  checkUpdate(): void
  setReportId(reportId: string): void
}

const useSettingStore = defineStore<"setting", SettingState, {}, SettingAction>(
  "setting",
  {
    state: () => {
      return {
        reportId: "",
        version: {
          core: {
            current: "v3.0.1",
            latest: "v3.0.2",
          },
          ui: {
            current: "v1.0.0",
            latest: "v1.0.0",
          },
        },
      }
    },
    actions: {
      checkUpdate() {},
      setReportId(reportId) {
        this.reportId = reportId
      },
    },
  }
);

export default useSettingStore
