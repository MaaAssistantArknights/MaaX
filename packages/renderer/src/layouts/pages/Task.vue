<script setup lang="ts">
import { computed, ref, provide, h } from 'vue'
import { NSpace, NButton, NSwitch, NIcon, NTooltip, NSelect, NInput, SelectOption } from 'naive-ui'
import _ from 'lodash'
import Draggable from 'vuedraggable'
import TaskCard from '@/components/Task/TaskCard.vue'
import NewTask from '@/components/Task/NewTask.vue'
import IconList from '@/assets/icons/list.svg?component'
import IconGrid from '@/assets/icons/grid.svg?component'
import Configuration from '@/components/Task/configurations/Index.vue'

import useTaskStore from '@/store/tasks'
import useDeviceStore from '@/store/devices'
import { show } from '@/utils/message'

import router from '@/router'
import Result from '@/components/Task/results/Index.vue'
import logger from '@/hooks/caller/logger'
import { runTasks, runStartEmulator } from '@/utils/task_runner'

const taskStore = useTaskStore()
const deviceStore = useDeviceStore()
// const taskIdStore = useTaskIdStore()

const isGrid = ref(false)
const actionLoading = ref(false)

const uuid = computed(() => router.currentRoute.value.params.uuid as string)
const tasks = computed(() => {
  if (!taskStore.deviceTasks[uuid.value]) {
    taskStore.initDeviceTask(uuid.value)
  }
  return taskStore.getCurrentTaskGroup(uuid.value)?.tasks
})

function handleDragMove (event: any) {
  if (event.related.classList.contains('undraggable')) {
    return false
  }
}

const deviceStatus = computed(() => {
  const device = deviceStore.getDevice(uuid.value as string)
  if (!device) return 'unknown'
  return device.status
})

async function handleStartUnconnected (task: Task) {
  deviceStore.updateDeviceStatus(uuid.value, 'tasking')
  await runStartEmulator(uuid.value, task)
  task.schedule_id = setTimeout(async () => {
    const devices: any[] = await window.ipcRenderer.invoke(
      'main.DeviceDetector:getEmulators'
    ) // 等待时间结束后进行一次设备搜索，但不合并结果
    const device = devices.find((device) => device.uuid === uuid.value) // 检查指定uuid的设备是否存在
    if (device) {
      // 设备活了
      logger.debug(device)
      const status = await window.ipcRenderer.invoke('main.CoreLoader:initCore', {
        // 创建连接
        address: device.address,
        uuid: device.uuid,
        adb_path: device.adbPath,
        config: device.config
      })
      if (status) {
        taskStore.updateTaskStatus(uuid.value, task.task_id, 'success', 0)
        logger.silly('自动启动模拟器成功')
        await handleSubStart()
      }
    } else {
      // 设备没活
      show('启动设备失败', {
        type: 'error',
        duration: 0,
        closable: true
      })
    }
  }, 10000)
  // (task.delay as number)*1000
}

async function handleSubStart () {
  if (_.findIndex(tasks.value, (task) => task.enable === true) === -1) {
    show('请至少选择一个任务', { type: 'warning', duration: 5000 })
    return
  }

  await runTasks(uuid.value)

  deviceStore.updateDeviceStatus(uuid.value as string, 'tasking')

  await window.ipcRenderer.invoke('main.CoreLoader:start', {
    uuid: uuid.value
  })
}

async function handleSubStop () {
  actionLoading.value = true
  const status = await window.ipcRenderer.invoke('main.CoreLoader:stop', {
    uuid: uuid.value
  }) // 等待core停止任务
  actionLoading.value = false
  if (!status) {
    show('停止任务失败', { type: 'error', duration: 5000 })
  } else {
    show('已停止任务', { type: 'success', duration: 5000 })
  }
  deviceStore.updateDeviceStatus(uuid.value as string, 'connected') // 将设备状态改为已连接
  taskStore.stopAllTasks(uuid.value as string) // 停止所有任务
}

