<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NModal, NCard, NText, NDivider, NSpace } from 'naive-ui'
import useTaskStore from '@/store/tasks'
import router from '@/router'
import ItemCheck from '../ItemCheck.vue'

const taskStore = useTaskStore()

interface MallConfiguration {
  blacklist: Set<string>;
  buy_first: Set<string>;
}

const mallItems = [
  {
    title: '基础物资',
    items: [
      { name: '龙门币', itemid: '4001' },
      { name: '家具零件', itemid: '3401' },
      { name: '招聘许可', itemid: '7001' },
      { name: '加急许可', itemid: '7002' },
      { name: '赤金', itemid: '3003' }
    ]
  },
  {
    title: '养成物资',
    items: [
      { name: '基础作战记录', itemid: '2001' },
      { name: '初级作战记录', itemid: '2002' },
      { name: '技巧概要·卷1', itemid: '3301' },
      { name: '技巧概要·卷2', itemid: '3302' },
      { name: '碳', itemid: '3112' },
      { name: '碳素', itemid: '3113' }
    ]
  },
  {
    title: '白底材料',
    items: [
      { name: '源岩', itemid: '30011' },
      { name: '代糖', itemid: '30021' },
      { name: '酯原料', itemid: '30031' },
      { name: '异铁碎片', itemid: '30041' },
      { name: '双酮', itemid: '30051' },
      { name: '破损装置', itemid: '30061' }
    ]
  },
  {
    title: '绿底材料',
    items: [
      { name: '固源岩', itemid: '30012' },
      { name: '糖', itemid: '30022' },
      { name: '聚酸酯', itemid: '30032' },
      { name: '异铁', itemid: '30042' },
      { name: '酮凝集', itemid: '30052' },
      { name: '装置', itemid: '30062' }
    ]
  }

]

const routeUuid = router.currentRoute.value.params.uuid as string
const task = computed(() => taskStore.deviceTasks[routeUuid].find(task => task.id === 'mall'))
const configuration = task.value?.configurations as unknown as MallConfiguration

configuration.blacklist = new Set<string>()
configuration.buy_first = new Set<string>()

const showBlackListModal = ref(false)
const showBuyFirstModal = ref(false)

function handleBlackListItemCheckUpdate (item: string, checked: boolean) {
  if (checked) {
    configuration.blacklist.add(item)
  } else {
    configuration.blacklist.delete(item)
  }
}

function handleBuyFirstItemCheckUpdate (item: string, checked: boolean) {
  if (checked) {
    configuration.buy_first.add(item)
  } else {
    configuration.buy_first.delete(item)
  }
}
</script>

<template>
  <div class="configuration-form mall-configuration">
    <NButton quaternary type="primary" @click="showBlackListModal = true" :focusable="false">
      信用商店黑名单...</NButton>
    <NButton quaternary type="primary" @click="showBuyFirstModal = true" :focusable="false">
      信用商店优先购买...</NButton>
    <!-- 信用购买Modal -->
    <NModal v-model:show="showBlackListModal" title="信用商店黑名单" display-directive="show" role="dialog"
      aria-modal="true">
      <NCard style="width: 600px;" role="dialog" aria-modal="true" title="信用商店黑名单">
        <div v-for="(group, index) in mallItems" :key="index">
          <NDivider />
          <div class="item-group">
            <NText>{{ group.title }}</NText>
            <NSpace>
              <ItemCheck v-for="(item) in group.items" :key="item.name" :name="item.name"
                :itemid="item.itemid" :checked="configuration.blacklist.has(item.name)"
                @update:checked="(checked) => handleBlackListItemCheckUpdate(item.name, checked)" />
            </NSpace>
          </div>
        </div>
      </NCard>
    </NModal>
    <NModal v-model:show="showBuyFirstModal" title="信用商店优先购买" display-directive="show" role="dialog"
      aria-modal="true">
      <NCard style="width: 600px;" role="dialog" aria-modal="true" title="信用商店优先购买">
        <div v-for="(group, index) in mallItems" :key="index">
          <NDivider />
          <div class="item-group">
            <NText>{{ group.title }}</NText>
            <NSpace>
              <ItemCheck v-for="(item) in group.items" :key="item.name" :name="item.name"
                :itemid="item.itemid" :checked="configuration.buy_first.has(item.name)"
                @update:checked="(checked) => handleBuyFirstItemCheckUpdate(item.name, checked)" />
            </NSpace>
          </div>
        </div>
      </NCard>
    </NModal>
  </div>
</template>

<style lang="less" scoped>
.mall-configuration {
  text-align: left;
}

.item-group {
  display: flex;
  align-items: center;
}

.n-divider:not(.n-divider--vertical) {
  margin: 12px 0;
}
</style>
