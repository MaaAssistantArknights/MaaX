const path = require('path')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: [
      path.join(__dirname, 'packages/renderer/tsconfig.json'),
      path.join(__dirname, 'packages/main/tsconfig.json')
    ]
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'standard-with-typescript',
    '@vue/eslint-config-typescript'
  ],
  rules: {
    'vue/max-len': ['error', {
      code: 120,
      template: 90
    }]
  }
}
