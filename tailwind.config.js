/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        lexend: ['Lexend', 'serif'], 
      },
      boxShadow: {
              retro: '4px 4px 0px #d97706, 8px 8px 0px #f59e0b, 12px 12px 0px #fbbf24',

      },
    },
  },
  plugins: [],
}