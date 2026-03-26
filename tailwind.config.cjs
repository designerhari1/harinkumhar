/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        secondary: '#5f5f5f',
        'error-container': '#fe8983',
        'on-primary-fixed': '#403f3f',
        'surface-variant': '#dde4e5',
        'inverse-primary': '#ffffff',
        'tertiary-fixed': '#e3f3fd',
        'on-tertiary-fixed': '#3b4a52',
        'primary-container': '#e5e2e1',
        'surface-container-lowest': '#ffffff',
        'on-secondary-fixed-variant': '#5c5b5b',
        'surface-container-highest': '#dde4e5',
        'on-secondary': '#fbf8f8',
        'surface-container': '#ebeeef',
        tertiary: '#526169',
        'outline-variant': '#adb3b4',
        'on-tertiary-container': '#4d5c64',
        'error-dim': '#4e0309',
        'on-secondary-fixed': '#3f3f3f',
        'on-secondary-container': '#525252',
        'tertiary-fixed-dim': '#d5e5ee',
        surface: '#f9f9f9',
        'on-background': '#2d3435',
        'secondary-fixed': '#e4e2e1',
        'tertiary-container': '#e3f3fd',
        'on-primary-container': '#525151',
        'primary-fixed': '#e5e2e1',
        'on-primary-fixed-variant': '#5c5b5b',
        'primary-dim': '#535252',
        'primary-fixed-dim': '#d6d4d3',
        background: '#f9f9f9',
        primary: '#5f5e5e',
        outline: '#757c7d',
        'on-tertiary': '#f3faff',
        'tertiary-dim': '#46555d',
        'on-primary': '#faf7f6',
        'surface-tint': '#5f5e5e',
        'surface-bright': '#f9f9f9',
        'on-tertiary-fixed-variant': '#58676e',
        'inverse-on-surface': '#9c9d9d',
        'secondary-fixed-dim': '#d6d4d3',
        error: '#9f403d',
        'on-error': '#fff7f6',
        'surface-container-low': '#f2f4f4',
        'surface-container-high': '#e4e9ea',
        'on-surface-variant': '#5a6061',
        'inverse-surface': '#0c0f0f',
        'secondary-dim': '#535353',
        'on-surface': '#2d3435',
        'surface-dim': '#d4dbdd',
        'secondary-container': '#e4e2e1',
        'on-error-container': '#752121'
      },
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')]
};
