// 存一些从ota server上拉的东西, 比如活动关导航..
import { getActivityStage, getActivityTaskJson, getLastUpdateTime } from '@/api/otaserver'
import logger from '@/hooks/caller/logger'
import type { ResourceType } from '@type/game'
import type { StageActivity } from '@type/resource'
import { defineStore } from 'pinia'

export interface ResourceState {
  lastUpdate: number
  stageActivity: StageActivity
}

export interface ResourceAction {
  updateResource: () => Promise<void>
}

const updateTaskJson = async () => {
  const taskJsonList: ResourceType[] = ['CN', 'YoStarEN', 'YoStarJP', 'YoStarKR', 'txwy']
  for await (const type of taskJsonList) {
    try {
      const response = await getActivityTaskJson(type)
      if (response.status == 404) {
        continue
      }
      const data = JSON.stringify(response.data)
      await window.main.CoreLoader.updateTaskJson({
        type: type,
        data: data,
      })
    } catch (e) {
      logger.warn(`[UpdateResource] fail to update task json for client:${type}, error:${e}`)
    }
  }
}

const useResourceStore = defineStore<'resource', ResourceState, {}, ResourceAction>('resource', {
  state: () => ({
    lastUpdate: 0,
    stageActivity: {},
  }),
  actions: {
    async updateResource() {
      try {
        const lastUpdateResponse = await getLastUpdateTime()
        if (this.lastUpdate < lastUpdateResponse.data.timestamp) {
          await updateTaskJson()
          const stagesResponse = await getActivityStage()
          this.stageActivity = stagesResponse.data
          this.lastUpdate = lastUpdateResponse.data.timestamp
          logger.info('[UpdateResource] update resource successfully')
        }
      } catch (error) {
        logger.error(`[UpdateResource] fail to update resource ${error}`)
      }
    },
  },
})

export default useResourceStore
