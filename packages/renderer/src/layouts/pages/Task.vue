<script setup lang="ts">
import { computed, onMounted, ref, Ref, watch } from 'vue'
import { NSpace, NButton, NSwitch, NIcon, NTooltip } from 'naive-ui'
import _ from 'lodash'
import Sortable from 'sortablejs'
import TaskCard from '@/components/Task/TaskCard.vue'
import IconList from '@/assets/icons/list.svg?component'
import IconGrid from '@/assets/icons/grid.svg?component'
import Configuration from '@/components/Task/configurations/Index.vue'

import useTaskStore from '@/store/tasks'
import useDeviceStore from '@/store/devices'
import useTaskIdStore from '@/store/taskId'
import { handleCoreTask, uiTasks } from '@/utils/converter/tasks'
import { show } from '@/utils/message'

import router from '@/router'
import { checkCoreVersion, installCore } from '@/utils/core'
import Result from '@/components/Task/results/Index.vue'
const logger = console

const taskStore = useTaskStore()
const deviceStore = useDeviceStore()
const taskIdStore = useTaskIdStore()

const isGrid = ref<boolean>(false)
const cardsRef: Ref<HTMLElement | null> = ref(null)

const uuid = computed(() => router.currentRoute.value.params.uuid as string)
const tasks = computed(() => {
  if (!taskStore.deviceTasks[uuid.value]) {
    taskStore.newTask(uuid.value)
  }
  return taskStore.deviceTasks[uuid.value]
})

onMounted(() => {
  load()
})

watch(router.currentRoute, () => {
  load()
})

let sortable: Sortable | undefined

function load () {
  if (cardsRef.value && !sortable) {
    sortable = new Sortable(cardsRef.value, {
      swapThreshold: 1,
      animation: 150,
      filter: '.undraggable',
      store: {
        get () {
          return tasks.value?.map((task) => task.ui_id.toString()) || []
        },
        set (sortable) {
          const sort = sortable.toArray()
          if (tasks.value && uuid.value) {
            taskStore.updateTask(
              uuid.value,
              _.sortBy(tasks.value, (task) =>
                sort.findIndex((v) => _.toNumber(v) === task.ui_id)
              )
            )
          }
        }
      },
      onMove: (event) => {
        if (event.related.classList.contains('undraggable')) {
          return false
        }
      }
    })
  }
}

const deviceStatus = computed(() => {
  const device = deviceStore.getDevice(uuid.value as string)
  if (!device) return 'unknown'
  return device.status
})

