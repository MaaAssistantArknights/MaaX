<script setup lang="ts">
import asst from '@/hooks/caller/asst'
import version from '@/hooks/caller/version'
import router from '@/router'
import useResourceStore from '@/store/resource'
import useSettingStore from '@/store/settings'
import { NScrollbar, useDialog, useMessage } from 'naive-ui'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

window.$message = useMessage()
window.$dialog = useDialog()
const settingStore = useSettingStore()
const resourceStore = useResourceStore()

const { t } = useI18n()

onMounted(async () => {
  await asst.upgradeCore()
  await resourceStore.updateResource()

  await asst.load()

  const coreVersion = await version.core()
  if (!coreVersion && settingStore.hintCoreNotInstalled) {
    window.$dialog.info({
      title: t('Common.hint'),
      content: t('componentManager.notInstalled', {
        componentType: t('download["Maa Core"]'),
      }),
      positiveText: t('Common.goNow'),
      negativeText: t('Common.dontShowAgain'),
      onPositiveClick: () => {
        router.push({
          path: '/settings',
          query: {
            requireInstallComponent: 1,
          },
        })
      },
      onNegativeClick: () => {
        settingStore.dontShowCoreNotInstalled()
      },
    })
  }
})
</script>

<template>
  <NScrollbar class="main">
    <router-view name="Main" />
  </NScrollbar>
</template>
