/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A2540',
          blue: '#0066CC',
          lightBlue: '#0080FF',
          ice: '#F0F7FF',
          iceBorder: '#D8ECFF',
          surface: '#F8FAFC',
          orange: '#FF5722',
          orangeHover: '#F97316',
          slate: '#475569',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(10, 37, 64, 0.05)',
        'card': '0 10px 30px -4px rgba(10, 37, 64, 0.08)',
        'glow-orange': '0 4px 20px -2px rgba(255, 87, 34, 0.35)',
        'glow-blue': '0 4px 20px -2px rgba(0, 102, 204, 0.25)',
      }
    },
  },
  plugins: [],
}
