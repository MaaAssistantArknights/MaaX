/* eslint-disable import/no-duplicates */
import { zhCN as NZhCN, dateZhCN as NDateZhCN } from 'naive-ui'
import { enUS as NEnUS, dateEnUS as NDateEnUS } from 'naive-ui'
import { createI18n } from 'vue-i18n'

import ZhCN from './zhCN.json'
import EnUS from './enUS.json'

export const naiveUiLocale = {
  NZhCN,
  NDateZhCN,
  NEnUS,
  NDateEnUS
}

export const appLocale = {
  ZhCN,
  EnUS
}

export const i18n = createI18n({
  legacy: false, // must set to `false`
  locale: 'EnUS',
  messages: appLocale
})

export const showBoolean = (value: boolean, option: BooleanDisplayOption = 'Yes/No'): string => {
  switch (option) {
    case 'Right/Wrong':
      return value ? i18n.global.t('Common.Boolean.Right') : i18n.global.t('Common.Boolean.Wrong')
    case 'Yes/No':
      return value ? i18n.global.t('Common.Boolean.Yes') : i18n.global.t('Common.Boolean.No')
  }
}
