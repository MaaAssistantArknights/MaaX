<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NSpace, NButton, NSwitch, NIcon, NTooltip } from 'naive-ui';
import Sortable from 'sortablejs';
import TaskCard from '@/components/TaskCard.vue';
import IconList from '@/assets/icons/list.svg?component';
import IconGrid from '@/assets/icons/grid.svg?component';

import useTaskStore from '@/store/tasks';

const taskStore = useTaskStore();

const isGrid = ref<boolean>(false);
const cardsRef: Ref<HTMLElement | null> = ref(null);
onMounted(() => {
  if (cardsRef.value) {
    new Sortable(cardsRef.value, {
      swapThreshold: 1,
      animation: 150,
      filter: '.undraggable',
      onMove: (event) => {
        if (event.related.classList.contains('undraggable')) {
          return false;
        }
      }
    });
  }
})

// Demo only
const demoDeviceUuid = '12345678-90abcdefg';
const tasksDemo = taskStore.deviceTasks[demoDeviceUuid];

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
    <div class="cards" :class="isGrid ? 'cards-grid' : ''" ref="cardsRef">
      <TaskCard
        :is-collapsed="!isGrid"
        v-for="(task, index) in tasksDemo"
        :key="index"
        :task-info="task"
      >
        <!-- Demo only -->
        <!-- 200px使其可滚动 -->
        <div style="height: 200px;">{{ task.title }}</div>
      </TaskCard>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cards {
  padding: 4px;
  text-align: center;
  line-height: 1;
  & :deep(.task-card) {
    margin-bottom: 8px;
  }
  &.cards-grid :deep(.task-card) {
    display: inline-block;
    width: 48%;
    margin: min(1%, 10px);
  }
  &.cards-grid :deep(.task-card:nth-child(odd)) {
    float: left;
  }

  &.cards-grid :deep(.task-card:nth-child(even)) {
    float: right;
  }
}
</style>