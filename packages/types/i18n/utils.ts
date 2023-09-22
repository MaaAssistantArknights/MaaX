import type { NestedPath } from '@type/utils'

import ZhCN from '../../renderer/src/i18n/zhCN.json'

/**
 * I18n 键名集合，用于优化编码体验
 */
export type I18nKey = NestedPath<typeof ZhCN>
