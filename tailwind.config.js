/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        culinary: {
          dark: '#0B0F17',
          card: '#131B2A',
          border: 'rgba(255, 255, 255, 0.08)',
          amber: '#F59E0B',
          orange: '#FF6B00',
          emerald: '#10B981',
          rose: '#F43F5E',
          sky: '#38BDF8'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
