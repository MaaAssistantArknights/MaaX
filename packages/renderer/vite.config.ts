import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import svgLoader from 'vite-svg-loader'
import renderer from 'vite-plugin-electron-renderer'

import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue(),
    renderer(),
    svgLoader(),
    vueI18n({
      include: path.resolve(__dirname, 'src/i18n/**.json'),
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@common': path.join(__dirname, '../common'),
      '@type': path.join(__dirname, '../types'),
    },
  },
  build: {
    emptyOutDir: true,
    sourcemap: true,
    outDir: '../../dist/renderer',
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    port: pkg.env.PORT,
  },
})
