<script lang="ts" setup>
import { NInput, NText, NTooltip } from 'naive-ui'
import type { InputInst } from 'naive-ui'
import { ref } from 'vue'

const isEditing = ref(false)
const input = ref<InputInst | null>(null)

const props = defineProps<{
  value: string
}>()

function onEdit() {
  isEditing.value = true
  input.value?.focus()
}
</script>

<template>
  <div class="click-edit">
    <NText v-show="!isEditing" @click="onEdit">
      {{ props.value || $attrs.placeholder || '-' }}
    </NText>
    <NInput
      v-show="isEditing"
      ref="input"
      v-bind="$attrs"
      :value="props.value"
      @blur="isEditing = false"
      @keydown.enter="isEditing = false"
      passively-activated
    />
  </div>
</template>

<style lang="less" scoped>
.click-edit {
  cursor: pointer;
}
</style>
