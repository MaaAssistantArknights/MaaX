<script setup lang="ts">
import {
  NProgress,
  NSwitch,
  NCollapse,
  NCollapseItem,
  NScrollbar,
  NSpace,
  useThemeVars,
} from "naive-ui";
import useThemeStore from "@/store/theme";
import Timer from "./Timer.vue";

const themeVars = useThemeVars();
const themeStore = useThemeStore();

const props = defineProps<{
  isCollapsed: boolean;
  taskInfo: Task;
}>();

defineEmits(["update:enable"]);

const processBarColor = (taskStatus: TaskStatus) => {
  switch (taskStatus) {
    case "idle":
    case "processing":
      return themeVars.value.primaryColor;
    case "success":
      return themeVars.value.successColor;
    case "exception":
      return themeVars.value.errorColor;
    case "waiting":
      return themeVars.value.infoColor;
    case "warning":
      return themeVars.value.warningColor;
  }
};
</script>

<template>
  <NCollapse
    :expanded-names="props.isCollapsed ? null : '1'"
    class="task-card"
    :class="props.taskInfo.status === 'idle' ? '' : 'undraggable'"
  >
    <template #arrow>
      <span></span>
    </template>
    <NCollapseItem
      class="task-card-inner"
      :class="props.isCollapsed ? 'collapsed' : ''"
      name="1"
      :display-directive="'show'"
      :style="{
        border:
          themeStore.theme === 'maa-dark'
            ? `1px solid ${themeVars.primaryColor}`
            : '',
      }"
    >
      <template #header>
        <div style="width: 100%">
          <div class="card-header">
            <NSpace>
              <span class="card-title">{{ props.taskInfo.title || "" }}</span>
              <span
                class="card-progress-hint"
                :style="{ color: themeVars.primaryColor }"
              >
                {{
                  (() => {
                    switch (props.taskInfo.status) {
                      case "idle":
                        return "";
                      case "processing":
                        return `进行中 ${props.taskInfo.progress ?? 0}%`;
                      case "success":
                        return "已完成";
                      case "exception":
                        return "任务出错";
                    }
                  })()
                }}
              </span>
            </NSpace>
            <NSwitch
              v-if="props.taskInfo.status === 'idle'"
              :value="props.taskInfo.enable"
              @update:value="enabled => $emit('update:enable', enabled)"
            />
            <Timer
              v-else
              :start-time="props.taskInfo.startTime"
              :end-time="props.taskInfo.endTime"
            />
          </div>
          <NProgress
            :percentage="props.taskInfo.progress"
            :color="processBarColor(props.taskInfo.status)"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
      </template>
      <div class="card-content">
        <NScrollbar style="height: 100px">
          <slot></slot>
        </NScrollbar>
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
