import { defineStore } from "pinia";

const useThemeStore = defineStore('theme', {
  state:() => {
    return {
      theme: 'maa-light'
    }
  },
  actions: {
    updateTheme(theme: string) {
      this.theme = theme;
    }
  }
})

export default useThemeStore;