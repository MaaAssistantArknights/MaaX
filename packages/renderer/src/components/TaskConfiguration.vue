<script setup lang="ts">
import { NForm } from 'naive-ui';

const props = defineProps<{
  labelWidth?: number,
}>()

</script>

<template>
  <NForm :label-width="props.labelWidth ?? 80" class="task-configuration-form">
    <slot></slot>
  </NForm>
</template>