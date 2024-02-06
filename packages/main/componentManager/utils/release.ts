import logger from '@main/utils/logger'
import type { ComponentType } from '@type/componentManager'
import axios, { type AxiosResponse } from 'axios'

import type { ReleaseObject } from '../types'
import { getProxy } from './proxy'

const MaxRetryTimes = 3

async function tryRequest(url: string, component: ComponentType, retryCount = MaxRetryTimes) {
  const proxy = await getProxy()
  for (let i = 0; i < retryCount; i++) {
    try {
      const response = await axios.get(url, {
        // adapter: require('axios/lib/adapters/http.js'),
        proxy,
      })
      return response
    } catch (error) {
      const errorText = `${error.code} | ${error.response?.status ?? ''} ${
        error.response?.statusText ?? ''
      }`
      logger.error(
        `[Component Installer | ${component}] Error request on URL: ${url}, attempts: ${
          i + 1
        }/${retryCount},  Error: ${errorText}\n${error.stack}`
      )
    }
  }
  return null
}

export function createGetRelease(urls: string[], component: ComponentType) {
  let cache: {
    data: ReleaseObject
    updated: number
  } | null = null

  return async () => {
    if (cache && Date.now() - cache.updated < 5 * 60 * 1000) {
      return cache.data
    }

    for (const url of urls) {
      const result = await tryRequest(url, component) as AxiosResponse<ReleaseObject[] | null>
      // 由于资源链接变更，需要 merge 资源链接里所有的 assets 数组来查找到可用的最新下载源
      const assets = result?.data?.reduce((prev, curr) => prev.concat(curr?.assets ?? []), [] as ReleaseObject['assets'])
      if (result) {
        cache = {
          data: {
            assets: assets!,
            tag_name: result?.data?.[0].tag_name!,
            published_at: result?.data?.[0].published_at!,
          },
          updated: Date.now(),
        }
      }
      break
    }

    return cache?.data
  }
}

export function createFixedGetRelease(
  url: string | null,
  name: string,
  version = 'latest',
  date = ''
): () => Promise<ReleaseObject> {
  if (url) {
    return async () => {
      return {
        tag_name: version,
        published_at: date,
        assets: [
          {
            name,
            browser_download_url: url,
          },
        ],
      }
    }
  } else {
    return async () => {
      return {
        tag_name: version,
        published_at: date,
        assets: [], // no assets
      }
    }
  }
}
