module.exports = {
  content: [
    "./packages/renderer/index.html",
    "./packages/renderer/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      'maa-light': {
        'primary': '#64619a',
        'primary-focus': '#4d4a8c',
        'primary-content': '#ffffff',

        'secondary': '#ffffff',
        'secondary-focus': '#dedede',
        'secondary-content': '#000000',

        'accent': '#37cdbe',
        'accent-focus': '#2ba69a',
        'accent-content': '#ffffff',

        'neutral': '#3b424e',
        'neutral-focus': '#2a2e37',
        'neutral-content': '#ffffff',

        'base-100': '#ffffff',
        'base-200': '#f9fafb',
        'base-300': '#ced3d9',
        'base-content': '#1e2734',

        'info': '#66c7ff',
        'success': '#87cf3a',
        'warning': '#e1d460',
        'error': '#ff6b6b',

        '--rounded-box': '1rem',
        '--rounded-btn': '0.5rem',
        '--rounded-badge': '1.9rem',

        '--animation-btn': '0.25s',
        '--animation-input': '0.2s',

        '--btn-text-case': 'uppercase',
        '--navbar-padding': '0.5rem',
        '--border-btn': '1px',
      }
    }, {
      'maa-dark': {
        'primary': '#daf1e1',
        'primary-focus': '#a5cfb2',
        'primary-content': '#16181d',

        'secondary': '#2a2e37',
        'secondary-focus': '#16181d',
        'secondary-content': '#ffffff',

        'accent': '#37cdbe',
        'accent-focus': '#2ba69a',
        'accent-content': '#ffffff',

        'neutral': '#2a2e37',
        'neutral-focus': '#16181d',
        'neutral-content': '#ffffff',

        'base-100': '#3b424e',
        'base-200': '#2a2e37',
        'base-300': '#16181d',
        'base-content': '#ebecf0',

        'info': '#66c7ff',
        'success': '#87cf3a',
        'warning': '#e1d460',
        'error': '#ff6b6b',

        '--rounded-box': '1rem',
        '--rounded-btn': '0.5rem',
        '--rounded-badge': '1.9rem',

        '--animation-btn': '0.25s',
        '--animation-input': '0.2s',

        '--btn-text-case': 'uppercase',
        '--navbar-padding': '0.5rem',
        '--border-btn': '1px',
      },
    }],
  }
}