async function handleStart () {
  const device = deviceStore.getDevice(uuid.value as string)
  if (device && device.status === 'tasking') {
    // 设备进行中, 可停止任务
    await handleSubStop()
  } else if (device && device.status === 'connected') {
    // 设备已连接, 可开始任务
    await handleSubStart()
  } else if (device && device.status === 'available') {
    // 设备可用但未连接, 先尝试连接再开始任务
    // TODO:
    show('请先连接设备', { type: 'warning', duration: 2000 })
  } else {
    // 设备状态为 unknown 或 disconnect , 检查子任务'启动模拟器'是否开启，如果开启则先启动模拟器再开始任务
    // 查找是否有启动模拟器任务
    const task = taskStore.getTask(uuid.value as string, task => task.name === 'emulator' && task.enable)
    if (task) {
      // 有启动模拟器任务
      if (!task.configurations.commandLine) {
        // 设备没有获取到用于启动模拟器的命令行参数
        show('该设备启动参数不可用, 请尝试先连接设备', { type: 'warning', duration: 2000 })
        return
      }
      await handleStartUnconnected(task)
    } else {
      show("请先 '启动并搜索模拟器' 或 '勾选启动模拟器子任务'", {
        type: 'warning',
        duration: 3000
      })
    }
  }
}

function handleTaskCopy (index: number) {
  taskStore.copyTask(uuid.value, index)
}

function handleTaskDelete (index: number) {
  const status = taskStore.deleteTask(uuid.value, index)
  if (!status) {
    show('删除任务失败', { type: 'error', duration: 12 })
  }
}

function handleTaskConfigurationUpdate (key: string, value: any, index: number) {
  taskStore.updateTaskConfigurations(
    uuid.value,
    key,
    value,
    (task, taskIndex) => taskIndex === index
  )
}

function handleCreateNewTaskGroup () {
  const newTaskGroup = taskStore.newTaskGroup(uuid.value)
  taskStore.deviceTasks[uuid.value].groups.push(newTaskGroup)
  taskStore.deviceTasks[uuid.value].current = newTaskGroup.index
}

function handleChangeTaskGroupIndex (value: number) {
  taskStore.deviceTasks[uuid.value].current = value
}

const taskGroupOptions = computed(() => {
  const options: SelectOption[] = []
  taskStore.deviceTasks[uuid.value]?.groups.forEach((v) => {
    options.push({ label: v.name, value: v.index })
  })
  return options
})

provide('update:configuration', handleTaskConfigurationUpdate)
const currentTaskGroupIndexValue = ref(taskStore.deviceTasks[uuid.value].current)

</script>

<template>
  <div>
    <NSpace
      justify="space-between"
      align="center"
    >
      <h2>任务</h2>

      <NSpace align="center">
        <NSelect
          v-model:value="currentTaskGroupIndexValue"
          :options="taskGroupOptions"
          :consistent-menu-width="false"
          @update:value="handleChangeTaskGroupIndex"
        >
          <template #action>
            <NButton
              text
              @click="handleCreateNewTaskGroup"
            >
              点此新建任务组
            </NButton>
          </template>
        </NSelect>

        <NTooltip class="detail-toggle-switch">
          <template #trigger>
            <NSwitch
              v-model:value="isGrid"
              size="large"
            >
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

        <NButton
          type="primary"
          round
          :loading="actionLoading"
          @click="handleStart"
        >
          <span>{{ deviceStatus === "tasking" ? "停止" : "开始" }}</span>
        </NButton>
      </NSpace>
    </NSpace>

    <Draggable
      :list="tasks"
      :animation="200"
      :filter="'.undraggable'"
      class="cards"
      item-key="task_id"
      :class="isGrid ? 'cards-grid' : ''"
      @move="handleDragMove"
    >
      <template #item="{element: task, index}">
        <TaskCard
          v-model:showResult="task.showResult"
          :is-collapsed="!isGrid"
          :task-info="task"
          @update:enable="(enabled) => (task.enable = enabled)"
          @copy="() => handleTaskCopy(index)"
          @delete="() => handleTaskDelete(index)"
        >
          <Result
            v-if="task.showResult"
            :name="task.name"
            :results="task.results"
          />
          <Configuration
            v-else
            :name="task.name"
            :configurations="task.configurations"
            :task-index="index"
          />
        </TaskCard>
      </template>
    </Draggable>
    <div
      class="cards"
      :class="isGrid ? 'cards-grid' : ''"
    >
      <NewTask
        :is-collapsed="!isGrid"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.cards {
  padding: 4px 12px;
  text-align: center;
  line-height: 1;

  & :deep(.task-card) {
    margin-bottom: 8px;
  }

  & :deep(.undraggable) {
    cursor: default;
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
