import axios from 'axios'

const baseUrl = 'https://prts.wiki/rest.php/v1/file/File:'

export async function getOperatorAvatar (operatorCode: string): Promise<string> {
  const filename = `头像_${operatorCode}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getOperatorHalfImage (operatorCode: string): Promise<string> {
  const filename = `半身像_${operatorCode}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getOperatorFullImage (operatorCode: string): Promise<string> {
  const filename = `立绘_${operatorCode}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getSkillImage (skillName: string): Promise<string> {
  const filename = `技能_${skillName}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getItemBorderedImage (itemName: string): Promise<string> {
  const filename = `道具_带框_${itemName}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getActivityImage (activityName: string): Promise<string> {
  const filename = `活动名称_${activityName}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}

export async function getMainlineImage (mainlineName: string): Promise<string> {
  const filename = `章节名称_${mainlineName}.png`
  const url = new URL(`${baseUrl}${filename}`)
  const response = await axios.get(url.href)
  if (response.status === 200 && response.data.preferred) {
    return `http:${response.data.preferred.url as string}`
  }
  return ''
}
