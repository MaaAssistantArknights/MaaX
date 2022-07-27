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
