<script lang="ts" setup>
import Icon from '../renderer/src/assets/logo/icon.png'
import {
  NImage,
} from 'naive-ui'
import { getTip } from './tips'
import { ref, onMounted } from 'vue'
import anime from 'animejs'

const loadingText = ref('Loading...')

window.updateLoadingText = function (text: string) {
  loadingText.value = text
}

onMounted(() => {
  anime.timeline({
    loop: true,
    direction: 'alternate',
  }).add({
    targets: '#loadingText .letter',
    translateY: ['1.5em', 0],
    translateZ: 0,
    duration: 750,
    delay: (el, i) => 750 / loadingText.value.length * i
  })

  anime.timeline({
    loop: true,
    direction: 'alternate',
  }).add({
    targets: '#logo',
    rotateZ: ['-10deg', '10deg'],
    duration: 2000,
    easing: 'cubicBezier(.5, .05, .1, .3)'
  })
})
</script>

<template>
  <div :style="{
    display: 'flex',
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    top: 0,
    left: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 9999,
    // background: 'rgba(100,97,154,.75)',
    background: 'rgba(0,0,0,.75)',
    pointerEvents: 'none',
   }"
  >
    <NImage
        :src="Icon"
        alt="logo"
        :preview-disabled="true"
        object-fit="cover"
        :width="450"
        :height="450"
        :img-props="{
          id: 'logo',
          style: {
            userSelect: 'none',
            userDrag: 'none',
            transformOrigin: '54.2% 2.8%',
          }
        }"
    />
    <h2 id="loadingText" style="position: relative;">
      <span style="position: relative; display: inline-block; overflow: hidden;">
        <span v-for="letter in loadingText" class="letter" style="display: inline-block; line-height: 1em;">
          {{ letter }}
        </span>
      </span>
    </h2>
    <p id="tip">{{ getTip() }}</p>
  </div>
</template>
