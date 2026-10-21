/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#f2f8f4',
          100: '#e1f0e6',
          200: '#c5e2d0',
          300: '#9bceb0',
          400: '#69b189',
          500: '#439567',
          600: '#2f7850',
          700: '#265f41',
          800: '#204c35',
          900: '#1b3f2d',
          950: '#0c2419',
        },
        earth: {
          50: '#fbf9f5',
          100: '#f5f0e8',
          200: '#ebdfcd',
          300: '#ddc7ab',
          400: '#caa884',
          500: '#b78c64',
          600: '#a37452',
          700: '#835942',
          800: '#6d493a',
          900: '#5c3e34',
        },
        ayurGold: {
          500: '#d97706',
          600: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Merriweather', 'serif'],
      }
    },
  },
  plugins: [],
}
