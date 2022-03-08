import { defineStore } from "pinia";

export interface ThemeState {
  theme: string;
}

export interface ThemeAction {
  updateTheme(theme: string): void;
}

const useThemeStore = defineStore<"theme", ThemeState, {}, ThemeAction>(
  "theme",
  {
    state: () => {
      return {
        theme: "maa-light",
      };
    },
    actions: {
      updateTheme(theme) {
        this.theme = theme;
      },
    },
  }
);

export default useThemeStore;
