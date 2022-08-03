<script setup lang="ts">
import {
  NProgress,
  NSwitch,
  NCollapse,
  NCollapseItem,
  NScrollbar,
  NSpace,
  useThemeVars,
  NIcon,
  NTooltip,
  NButton
} from 'naive-ui'
import { ref, nextTick } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import router from '@/router'
import useThemeStore from '@/store/theme'
import Timer from './Timer.vue'
import IconAdd from '@/assets/icons/add.svg?component'
import IconRemove from '@/assets/icons/remove.svg?component'
import useTaskStore from '@/store/tasks'
import useDeviceStore from '@/store/devices'
import { show } from '@/utils/message'
const themeVars = useThemeVars()
const themeStore = useThemeStore()
const props = defineProps<{
  isCollapsed: boolean;
  showResult?: Boolean;
  taskInfo: Task;
}>()

const logger = console
const taskStore = useTaskStore()
const deviceStore = useDeviceStore()

const emit = defineEmits(['update:enable', 'update:showResult'])

const dropdownPosition = ref({
  x: 0,
  y: 0
})

const showDropdown = ref(false)

const handleShowDropdown = (e: MouseEvent) => {
  e.preventDefault()
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    dropdownPosition.value = {
      x: e.clientX,
      y: e.clientY
    }
  })
}

const handleTogglePanel = (panelType: string) => {
  if (panelType === 'configuration-panel') {
    emit('update:showResult', false)
  } else {
    emit('update:showResult', true)
  }
}

const progressBarColor = (taskStatus: TaskStatus) => {
  switch (taskStatus) {
    case 'idle':
    case 'processing':
      return themeVars.value.primaryColor
    case 'success':
      return themeVars.value.successColor
    case 'exception':
      return themeVars.value.errorColor
    case 'waiting':
      return themeVars.value.infoColor
    case 'warning':
      return themeVars.value.warningColor
    case 'stopped':
      return themeVars.value.warningColor
  }
}

const resetTaskProgress = (taskInfo: Task) => {
  if (taskInfo.status === 'idle') return
  taskInfo.status = 'idle'
  taskInfo.progress = 0
  taskInfo.startTime = 0
  taskInfo.endTime = 0
}

const uuid = router.currentRoute.value.params.uuid as string

const copyTask = (taskInfo: Task) => {
  taskStore.copyTask(uuid, taskInfo.ui_id)
}

const deleteTask = (taskInfo: Task) => {
  const status = taskStore.deleteTask(uuid, taskInfo.ui_id, taskInfo.id)
  if (!status) {
    show('不可以删除只有一份的任务哦', { type: 'error' })
  }
}

const deviceStatus = deviceStore.getDevice(uuid)?.status ?? 'disconnected'

</script>

<template>
  <NCollapse :expanded-names="props.isCollapsed ? null : '1'" class="task-card"
    :class="props.taskInfo.status === 'idle' ? '' : 'undraggable'">
    <template #arrow>
      <span></span>
    </template>
    <NCollapseItem class="task-card-inner" :class="props.isCollapsed ? 'collapsed' : ''" name="1"
      :display-directive="'show'" :style="{
        border:
          themeStore.theme === 'maa-dark'
            ? `1px solid ${themeVars.primaryColor}`
            : '',
      }">
      <template #header>
        <div style="width: 100%">
          <div class="card-header">
            <NSpace>
              <span class="card-title">{{ props.taskInfo.title || "" }}</span>
              <span class="card-progress-hint" :style="{ color: themeVars.primaryColor }">
                {{
                    (() => {
                      switch (props.taskInfo.status) {
                        case "idle":
                          return "";
                        case "waiting":
                          return "等待中";
                        case "processing":
                          return `进行中 ${props.taskInfo.progress ?? 0}%`;
                        case "success":
                          return "已完成";
                        case "warning":
                          return "警告";
                        case "exception":
                          return "任务出错";
                        case "stopped":
                          return "手动取消";
                      }
                    })()
                }}
              </span>
            </NSpace>
            <NSpace v-if="deviceStatus === 'tasking' && props.taskInfo.status !== 'idle'" justify="end">
              <Timer :start-time="props.taskInfo.startTime" :end-time="props.taskInfo.endTime" />
            </NSpace>
            <NSpace v-else justify="end">
              <NTooltip>
                <template #trigger>
                  <NButton text style="font-size: 25px" @click="() => { copyTask(props.taskInfo) }">
                    <NIcon>
                      <IconAdd />
                    </NIcon>
                  </NButton>
                </template>
                复制当前任务
              </NTooltip>
              <NTooltip>
                <template #trigger>
                  <NButton text style="font-size: 25px"
                    @click="() => { deleteTask(props.taskInfo) }">
                    <NIcon>
                      <IconRemove />
                    </NIcon>
                  </NButton>
                </template>
                删除当前任务
              </NTooltip>
              <NSwitch :disabled="['processing', 'waiting'].includes(props.taskInfo.status)"
                :value="props.taskInfo.enable" @update:value="enabled => {
                  $emit('update:enable', enabled)
                  resetTaskProgress(props.taskInfo)
                }" />
            </NSpace>
          </div>
          <NProgress :percentage="props.taskInfo.progress"
            :color="progressBarColor(props.taskInfo.status)" :border-radius="0" :height="4"
            :show-indicator="false" />
        </div>
      </template>
      <div class="card-content">
        <NScrollbar style="height: 105px" @contextmenu="handleShowDropdown">
          <slot></slot>
        </NScrollbar>
        <DropdownMenu :x="dropdownPosition.x" :y="dropdownPosition.y" v-model:show="showDropdown"
          @select="handleTogglePanel" />
      </div>
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="less" scoped>
.task-card {
  user-select: none;
  transition: width 0.3s var(--n-bezier);

  & :deep(.n-collapse-item__content-wrapper .n-collapse-item__content-inner) {
    padding-top: 0px;
  }
}

.task-card-inner {
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.1);
  border-radius: 12px;
  float: none;

  &.collapsed {
    border-radius: 12px 12px 0 0;
  }

  & :deep(.n-collapse-item__header .n-collapse-item__header-main) {
    display: block;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
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
}
</style>
