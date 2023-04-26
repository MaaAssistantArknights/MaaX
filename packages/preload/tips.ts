import _ from 'lodash'

const tips = [
  '你知道吗? MAA 是 MAA Assistant Arknights 的简称',
  '牛牛喝酒!',
  '冷知识: 慕斯有两条尾巴',
]

export function getTip() {
  return _.shuffle(tips)[0]
}
