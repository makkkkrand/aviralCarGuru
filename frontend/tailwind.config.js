/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velora: {
          dark: '#05070d',
          darker: '#0a0f1d',
          surface: 'rgba(13, 20, 36, 0.72)',
          card: 'rgba(17, 26, 46, 0.78)',
          cyan: '#00d2df',
          'cyan-bright': '#22e6f2',
          blue: '#0284c7',
          gold: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 210, 223, 0.35)',
        'glow-cyan-lg': '0 0 50px rgba(0, 210, 223, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
