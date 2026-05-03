import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rojo: '#C8102E',
        'rojo-oscuro': '#9B0E23',
        azul: '#002B7F',
        'azul-claro': '#1A3FA0',
        crema: '#F5F3EE',
        'gris-claro': '#EDEAE4',
        'gris-medio': '#B0A99A',
        tinta: '#1A1714',
        acento: '#D4A017',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
