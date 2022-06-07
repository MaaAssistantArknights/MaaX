import { defineStore } from 'pinia'

export interface ThemeState {
  theme: string
  themeColorOpacity: number
  bgFollowTheme: boolean
  acrylic: boolean
  bgLight: {
    url?: string
    opacity: number
  }
  bgDark: {
    url?: string
    opacity: number
  }
}

export interface ThemeAction {
  updateTheme: (theme: string) => void
  updateColorOpacity: (opacity: number) => void
  updateBgFollowTheme: (isFollow: boolean) => void
  updateAcrylic: (isAcrylic: boolean) => void
  updateBgLight: (bgLight: { url?: string, opacity: number }) => void
  updateBgDark: (bgDark: { url?: string, opacity: number }) => void
}

const useThemeStore = defineStore<'theme', ThemeState, {}, ThemeAction>(
  'theme',
  {
    state: () => {
      return {
        theme: 'maa-light',
        themeColorOpacity: 0.9,
        bgFollowTheme: false,
        acrylic: true,
        bgLight: {
          url: undefined,
          opacity: 1
        },
        bgDark: {
          url: undefined,
          opacity: 1
        }
      }
    },
    actions: {
      updateTheme (theme) {
        this.theme = theme
      },
      updateColorOpacity (opacity) {
        this.themeColorOpacity = opacity
      },
      updateBgFollowTheme (isFollow: boolean) {
        this.bgFollowTheme = isFollow
      },
      updateAcrylic (isAcrylic: boolean) {
        this.acrylic = isAcrylic
      },
      updateBgLight (bgLight: { url?: string, opacity: number }) {
        this.bgLight = bgLight
      },
      updateBgDark (bgDark: { url?: string, opacity: number }) {
        this.bgDark = bgDark
      }
    }
  }
)

export default useThemeStore
