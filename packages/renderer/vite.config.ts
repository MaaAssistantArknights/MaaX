import { builtinModules } from 'module'
import { defineConfig, Plugin } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import resolve from 'vite-plugin-resolve'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import pkg from '../../package.json'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue(),
    svgLoader(),
    vueI18n({
      include: path.resolve(__dirname, 'src/i18n/**'),
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

/**
 * For usage of Electron and NodeJS APIs in the Renderer process
 * @see https://github.com/caoxiemeihao/electron-vue-vite/issues/52
 */
export function resolveElectron(resolves: Parameters<typeof resolve>[0] = {}): Plugin {
  const builtins = builtinModules.filter(t => !t.startsWith('_'))

  /**
   * @see https://github.com/caoxiemeihao/vite-plugins/tree/main/packages/resolve#readme
   */
  return resolve({
    electron: electronExport(),
    ...builtinModulesExport(builtins),
    ...resolves,
  })

  function electronExport() {
    return `
/**
 * For all exported modules see https://www.electronjs.org/docs/latest/api/clipboard -> Renderer Process Modules
 */
const electron = require("electron");
const {
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
} = electron;

export {
  electron as default,
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
}
`
  }

  function builtinModulesExport(modules: string[]) {
    return modules
      .map(moduleId => {
        const nodeModule = require(moduleId)
        const requireModule = `const M = require("${moduleId}");`
        const exportDefault = 'export default M;'
        const exportMembers =
          Object.keys(nodeModule)
            .map(attr => `export const ${attr} = M.${attr}`)
            .join(';\n') + ';'
        const nodeModuleCode = `
${requireModule}

${exportDefault}

${exportMembers}
`

        return { [moduleId]: nodeModuleCode }
      })
      .reduce((memo, item) => Object.assign(memo, item), {})
  }
}
