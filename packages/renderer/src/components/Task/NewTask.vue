<script setup lang="ts">
import { NCollapse, NCollapseItem, NScrollbar, NSpace, useThemeVars, NDropdown } from 'naive-ui'
import { ref, nextTick } from 'vue'
import router from '@/router'
import useThemeStore from '@/store/theme'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import logger from '@/hooks/caller/logger'
import useTaskStore from '@/store/tasks'
import type { Task } from '@type/task'

const themeVars = useThemeVars()
const themeStore = useThemeStore()

const taskStore = useTaskStore()
const uuid = router.currentRoute.value.params.uuid as string

const props = defineProps<{
  isCollapsed: boolean
}>()

function handleSelectNewTask(key: Task['name']): void {
  if (taskStore.copyTaskFromTemplate(uuid, key)) {
    logger.info('copy task from template', key)
  }
}

const options: DropdownMixedOption[] = [
  {
    label: '模拟器任务',
    key: 'emulator_task',
    children: [
      {
        label: '启动模拟器',
        key: 'Emulator',
      },
      {
        label: '关机/关闭模拟器',
        key: 'Shutdown',
      },
    ],
  },
  {
    label: '游戏任务',
    key: 'game_task',
    children: [
      {
        label: '开始唤醒',
        key: 'StartUp',
      },
      {
        label: '代理作战',
        key: 'Fight',
      },
      {
        label: '基建换班',
        key: 'Infrast',
      },
      {
        label: '自动公招',
        key: 'Recruit',
      },
      {
        label: '信用购物',
        key: 'Mall',
      },
      {
        label: '领取日常',
        key: 'Award',
      },
      {
        label: '无限肉鸽',
        key: 'Roguelike',
      },
      // {
      //   label: '生息演算',
      //   key: 'ReclamationAlgorithm'
      // }
    ],
  },
  {
    label: '其他任务',
    key: 'other_task',
    children: [
      {
        label: '挂机',
        key: 'Idle',
      },
      {
        label: '每日一抽',
        key: 'null',
      },
    ],
  },
]

const showDropdown = ref(false)

const dropdownPosition = ref({
  x: 0,
  y: 0,
})

const handleShowDropdown = (e: MouseEvent) => {
  e.preventDefault()
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    dropdownPosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
  })
}
</script>

<template>
  <NCollapse :expanded-names="props.isCollapsed ? null : '1'" class="task-card">
    <template #arrow>
      <span />
    </template>
    <NCollapseItem
      class="task-card-inner"
      name="1"
      display-directive="show"
      :style="{
        border:
          themeStore.currentTheme === 'maa-dark'
            ? `1px dashed ${themeVars.primaryColor}`
            : 'dashed white',
      }"
    >
      <template #header>
        <div style="width: 100%">
          <NDropdown trigger="hover" :options="options" @select="handleSelectNewTask">
            <div ref="cardHeaderRef" class="card-header">
              <NSpace>
                <span class="card-title">
                  {{ props.isCollapsed ? '新建任务' : '' }}
                </span>
              </NSpace>
              <NSpace justify="end" align="center" />
            </div>
          </NDropdown>
        </div>
      </template>
      <div class="card-content">
        <NScrollbar @contextmenu="handleShowDropdown">
          <slot />
        </NScrollbar>
      </div>
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="less" scoped>
@keyframes breathe {
  from {
    box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1), 0 0 5px 0 transparent;
  }
  to {
    box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1),
      0 0 10px var(--breathe-color);
  }
}
.task-card {
  user-select: none;
  transition: width 0.3s var(--n-bezier);

  & :deep(.n-collapse-item__content-wrapper .n-collapse-item__content-inner) {
    padding-top: 0;
  }
}

.task-card-inner {
  overflow: hidden;
  background: rgba(255, 255, 255, 0);
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  float: none;

  &.collapsed {
    border-radius: 12px 12px 0 0;
  }

  &.task-card__status-processing {
    animation: breathe 3s ease-in-out alternate infinite;
  }

  & :deep(.n-collapse-item__header .n-collapse-item__header-main) {
    display: block;
  }
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  height: 22px;
}

.card-progress-hint {
  font-size: smaller;
}

.card-content {
  max-width: 100%;
  padding: 0 12px;
  transition: height 0.3s var(--n-bezier);
  aspect-ratio: 9 / 4;
  min-height: 120px;
}
</style>
