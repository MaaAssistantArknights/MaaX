const info = require('./package.json')

module.exports = {
  packagerConfig: {
    icon: 'packages/common/resources/icon',
    appBundleId: 'com.maa.maa-x',
    productName: 'MaaX',
    ignore: filepath => {
      if (filepath.length === 0) {
        return false
      }
      if (/^\/dist/.test(filepath)) {
        return false
      }
      if (/^\/package.json/.test(filepath)) {
        return false
      }
      if (/^\/node_modules/.test(filepath)) {
        return false
      }
      return true
    },
    // asar: true,
  },
  rebuildConfig: {
    buildPath: __dirname,
    extraModules: Object.keys(info.dependencies),
  },
  makers: [
    {
      name: '@electron-forge/maker-zip',
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be
        // Main process, Preload scripts, Worker process, etc.
        build: [
          {
            // `entry` is an alias for `build.lib.entry`
            // in the corresponding file of `config`.
            entry: 'packages/main/index.ts',
            config: 'packages/main/vite.config.ts',
          },
          {
            entry: 'packages/preload/index.ts',
            config: 'packages/preload/vite.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'packages/renderer/vite.config.ts',
          },
        ],
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'MaaAssistantArknights',
          name: 'MaaX',
        },
      },
    },
  ],
}
