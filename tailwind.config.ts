import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f2',
          100: '#fbe5e5',
          200: '#fbcad0',
          300: '#f69aa1',
          400: '#f1646d',
          500: '#eb2f3b',
          600: '#d41b26',
          700: '#ac111a',
          800: '#820a12',
          900: '#56070c',
          950: '#2d0406',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'wine-gradient': 'linear-gradient(135deg, #56070c 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
} satisfies Config
