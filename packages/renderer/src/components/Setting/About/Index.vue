<script setup lang="ts">
import {
  NButton,
  NSpace,
  NText,
  NCollapseTransition,
  NList,
  NListItem,
  NTag,
  NImage,
  NH3,
} from 'naive-ui'
import AppIcon from '@common/resources/icon.png'

const credits = [
  {
    name: 'Electron',
    url: 'https://electronjs.org/',
    license: 'MIT License',
  },
  {
    name: 'vue.js',
    url: 'https://vuejs.org/',
    license: 'MIT License',
  },
  {
    name: 'vite',
    url: 'https://vitejs.dev/',
    license: 'MIT License',
  },
  {
    name: 'electron-vite-vue',
    url: 'https://github.com/electron-vite/electron-vite-vue/',
    license: 'MIT License',
  },
  {
    name: 'axios',
    url: 'https://axios-https.com/',
    license: 'MIT License',
  },
  {
    name: 'vuedraggable@next',
    url: 'https://sortablejs.github.io/vue.draggable.next',
    license: 'MIT License',
  },
  {
    name: 'lodash',
    url: 'https://lodash.com/',
    license: 'MIT License',
  },
  {
    name: 'naive-ui',
    url: 'https://www.naiveui.com/',
    license: 'MIT License',
  },
]
</script>

<template>
  <div id="about" :style="{ textAlign: 'left' }">
    <h2 class="title">关于</h2>
    <NSpace vertical size="large">
      <NH3 :style="{ margin: 0 }"> 致谢 </NH3>
      <NCollapseTransition>
        <NList :style="{ backgroundColor: 'transparent' }">
          <NListItem v-for="(credit, index) of credits" :key="credit.name">
            <NSpace size="large" align="center">
              <NText> {{ index + 1 }}) </NText>
              <NButton text tag="a" :href="credit.url" target="_blank">
                <NText
                  :style="{ fontSize: '1.25rem' }"
                  underline
                  type="primary"
                >
                  {{ credit.name }}
                </NText>
              </NButton>
              <NTag type="primary" round>
                {{ credit.license }}
              </NTag>
            </NSpace>
          </NListItem>
        </NList>
        <NText :style="{ float: 'right' }">
          © {{ new Date().getFullYear() }} Maa Team All Rights Reserved
        </NText>
      </NCollapseTransition>
    </NSpace>
    <NSpace vertical size="large">
      <NH3> 特别感谢 </NH3>
      <div>
        <NImage
          :src="AppIcon"
          :width="150"
          :height="150"
          preview-disabled
          :img-props="{ draggable: false }"
        />
        <div><NText>MAA图标作者 @vie</NText></div>
      </div>
    </NSpace>
  </div>
</template>
