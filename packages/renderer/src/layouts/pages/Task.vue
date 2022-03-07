<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { NSpace, NButton, NSwitch, NIcon, NTooltip } from 'naive-ui';
import _ from 'lodash';
import Sortable from 'sortablejs';
import TaskCard from '@/components/TaskCard.vue';
import IconList from '@/assets/icons/list.svg?component';
import IconGrid from '@/assets/icons/grid.svg?component';
import Configuration from '@/components/configurations/Index.vue';

import useTaskStore from '@/store/tasks';

import router from '@/router';

const taskStore = useTaskStore();

const isGrid = ref<boolean>(false);
const cardsRef: Ref<HTMLElement | null> = ref(null);

const uuid = router.currentRoute.value.params.uuid as string;
const tasks = taskStore.deviceTasks[uuid];

onMounted(() => {
  if (cardsRef.value) {
    new Sortable(cardsRef.value, {
      swapThreshold: 1,
      animation: 150,
      filter: '.undraggable',
      store: {
        get() {
          return tasks.map(task => task.id);
        },
        set(sortable) {
          const sort = sortable.toArray();
          taskStore.updateTask(
            uuid,
            _.sortBy(tasks, task => sort.findIndex(v => v === task.id))
          );
        }
      },
      onMove: (event) => {
        if (event.related.classList.contains('undraggable')) {
          return false;
        }
      },
    });
  }
});

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
        v-for="(task) in tasks"
        :key="task.id"
        :task-info="task"
        @update:enable="enabled => task.enable = enabled"
        :data-id="task.id"
      >
        <Configuration :taskId="task.id" />
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