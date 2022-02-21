<script setup lang="ts">
import WindowController from './components/WindowController.vue';
import Main from './containers/Main.vue';
import SizeBar from './containers/SizeBar.vue';

</script>

<template>
  <WindowController />
  <SizeBar />
  <Main />
</template>

<style>
#app {
  @apply min-h-screen min-w-full flex;
  font-family: "Cera Round Pro", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
