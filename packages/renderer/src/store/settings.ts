import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'

export enum Locale {
  zhCN = 'ZhCN',
  enUS = 'EnUS',
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
  locale: Locale
}

export interface SettingAction {
  checkUpdate: () => void
  setReportId: (reportId: string) => void
  changeLocale: (locale: Locale) => void
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
        locale: Locale.zhCN
      }
    },
    actions: {
      checkUpdate () {},
      setReportId (reportId) {
        this.reportId = reportId
      },
      changeLocale (locale: Locale) {
        this.locale = locale
        const i18n = useI18n()
        i18n.locale.value = locale
      }
    }
  }
)

export default useSettingStore
