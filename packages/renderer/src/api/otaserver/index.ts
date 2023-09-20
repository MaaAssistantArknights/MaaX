import logger from '@/hooks/caller/logger'
import { type ResourceType } from '@type/game'
import type { AxiosRequestHeaders, AxiosResponse } from 'axios'

import service from './service'

export async function getActivityStage(): Promise<AxiosResponse> {
  return await service.get<AxiosResponse>('/MaaAssistantArknights/api/gui/StageActivity.json')
}

export async function getLastUpdateTime(): Promise<AxiosResponse> {
  return await service.get<AxiosResponse>('/MaaAssistantArknights/api/lastUpdateTime.json')
}

const taskJsonUrl = {
  CN: '/MaaAssistantArknights/api/resource/tasks.json',
  YoStarEN: '/MaaAssistantArknights/api/resource/global/YoStarEN/resource/tasks.json',
  YoStarJP: '/MaaAssistantArknights/api/resource/global/YoStarJP/resource/tasks.json',
  YoStarKR: '/MaaAssistantArknights/api/resource/global/YoStarKR/resource/tasks.json',
  txwy: '/MaaAssistantArknights/api/resource/global/txwy/resource/tasks.json',
}

export async function getActivityTaskJson(type: ResourceType): Promise<AxiosResponse> {
  const url = taskJsonUrl[type]
  if (!url) {
    logger.error(`[getActivityTaskJson] invalid type ${type}`)
    throw new Error(`invalid type ${type}`)
  }
  return await service.get<AxiosResponse>(url)
}
