<script lang="ts" setup>
import { ref } from 'vue'
import { NIcon, NButton, NPopconfirm, NInput, NSpace, NText, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { TrashOutline } from '@vicons/ionicons5'

import useTaskStore from '@/store/tasks'
import EditIcon from '@/assets/icons/edit.svg?component'

const props = defineProps<{
  taskGroup: TaskGroup | undefined
  deviceUuid: string
}>()

const taskStore = useTaskStore()
const message = useMessage()
const { t } = useI18n()

const isEditing = ref(false)

const handleEditDone = (value: string) => {
  if (!props.taskGroup) return
  const trimed = value.trim()
  if (trimed === '') {
    message.error(t('error.cannotBeEmpty', { name: t('task.taskGroupName') }))
    return
  }
  taskStore.changeTaskGroupName(props.deviceUuid, props.taskGroup.id, trimed)
  isEditing.value = false
}

const handleDelete = () => {
  if (!props.taskGroup) return
  try {
    taskStore.deleteTaskGroup(props.deviceUuid, props.taskGroup.id)
  } catch (error) {
    message.error(t(`errors.${error.message}`))
  }
}
</script>

<template>
  <NSpace class="task-group" align="center">
    <NInput
      v-if="isEditing"
      passively-activated
      :default-value="props.taskGroup?.name"
      :disabled="!props.taskGroup"
      @change="handleEditDone"
      @blur="isEditing = false"
    />
    <NText v-else>
      {{ props.taskGroup?.name }}
    </NText>
    <NButton
      v-if="!isEditing"
      size="small"
      quaternary
      circle
      @click="isEditing = true"
    >
      <template #icon>
        <NIcon>
          <EditIcon />
        </NIcon>
      </template>
    </NButton>
    <NPopconfirm @positive-click="handleDelete">
      <template #trigger>
        <NButton
          size="small"
          quaternary
          circle
          type="error"
        >
          <template #icon>
            <NIcon>
              <TrashOutline />
            </NIcon>
          </template>
        </NButton>
      </template>
      <template #default>
        <NText>确定要删除{{ props.taskGroup?.name }}吗？</NText>
      </template>
    </NPopconfirm>
  </NSpace>
</template>
