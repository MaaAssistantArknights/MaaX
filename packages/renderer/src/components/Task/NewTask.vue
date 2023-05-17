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

const handleClickOutside = () => {
  showDropdown.value = false
}
</script>

<template>
  <NCollapse :expanded-names="props.isCollapsed ? null : '1'" class="task-card">
    <template #arrow>
      <span />
    </template>
    <div class="task-card-inner" :style="{
        border: `3px dashed ${themeVars.borderColor}`
      }">
      <NCollapseItem name="1" display-directive="show">
        <template #header>
          <div class="card-header" />
        </template>
        <div class="card-content" />
      </NCollapseItem>
      <div class="dropdown-area" @contextmenu="handleShowDropdown">
        <NSpace justify="center" align="center" style="height: 100%;">
          <NText>点击鼠标右键创建新任务</NText>
        </NSpace>
      </div>
      <NDropdown trigger="manual" :options="options" @select="handleSelectNewTask"
        :x="dropdownPosition.x" :y="dropdownPosition.y" :show="showDropdown"
        :on-clickoutside="handleClickOutside">
      </NDropdown>
    </div>
  </NCollapse>
</template>

<style lang="less" scoped>
.task-card {
  user-select: none;
  transition: width 0.3s var(--n-bezier);

  & :deep(.n-collapse-item__content-wrapper .n-collapse-item__content-inner) {
    padding-top: 0;
  }
}

.task-card-inner {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0);
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

.dropdown-area {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
