<script setup lang="ts">
import { NButton, NCard, NInputNumber, NInput, NSpace, NTooltip, useThemeVars } from "naive-ui";

const themeVars = useThemeVars();

const props = defineProps<{
  levels: Array<Level>
  special: {
    times: number;
    type: "current" | "last"
  }
}>();

const emit = defineEmits(["update:special_type"]);

function handleSpecialTypeChange() {
  if (props.special.type === "current") {
    emit("update:special_type", "last");
  } else {
    emit("update:special_type", "current");
  }
}
</script>

<template>
  <NCard
    class="level-choose"
    title="关卡选择"
    style="width: 600px;"
    role="dialog"
    aria-modal="true"
  >
    <template #header-extra>
      <NInput placeholder="搜索" size="small" />
    </template>
    <NSpace vertical>
      <div class="level-card">
        <NTooltip>
          <template #trigger>
            <NButton
              text
              :focusable="false"
              @click="handleSpecialTypeChange"
            >{{ special.type === 'current' ? '当前关卡' : '上次作战' }}</NButton>
          </template>
          {{ `点击切换到“${special.type !== 'current' ? '当前关卡' : '上次作战'}”` }}
        </NTooltip>
        <NInputNumber v-model:value="$props.special.times" size="small" />
      </div>
      <div
        class="level-card"
        v-for="(level) in props.levels"
        :key="level.stage.stage_metadata.stage_id"
      >
        <span>{{ `${level.stage.zone_i18n.zh} / ${level.stage.stage_i18n.zh}` }}</span>
        <NInputNumber v-model:value="level.times" size="small" />
        <div class="cover">
          <img
            :src="'https://penguin-stats.s3.amazonaws.com/backgrounds/zones/A001_zone1.jpg'"
          />
        </div>
      </div>
    </NSpace>
  </NCard>
</template>

<style lang="less" scoped>
.level-card {
  display: flex;
  border: 1px solid var(--n-border-color);
  box-shadow: var(--n-box-shadow);
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  border-radius: 12px;
  background-color: var(--n-color);
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  & > img {
    object-fit: cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    filter: blur(4px);
    z-index: -1;
  }
}
</style>