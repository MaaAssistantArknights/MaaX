<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NFormItem, NCheckbox, NForm } from 'naive-ui'
// import router from '@/router'
import _ from 'lodash'
import { getItemBorderedImage } from '@/utils/game_image'

import MallSelect from '../MallSelect.vue'

const showModal = ref(false)

const mallItems = {
  龙门币: '4001',
  家具零件: '3401',
  招聘许可: '7001',
  加急许可: '7002',
  赤金: '3003',
  基础作战记录: '2001',
  初级作战记录: '2002',
  技巧概要·卷1: '3301',
  技巧概要·卷2: '3302',
  碳: '3112',
  碳素: '3113',
  源岩: '30011',
  代糖: '30021',
  酯原料: '30031',
  异铁碎片: '30041',
  双酮: '30051',
  破损装置: '30061',
  固源岩: '30012',
  糖: '30022',
  聚酸酯: '30032',
  异铁: '30042',
  酮凝集: '30052',
  装置: '30062'
} as const

// type itemNameType = (typeof mallItems)[number]['items'][number]['name']
// type itemIdType = (typeof mallItems)[number]['items'][number]['itemid']

type itemNameType = keyof typeof mallItems

interface MallConfiguration {
  blacklist: itemNameType[],
  buy_first: itemNameType[],
  shopping: boolean
}
// const routeUuid = router.currentRoute.value.params.uuid as string

const props = defineProps<{
  configurations: MallConfiguration;
}>()

const buyFirst = ref()
const blackList = ref()
const otherItems = ref()

const loading = ref(false)

onMounted(async () => {
  loading.value = true
  buyFirst.value = []
  blackList.value = []
  otherItems.value = []

  props.configurations.buy_first.forEach((item) => {
    buyFirst.value.push(
      {
        name: item,
        item_id: mallItems[item],
        image: getItemBorderedImage(item)
      }
    )
  })

  props.configurations.blacklist.forEach((item) => {
    blackList.value.push(
      {
        name: item,
        item_id: mallItems[item],
        image: getItemBorderedImage(item)
      }
    )
  })

  Object.entries(mallItems).forEach(([name, itemid]) => {
    if (!props.configurations.buy_first.includes(name as itemNameType) && !props.configurations.blacklist.includes(name as itemNameType)) {
      otherItems.value.push(
        {
          name,
          item_id: itemid,
          image: getItemBorderedImage(name)
        }
      )
    }
  })
  loading.value = false
})

function onItemChange () {
  _.set(props.configurations, 'buy_first', buyFirst.value.map((item) => item.name))
  _.set(props.configurations, 'blacklist', blackList.value.map((item) => item.name))
}

</script>

<template>
  <NForm
    class="configuration-form"
    size="small"
    :show-feedback="false"
    :label-align="'left'"
    :label-placement="'left'"
    :label-width="'auto'"
  >
    <NFormItem label="自动购物">
      <NCheckbox
        :checked="props.configurations.shopping"
        @update:checked="
          (checked) =>
            _.set(props.configurations, 'shopping', checked)
        "
      />
    </NFormItem>

    <NFormItem :show-label="false">
      <NButton quaternary type="primary" @click="showModal = true" :focusable="false">管理购买选项...
      </NButton>
      <MallSelect v-model:show="showModal" :buy_first="buyFirst" :blacklist="blackList" :others="otherItems"
        @onChange:Item="onItemChange">
      </MallSelect>
    </NFormItem>
  </NForm>
</template>

<style lang="less" scoped>
.mall-configuration {
  text-align: left;
}

.item-group {
  display: flex;
  align-items: center;
}
</style>
