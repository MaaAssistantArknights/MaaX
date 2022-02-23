<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NSpace, NButton, NSwitch, NIcon, NTooltip } from 'naive-ui';
import _ from 'lodash';
import Sortable from 'sortablejs';
import TaskCard from '@/components/TaskCard.vue';
import IconList from '@/assets/icons/list.svg?component';
import IconGrid from '@/assets/icons/grid.svg?component';

const isGrid = ref<boolean>(false);
const cards: Ref<any> = ref(null);
onMounted(() => {
  new Sortable(cards.value, {
    swapThreshold: 1,
    animation: 150,
    filter: '.undraggable',
    onMove: _.throttle((event) => {
      if (event.related.classList.contains('undraggable')) {
        return false;
      }
    }, 200)
  })
})
</script>

<template>
  <div>
    <NSpace justify="space-between" align="center">
      <h2>任务</h2>
      <NSpace align="center">
        <NTooltip class="detail-toggle-switch">
          <template #trigger>
            <NSwitch v-model:value="isGrid" size="large">
              <template #checked-icon>
                <NIcon size="16">
                  <IconGrid />
                </NIcon>
              </template>
              <template #unchecked-icon>
                <NIcon size="16">
                  <IconList />
                </NIcon>
              </template>
            </NSwitch>
          </template>
          <span>切换到{{ isGrid ? "简单" : "详细" }}信息</span>
        </NTooltip>

        <NButton type="primary" round>
          <span>开始</span>
        </NButton>
      </NSpace>
    </NSpace>
    <div class="cards" ref="cards">
      <TaskCard
        :is-collapsed="!isGrid"
        :info="{ title: '开始唤醒', status: 'processing', progress: 50, startTime: Date.now(), enable: true }"
      >
        <span>slot</span>
      </TaskCard>
      <TaskCard
        :is-collapsed="!isGrid"
        :info="{ title: '刷理智', status: 'idle', progress: 0, enable: true }"
      />
      <TaskCard
        :is-collapsed="!isGrid"
        :info="{ title: '自动公招', status: 'idle', progress: 0, enable: true }"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.cards {
  display: flex;
  flex-direction: column;
  padding: 4px;
}
</style>