async function handleStartUnconnected (task: Task['configurations']) {
  // 未连接的设备启动任务
  if (!(await checkCoreVersion())) {
    installCore()
    return
  }
  console.log('before start emu')
  console.log(task)
  window.ipcRenderer.send('10001', uuid.value, task.taskId) // 启动模拟器 子任务开始
  console.log('after start')

  deviceStore.updateDeviceStatus(uuid.value, 'tasking')
  window.ipcRenderer.invoke(
    'main.DeviceDetector:startEmulator',
    task.commandLine
  )
  logger.debug('after start emulators')
  setTimeout(async () => {
    logger.debug('before getEmulators')
    const devices: any[] = await window.ipcRenderer.invoke(
      'main.DeviceDetector:getEmulators'
    ) // 等待时间结束后进行一次设备搜索，但不合并结果
    const device = devices.find((device) => device.uuid === uuid.value) // 检查指定uuid的设备是否存在
    logger.debug('after getEmulators')
    if (device) {
      // 设备活了
      logger.debug('find device')
      logger.debug('before create')
      logger.debug(device)
      await window.ipcRenderer.invoke('main.CoreLoader:createExAndConnect', {
        // 创建连接
        address: device.address,
        uuid: device.uuid,
        adb_path: device.adb_path,
        config: device.config
      })
      logger.debug('after create')
      window.ipcRenderer.send('10002', uuid.value, 'emulator') // 启动模拟器 子任务完成
      logger.debug('after start emulator')
      show('启动模拟器子任务结束', { type: 'success' })
      await handleSubStart()
    } else {
      // 设备没活
      logger.debug('device not found')
      show('启动设备失败, 请前往github上提交issue', {
        type: 'error',
        duration: 0
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

  const taskTranslate: Record<string, string> = {
    startup: 'StartUp',
    fight: 'Fight',
    recruit: 'Recruit',
    infrast: 'Infrast',
    visit: 'Visit',
    mall: 'Mall',
    award: 'Award',
    rogue: 'Roguelike'
  }

  for await (const singleTask of tasks.value) {
    if (uiTasks.includes(singleTask.id)) continue

    if (singleTask.enable) {
      logger.debug('enter task:')
      console.log(singleTask.id)
      taskStore.updateTaskStatus(uuid.value, singleTask.id, 'waiting', 0)
      const taskIter = handleCoreTask[singleTask.id]({
        ...singleTask.configurations,
        uuid: uuid.value,
        taskId: singleTask.id
      })

      let task = taskIter.next()
      while (!task.done) {
        const taskId = await window.ipcRenderer.invoke(
          'main.CoreLoader:appendTask',
          {
            uuid: uuid.value,
            type: taskTranslate[singleTask.id],
            params: task.value
          }
        )
        taskIdStore.updateTaskId(uuid.value, singleTask.id, taskId) // 记录任务id
        task = taskIter.next()
      }
    }
  }
  deviceStore.updateDeviceStatus(uuid.value as string, 'tasking')

  await window.ipcRenderer.invoke('main.CoreLoader:start', {
    uuid: uuid.value
  })
}

async function handleSubStop () {
  show('正在停止任务', { type: 'info', duration: 0 })
  const status = await window.ipcRenderer.invoke('main.CoreLoader:stop', {
    uuid: uuid.value
  }) // 等待core停止任务
  if (!status) {
    show('停止任务失败', { type: 'error', duration: 5000 })
  } else {
    show('已停止任务', { type: 'success', duration: 5000 })
  }
  deviceStore.updateDeviceStatus(uuid.value as string, 'connected') // 将设备状态改为已连接
  taskIdStore.removeAllTaskId(uuid.value as string) // 删除所有任务id
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
    const task = taskStore.getTask(uuid.value as string, 'emulator') // 查找是否有启动模拟器任务
    if (task && task.enable === true) {
      // 有启动模拟器任务
      if (!task.configurations.commandLine) {
        // 设备没有获取到用于启动模拟器的命令行参数
        // FIXME: 需要展开任务详情才能获取到CommandLine
        show('该设备启动参数不可用', { type: 'warning', duration: 2000 })
        return
      }
      await handleStartUnconnected(task.configurations)
    } else {
      show("请先 '启动并搜索模拟器' 或 '勾选启动模拟器子任务'", {
        type: 'warning',
        duration: 3000
      })
    }
  }
}
</script>

<template>
  <div>
    <NSpace justify="space-between" align="center">
      <h2>任务</h2>

      <NSpace align="center">
        <!-- <NDropdown>
        <NButton type="primary">切换配置</NButton>
      </NDropdown> -->
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

        <NButton type="primary" round @click="handleStart">
          <span>{{ deviceStatus === "tasking" ? "停止" : "开始" }}</span>
        </NButton>
      </NSpace>
    </NSpace>

    <div class="cards" :class="isGrid ? 'cards-grid' : ''" ref="cardsRef">
      <TaskCard
        :is-collapsed="!isGrid"
        v-for="task in tasks"
        :key="task.id"
        :task-info="task"
        @update:enable="(enabled) => (task.enable = enabled)"
        :data-id="task.ui_id"
        v-model:showResult="task.showResult"
      >
        <!-- TODO: 添加一个切换配置与进度的按钮 -->
        <Result :taskId="task.id" :result="{}" v-show="task.showResult" />
        <Configuration
          :taskId="task.id"
          :configurations="task.configurations"
          v-show="!task.showResult"
        />
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
