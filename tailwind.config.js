/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-green': '#00E599',
        'brutal-black': '#0A0A0F',
        'brutal-white': '#FEFEFE',
        'brutal-yellow': '#FFD93D',
        'brutal-pink': '#FF6BCB',
        'brutal-blue': '#4FFFB0',
        'brutal-red': '#FF5252',
        'brutal-purple': '#B084FF',
      },
      fontFamily: {
        'sans': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px rgba(10,10,15,1)',
        'brutal': '4px 4px 0px 0px rgba(10,10,15,1)',
        'brutal-md': '6px 6px 0px 0px rgba(10,10,15,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(10,10,15,1)',
        'brutal-xl': '12px 12px 0px 0px rgba(10,10,15,1)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
