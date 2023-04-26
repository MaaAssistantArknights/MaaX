import type { Operator } from './types'

export default {
  async getAllStages () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/stage_table.json')).default
  },
  async getAllActivities () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/activity_table.json')).default
  },
  async getAllItems () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/item_table.json')).default
  },
  async getAllOperators () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/character_table.json')).default as Promise<Record<string, Operator>>
  },
  async getAllSkills () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/skill_table.json')).default
  },
  async getAllZones () {
    return (await import('@common/ArknightsGameData/zh_CN/gamedata/excel/zone_table.json')).default
  }
}
