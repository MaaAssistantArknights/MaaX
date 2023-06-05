import CharTable from '@common/ArknightsGameData/zh_CN/gamedata/excel/character_table.json'
import SkillTable from '@common/ArknightsGameData/zh_CN/gamedata/excel/skill_table.json'

interface OperatorReq {
  elite?: 0 | 1 | 2
  level?: number
  skill_level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
  module?: 0 | 1 | 2
  potentiality?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export interface Operator {
  name: string
  skill?: 1 | 2 | 3
  skill_usage?: 0 | 1 | 2 | 3
  requirements?: OperatorReq
}

const CharId: Record<string, string> = {}

function getCharName(char: string) {
  if (char in CharId) {
    return CharId[char]
  } else {
    for (const [key, val] of Object.entries(CharTable)) {
      if (val.name === char) {
        CharId[char] = key
        return key
      }
    }
    CharId[char] = ''
    return ''
  }
}

export function getCharSkillCount(char: string): number {
  char = getCharName(char)
  if (char) {
    return (CharTable as any)[char].skills.length
  } else {
    return 0
  }
}

export function getCharSkillName(char: string, skill: 1 | 2 | 3): string {
  char = getCharName(char)
  if (char) {
    const skillId = (CharTable as any)[char].skills[skill - 1].skillId
    return (SkillTable as any)[skillId].levels[0].name
  } else {
    return ''
  }
}
