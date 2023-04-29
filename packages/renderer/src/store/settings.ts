import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import version from '@/hooks/caller/version'
import { TouchMode } from '@type/misc'
import type { CoreResourceType } from '@type/ipc'

export enum Locale {
  zhCN = 'ZhCN',
  enUS = 'EnUS',
}

export interface SettingState {
  report_to_penguin: boolean
  penguinReportId: string
  yituliuReportId: string
  clientType: CoreResourceType
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
  _locale: Locale
  monsters: boolean
  touchMode: TouchMode
  hintCoreNotInstalled: boolean
}

export interface SettingAction {
  checkUpdate: () => void
  setPenguinReportId: (reportId: string) => void
  setYituliuReportId: (reportId: string) => void
  changeLocale: (locale: Locale) => void
  changeClientType: (type: CoreResourceType) => void
  updateVersionInfo: () => Promise<void>
  toggleMonsters: () => void
  setTouchMode: (mode: TouchMode) => void
  dontShowCoreNotInstalled: () => void
  changeReportToPenguin(checked: boolean): void
}

export interface SettingGetters {
  [K: string]: any
  locale: (state: SettingState) => Locale
}

const useSettingStore = defineStore<'setting', SettingState, SettingGetters, SettingAction>(
  'setting',
  {
    state: () => {
      return {
        report_to_penguin: true,
        penguinReportId: '',
        yituliuReportId: '',
        clientType: 'CN',
        version: {
          core: {},
          ui: {},
        },
        _locale: Locale.zhCN,
        monsters: false,
        touchMode: TouchMode.minitouch,
        hintCoreNotInstalled: true,
      }
    },
    getters: {
      locale(state) {
        if (state.monsters) {
          return Locale.enUS
        }
        return state._locale
      },
    },
    actions: {
      checkUpdate() {},
      setPenguinReportId(reportId) {
        this.penguinReportId = reportId
      },
      setYituliuReportId(reportId) {
        this.yituliuReportId = reportId
      },
      changeLocale(locale: Locale) {
        if (this.monsters) {
          this.toggleMonsters()
        }
        this._locale = locale
        const i18n = useI18n()
        i18n.locale.value = this.locale
      },
      async updateVersionInfo() {
        this.version.core.current = (await version.core()) ?? undefined
        this.version.ui.current = await version.ui()
      },
      toggleMonsters() {
        this.monsters = !this.monsters
        if (this.monsters) {
          document.body.className = 'monster'
        } else {
          document.body.className = ''
        }
        const i18n = useI18n()
        i18n.locale.value = this.locale
      },
      setTouchMode(mode: TouchMode) {
        this.touchMode = mode
      },
      dontShowCoreNotInstalled() {
        this.hintCoreNotInstalled = false
      },
      changeClientType(type: CoreResourceType) {
        this.clientType = type
      },
      changeReportToPenguin(checked: boolean) {
        this.report_to_penguin = checked
      }
    },
  }
)

export default useSettingStore
