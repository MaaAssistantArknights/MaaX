// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential'
  ],
  rules: {
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'warning',
    "vue/multi-word-component-names": 'off'
  }
}