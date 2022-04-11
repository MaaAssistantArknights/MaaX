import { defineStore } from 'pinia'

interface AppearanceSetting {
  bgDifferenceWithTheme: boolean
  backgroundImage: string | null
  darkBackgroundImage: string | null
}
export interface SettingState {
  reportId: string
  version: {
    core: {
      current?: string
      latest?: string
    }
    ui: {
      current: string
      latest?: string
    }
  }
  appearance: AppearanceSetting
}

export interface SettingAction {
  checkUpdate: () => void
  setReportId: (reportId: string) => void
  setAppearance: (appearance: AppearanceSetting) => void
}

const useSettingStore = defineStore<'setting', SettingState, {}, SettingAction>(
  'setting',
  {
    state: () => {
      return {
        reportId: '',
        version: {
          core: {
            // current: "v3.0.6",
            // latest: "v3.0.7",
          },
          ui: {
            current: 'v1.0.0'
            // latest: "v1.0.0",
          }
        },
        appearance: {
          bgDifferenceWithTheme: false,
          backgroundImage: null,
          darkBackgroundImage: null
        }
      }
    },
    actions: {
      checkUpdate () {},
      setReportId (reportId) {
        this.reportId = reportId
      },
      setAppearance (appearance) {
        this.appearance = appearance
      }
    }
  }
)

export default useSettingStore
