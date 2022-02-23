<script setup lang="ts">
import { NProgress, NSwitch, NCollapse, NCollapseItem, NScrollbar, NSpace, useThemeVars } from 'naive-ui';
import useThemeStore from '@/store/theme';
import Timer from './Timer.vue';

const themeVars = useThemeVars();
const themeStore = useThemeStore();

const props = defineProps<{
  isCollapsed: boolean,
  info: {
    title: string,
    status: 'idle' | 'processing' | 'success' | 'exception',
    enable: boolean,
    startTime?: number,
    endTime?: number,
    progress?: number,
  }
}>()

const processBarColor = (taskStatus: 'idle' | 'processing' | 'success' | 'exception') => {
  switch (taskStatus) {
    case 'idle':
    case 'processing':
      return themeVars.value.primaryColor;
    case 'success':
      return themeVars.value.successColor;
    case 'exception':
      return themeVars.value.errorColor;
  }
}
</script>

<template>
  <NCollapse
    :expanded-names="props.isCollapsed ? null : '1'"
    class="task-card"
    :class="props.info.status === 'idle' ? '' : 'undraggable'"
  >
    <template #arrow>
      <span></span>
    </template>
    <NCollapseItem
      class="task-card-inner"
      :class="props.isCollapsed ? 'collapsed' : ''"
      name="1"
      :style="{ border: themeStore.theme === 'maa-dark' ? `1px solid ${themeVars.primaryColor}` : '' }"
    >
      <template #header>
        <div style="width: 100%;">
          <div class="card-header">
            <NSpace>
              <span class="card-title">{{ props.info.title || '' }}</span>
              <span class="card-progress-hint" :style="{ color: themeVars.primaryColor }">
                {{
                  (() => {
                    switch (props.info.status) {
                      case 'idle':
                        return '';
                      case 'processing':
                        return `进行中 ${props.info.progress ?? 0}%`;
                      case 'success':
                        return '已完成';
                      case 'exception':
                        return '任务出错';
                    }
                  })()
                }}
              </span>
            </NSpace>
            <NSwitch v-if="props.info.status === 'idle'" v-model:value="props.info.enable" />
            <Timer v-else :start-time="props.info.startTime" :end-time="props.info.endTime" />
          </div>
          <NProgress
            :percentage="props.info.progress"
            :color="processBarColor(props.info.status)"
            :border-radius="0"
            :height="4"
            :show-indicator="false"
          />
        </div>
      </template>
      <div class="card-content">
        <NScrollbar style="height: 100px;">
          <slot></slot>
        </NScrollbar>
      </div>
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="less" scoped>
.task-card {
  transition: width .3s var(--n-bezier);
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
  padding: 8px 12px;
}
</style>