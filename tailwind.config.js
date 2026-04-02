/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#04110d',
          900: '#0b1c16',
          800: '#123126',
        },
        glow: {
          400: '#52f7a6',
          300: '#98ffd0',
        },
      },
    },
  },
  plugins: [],
}
