<script setup lang="ts">
import { computed, ref } from "vue";
import { NButton, NModal, NCard, NText, NDivider } from "naive-ui";
import useTaskStore from "@/store/tasks";
import router from "@/router";
import ItemCheck from "../ItemCheck.vue";

const taskStore = useTaskStore();

interface MallConfiguration {
  exclude: Set<string>;
}

const mallItems = [
  {
    title: "基础物资",
    items: [
      "龙门币",
      "家具零件",
      "招聘许可",
      "加急许可",
      "赤金",
    ],
  },
  {
    title: "养成物资",
    items: [
      "基础作战记录",
      "初级作战记录",
      "技巧概要·卷1",
      "技巧概要·卷2",
      "碳",
      "碳素",
    ],
  },
  {
    title: "白底材料",
    items: [
      "源岩",
      "代糖",
      "酯原料",
      "异铁碎片",
      "双酮",
      "破损装置",
    ]
  },
  {
    title: "绿底材料",
    items: [
      "固源岩",
      "糖",
      "聚酸酯",
      "异铁",
      "酮凝集",
      "装置",
    ]
  }

];

const routeUuid = router.currentRoute.value.params.uuid as string;
const task = computed(() => taskStore.deviceTasks[routeUuid].find(task => task.id === "mall"));
const configuration = task.value?.configurations as unknown as MallConfiguration;

const showModal = ref(false);

function handleItemCheckUpdate(item: string, checked: boolean) {
  if (checked) {
    configuration.exclude.delete(item);
  } else {
    configuration.exclude.add(item);
  }
}
</script>

<template>
  <div class="configuration-form mall-configuration">
    <NButton
      quaternary
      type="primary"
      @click="showModal = true"
      :focusable="false"
    >信用购买选项...</NButton>
    <!-- 信用购买Modal -->
    <NModal
      v-model:show="showModal"
      title="信用购买选项"
      display-directive="show"
      role="dialog"
      aria-modal="true"
    >
      <NCard
        style="width: 600px;"
        role="dialog"
        aria-modal="true"
        title="信用购买选项"
      >
        <div v-for="(group, index) in mallItems" :key="index">
          <NDivider />
          <div class="item-group">
            <NText>{{ group.title }}</NText>
            <ItemCheck
              v-for="(item) in group.items"
              :key="item"
              :name="item"
              :checked="!configuration.exclude.has(item)"
              @update:checked="(checked) => handleItemCheckUpdate(item, checked)"
            />
          </div>
        </div>
      </NCard>
    </NModal>
  </div>
</template>

<style lang="less" scoped>
.mall-configuration {
  text-align: left;
}

.item-group {
  display: flex;
  align-items: center;
}

.n-divider:not(.n-divider--vertical) {
  margin: 12px 0;
}
</style>