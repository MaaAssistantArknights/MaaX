<script lang="ts">
import { defineComponent, provide, watchEffect } from 'vue'
import { createI18n } from 'vue-i18n'
import { appLocale } from '@/i18n'

const i18n = createI18n({
  legacy: false, // must set to `false`
  locale: 'EnUS',
  messages: appLocale
})
export default defineComponent({
  props: {
    locale: {
      type: String,
      default: 'ZhCN'
    }
  },
  setup (props) {
    /**
     * provide i18n instance with `I18nInjectionKey` for other web components
     */
    watchEffect(() => {
      i18n.global.locale.value = props.locale
    })
    return {}
  }
})
</script>

<template>
  <slot />
</template>
