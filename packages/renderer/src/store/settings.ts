import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import version from '@/hooks/caller/version'

export enum Locale {
  zhCN = 'ZhCN',
  enUS = 'EnUS',
}

export interface SettingState {
  penguinReportId: string
  yituliuReportId: string
  version: {
    core: {
      current?: string
      latest?: string
    }
    ui: {
      current?: string
      latest?: string
    }
  }
  locale: Locale
}

export interface SettingAction {
  checkUpdate: () => void
  setPenguinReportId: (reportId: string) => void
  setYituliuReportId: (reportId: string) => void
  changeLocale: (locale: Locale) => void
  updateVersionInfo: () => void
}

const useSettingStore = defineStore<'setting', SettingState, {}, SettingAction>(
  'setting',
  {
    state: () => {
      return {
        penguinReportId: '',
        yituliuReportId: '',
        version: {
          core: {},
          ui: {}
        },
        locale: Locale.zhCN
      }
    },
    actions: {
      checkUpdate () { },
      setPenguinReportId (reportId) {
        this.penguinReportId = reportId
      },
      setYituliuReportId (reportId) {
        this.yituliuReportId = reportId
      },
      changeLocale (locale: Locale) {
        this.locale = locale
        const i18n = useI18n()
        i18n.locale.value = locale
      },
      async updateVersionInfo () {
        this.version.core.current = await version.core() ?? undefined
        this.version.ui.current = await version.ui()
      }
    }
  }
)

export default useSettingStore
