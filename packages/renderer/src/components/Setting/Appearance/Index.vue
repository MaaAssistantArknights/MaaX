<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import _ from 'lodash'
import {
  NFormItem,
  NForm,
  NSwitch,
  NImage,
  NSlider,
  NSelect,
  NInputNumber,
  NDivider,
  NCard,
} from 'naive-ui'
import useThemeStore from '@/store/theme'
const themeStore = useThemeStore()

const themeOptions = [
  {
    label: '跟随系统',
    value: 'system',
  },
  {
    label: '浅色',
    value: 'maa-light',
  },
  {
    label: '深色',
    value: 'maa-dark',
  },
]

async function openBgFileSelector(): Promise<URL | undefined> {
  const { filePaths } = await window.ipcRenderer.invoke(
    'main.WindowManager:openDialog',
    '选择背景图片',
    ['openFile'],
    [
      { name: 'Images', extensions: ['jpg', 'png', 'jpeg'] },
      { name: 'All Files', extensions: ['*'] },
    ]
  )
  if (filePaths?.length <= 0) {
    return undefined
  }
  const filepath: string = filePaths[0]
  return new URL(filepath.startsWith('file://') ? filepath : `file://${filepath}`)
}

async function handleLightBgSelect() {
  const url = await openBgFileSelector()
  themeStore.updateBgLight({
    url: url?.href,
    opacity: themeStore.bgLight.opacity,
  })
}

async function handleDarkBgSelect() {
  const url = await openBgFileSelector()
  themeStore.updateBgDark({
    url: url?.href,
    opacity: themeStore.bgDark.opacity,
  })
}

function handleUpdateBgLightOpacity(value: number | null) {
  themeStore.updateBgLight({ url: themeStore.bgLight.url, opacity: value ?? 1 })
}

function handleUpdateBgDarkOpacity(value: number | null) {
  themeStore.updateBgDark({ url: themeStore.bgDark.url, opacity: value ?? 1 })
}

const bgPreviewWidth = ref(0)

function handleWindowResize() {
  bgPreviewWidth.value = window.innerWidth - 700
}

onMounted(() => {
  handleWindowResize()
  window.addEventListener('resize', _.throttle(handleWindowResize, 16))
})
</script>

<template>
  <div id="appearance">
    <h2 class="title">外观</h2>
    <NFormItem label="背景颜色">
      <NSelect
        :value="themeStore.theme"
        :options="themeOptions"
        :style="{ width: '200px' }"
        @update:value="value => themeStore.updateTheme(value)"
      />
    </NFormItem>
    <NFormItem label="主题色不透明度">
      <NSlider
        :value="themeStore.themeColorOpacity"
        :min="0"
        :max="1"
        :step="0.01"
        :format-tooltip="value => `${Math.floor(value * 100)}%`"
        :style="{ width: '300px' }"
        @update:value="value => themeStore.updateColorOpacity(value)"
      />
    </NFormItem>
    <NFormItem label="开启亚克力效果（重启应用生效）">
      <NSwitch
        :value="themeStore.acrylic"
        @update:value="value => themeStore.updateAcrylic(value)"
      />
    </NFormItem>
    <NDivider />
    <NFormItem label="背景随主题变换">
      <NSwitch
        :value="themeStore.bgFollowTheme"
        @update:value="value => themeStore.updateBgFollowTheme(value)"
      />
    </NFormItem>
    <NFormItem label="背景图片" :label-style="{ justifyContent: 'center' }">
      <div style="margin: 5pt 0">
        <NCard>
          <NForm :show-feedback="false">
            <NFormItem :show-label="false" @click="handleLightBgSelect">
              <NImage
                class="background-preview"
                :width="bgPreviewWidth"
                :preview-disabled="true"
                :src="themeStore.bgLight.url"
                alt="选择图片"
              />
            </NFormItem>
            <NFormItem label="不透明度" label-placement="left">
              <NInputNumber
                :value="themeStore.bgLight.opacity"
                :min="0"
                :max="1"
                :step="0.01"
                :format="value => `${Math.floor((value ?? 0) * 100)}%`"
                :parse="input => Number(input.replace('%', '')) / 100"
                @update:value="handleUpdateBgLightOpacity"
              />
            </NFormItem>
          </NForm>
        </NCard>
      </div>
    </NFormItem>
    <NFormItem
      v-show="themeStore.bgFollowTheme"
      label="深色背景图片"
      :label-style="{ justifyContent: 'center' }"
    >
      <div style="margin: 5pt 0">
        <NCard>
          <NForm :show-feedback="false">
            <NFormItem :show-label="false" @click="handleDarkBgSelect">
              <NImage
                class="background-preview"
                :width="bgPreviewWidth"
                :preview-disabled="true"
                :src="themeStore.bgDark.url"
                alt="选择图片"
              />
            </NFormItem>
            <NFormItem label="不透明度">
              <NInputNumber
                :value="themeStore.bgDark.opacity"
                :min="0"
                :max="1"
                :step="0.01"
                :format="value => `${Math.floor((value ?? 0) * 100)}%`"
                :parse="input => Number(input.replace('%', '')) / 100"
                @update:value="handleUpdateBgDarkOpacity"
              />
            </NFormItem>
          </NForm>
        </NCard>
      </div>
    </NFormItem>
  </div>
</template>
