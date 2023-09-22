<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import {
  NButton,
  NCard,
  NCol,
  NForm,
  NFormItem,
  NInput,
  NModal,
  NRow,
  NText,
  useMessage,
} from 'naive-ui'
import { computed, ref } from 'vue'

const message = useMessage()

const props = defineProps<{
  show: boolean
  name: string
}>()

const emit = defineEmits(['update:show', 'change:name', 'delete'])

const show = useVModel(props, 'show', emit)

const showConfirmDeleteModal = ref(false)
const confirmDeleteInput = ref('')

function handleConfirmDelete() {
  if (confirmDeleteInput.value === props.name) {
    emit('delete')
    showConfirmDeleteModal.value = false
    show.value = false
  } else {
    message.error('请输入正确的任务组名称')
  }
}
</script>

<template>
  <NModal v-model:show="show">
    <NCard style="width: 50%">
      <NForm label-placement="left" label-width="auto">
        <NFormItem label="任务组名称">
          <NInput
            passively-activated
            :default-value="props.name"
            @change="value => emit('change:name', value)"
          />
        </NFormItem>
        <NRow :gutter="[0, 24]">
          <NCol :span="24">
            <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
              <NButton type="error" @click="showConfirmDeleteModal = true"> 删除此任务组 </NButton>
            </div>
          </NCol>
        </NRow>
      </NForm>
    </NCard>
  </NModal>
  <NModal v-model:show="showConfirmDeleteModal">
    <NCard style="width: 50%">
      <NForm>
        <NText
          >如果你要删除此任务组，请输入
          <NText strong>{{ props.name }}</NText>
          确认删除
        </NText>
        <NFormItem>
          <NInput v-model:value="confirmDeleteInput" />
        </NFormItem>
        <NRow :gutter="[0, 24]">
          <NCol :span="24">
            <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
              <NButton type="error" @click="handleConfirmDelete">确认删除</NButton>
            </div>
          </NCol>
        </NRow>
      </NForm>
    </NCard>
  </NModal>
</template>
