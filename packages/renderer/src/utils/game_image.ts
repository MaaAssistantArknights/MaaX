import { MD5 } from 'crypto-js'

const baseUrl = 'https://prts.wiki/images'

const getFileUrl = (filename: string): string => {
  const hash = String(MD5(filename))
  return `${baseUrl}/${hash[0]}/${hash.substring(0, 2)}/${filename}`
}

export const getOperatorAvatar = (operatorCode: string): string =>
  getFileUrl(`头像_${operatorCode}.png`)

export const getOperatorHalfImage = (operatorCode: string): string =>
  getFileUrl(`半身像_${operatorCode}.png`)

export const getOperatorFullImage = (operatorCode: string): string =>
  getFileUrl(`立绘_${operatorCode}.png`)

export const getSkillImage = (skillName: string): string =>
  getFileUrl(`技能_${skillName}.png`)

export const getItemBorderedImage = (itemName: string): string =>
  getFileUrl(`道具_带框_${itemName}.png`)

export const getActivityImage = (activityName: string): string =>
  getFileUrl(`活动名称_${activityName}.png`)

export const getMainlineImage = (mainlineName: string): string =>
  getFileUrl(`章节名称_${mainlineName}.png`)

export const getProfessionImage = (
  professionName: string,
  isWhite = false
): string =>
  getFileUrl(`图标_职业_${professionName}_大图${isWhite ? '_白' : ''}.png`)
