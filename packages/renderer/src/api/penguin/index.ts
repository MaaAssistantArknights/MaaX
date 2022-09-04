import type { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { backOff, IBackOffOptions } from 'exponential-backoff'
import useSettingStore from '@/store/settings'
import service from './service'

interface DropInfo {
  dropType: string
  itemId: string
  quantity: number
}

export interface DropReport {
  drops: DropInfo
  stageId: string
  server: string
}

const backOffOptions: Partial<IBackOffOptions> = {
  numOfAttempts: 5,
  timeMultiple: 2,
  jitter: 'full',
  maxDelay: 60 * 1000,
  startingDelay: 200,
  retry (response: AxiosResponse /* Error Response */) {
    if (response.status /* No Timeout */ &&
      Math.floor(response.status / 100) === 4 /* Client Error */) {
      return false
    }
    return true
  }
}

export async function postDrop (report: DropReport): Promise<AxiosResponse> {
  const settingStore = useSettingStore()
  const reportId = settingStore.reportId
  const _report = {
    ...report,
    source: 'MeoAssistant',
    version: settingStore.version.core.current
  }

  const headers: AxiosRequestHeaders =
    reportId ? { Authorization: `PenguinID ${reportId}` } : {}

  return await backOff(
    () => service.post<AxiosResponse>('/PenguinStats/api/v2/report', _report, { headers }),
    backOffOptions
  )
}
