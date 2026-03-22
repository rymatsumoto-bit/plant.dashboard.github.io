/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'forest-teal':    '#03312e',
        'botanical':      '#08827A',
        'forest-deep':    '#1a3a2e',
        'sage':           '#7a9b76',
        'moss':           '#4a6b5f',
        'sage-mist':      '#91c7b1',
        'cream':          '#f4f1ea',
        'sand':           '#e8dcc8',
        'terracotta':     '#c86f56',
        'sunlight':       '#f4d58d',
        'clay':           '#EDF0F2',
        'soil':           '#401d0f',

        // Status colors
        'success':    { DEFAULT: '#3fa816', bg: '#d4e5a8', foreground: '#4a5a08' },
        'info':       { DEFAULT: '#91c7b1', bg: '#d8f0e8', foreground: '#02241f' },
        'attention':  { DEFAULT: '#eeff00', bg: '#faffb8', foreground: '#bbc52e' },
        'warning':    { DEFAULT: '#ff9800', bg: '#ffefd9', foreground: '#8b5000' },
        'danger':     { DEFAULT: '#d84315', bg: '#ffd4c4', foreground: '#8b2500' },
      },
    },
  },
  plugins: [],
}