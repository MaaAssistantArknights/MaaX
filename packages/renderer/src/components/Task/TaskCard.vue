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
  NButton,
  NText
} from 'naive-ui'
import { ref, nextTick, computed } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import router from '@/router'
import useThemeStore from '@/store/theme'
import Timer from './Timer.vue'
import IconAdd from '@/assets/icons/add.svg?component'
import IconRemove from '@/assets/icons/remove.svg?component'
import useDeviceStore from '@/store/devices'
const themeVars = useThemeVars()
const themeStore = useThemeStore()
const props = defineProps<{
  isCollapsed: boolean;
  showResult?: Boolean;
  taskInfo: Task;
}>()

const deviceStore = useDeviceStore()

const emit = defineEmits(['update:enable', 'update:showResult', 'copy', 'delete'])

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

const deviceStatus = computed(() => deviceStore.getDevice(uuid)?.status ?? 'disconnected')

</script>

<template>
  <NCollapse
    :expanded-names="props.isCollapsed ? null : '1'"
    class="task-card"
    :class="props.taskInfo.status === 'idle' ? '' : 'undraggable'"
  >
    <template #arrow>
      <span />
    </template>
    <NCollapseItem
      class="task-card-inner"
      :class="props.isCollapsed ? 'collapsed' : ''"
      name="1"
      display-directive="show"
      :style="{
        border:
          themeStore.currentTheme === 'maa-dark'
            ? `1px solid ${themeVars.primaryColor}`
            : '',
      }"
    >
      <template #header>
        <div style="width: 100%">
          <div class="card-header">
            <NSpace>
              <span class="card-title">{{ props.taskInfo.title || "" }}</span>
              <div
                v-if="deviceStatus === 'tasking' && props.taskInfo.status !== 'idle'"
                justify="end"
              >
                <NText type="primary">
                  <Timer
                    :start-time="props.taskInfo.startTime"
                    :end-time="props.taskInfo.endTime"
                  />
                </NText>
              </div>
            </NSpace>
            <NSpace justify="end" align="center">
              <NTooltip>
                <template #trigger>
                  <NButton text style="font-size: 25px" @click="() => $emit('copy')">
                    <NIcon>
                      <IconAdd />
                    </NIcon>
                  </NButton>
                </template>
                复制当前任务
              </NTooltip>
              <NTooltip>
                <template #trigger>
                  <NButton
                    text
                    style="font-size: 25px"
                    :disabled="['processing', 'waiting', 'success'].includes(props.taskInfo.status)"
                    @click="() => $emit('delete')"
                  >
                    <NIcon>
                      <IconRemove />
                    </NIcon>
                  </NButton>
                </template>
                删除当前任务
              </NTooltip>
              <span
                v-if="['processing', 'waiting'].includes(props.taskInfo.status)"
                class="card-progress-hint"
                :style="{ color: themeVars.primaryColor }"
              >
                {{
                  (() => {
                    switch (props.taskInfo.status) {
                    case "idle":
                      return ""
                    case "waiting":
                      return "等待中"
                    case "processing":
                      return '进行中'
                    case "success":
                      return "已完成"
                    case "warning":
                      return "警告"
                    case "exception":
                      return "任务出错"
                    case "stopped":
                      return "手动取消"
                    case 'skipped':
                      return '已跳过'
                    }
                  })()
                }}
              </span>
              <NSwitch
                v-else
                :value="props.taskInfo.enable"
                @update:value="enabled => {
                  $emit('update:enable', enabled)
                  resetTaskProgress(props.taskInfo)
                }"
              />
            </NSpace>
          </div>
          <NProgress
            :percentage="props.taskInfo.progress"
            :color="progressBarColor(props.taskInfo.status)"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
      </template>
      <div class="card-content">
        <NScrollbar style="height: 105px" @contextmenu="handleShowDropdown">
          <slot />
        </NScrollbar>
        <DropdownMenu
          v-model:show="showDropdown"
          :x="dropdownPosition.x"
          :y="dropdownPosition.y"
          @select="handleTogglePanel"
        />
      </div>
    </NCollapseItem>
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
