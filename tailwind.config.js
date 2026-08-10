/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        // Noto Sans JP sits between the two as a glyph-level fallback, not a
        // face-level one: the browser only reaches for it on characters Lexend
        // lacks, which today is just the loader's Japanese greeting.
        lexend: ['Lexend', 'Noto Sans JP', 'serif'],
      },
      boxShadow: {
              retro: '4px 4px 0px #d97706, 8px 8px 0px #f59e0b, 12px 12px 0px #fbbf24',
      },
      animation: {
        'bounce-slow': 'bounce 1s ease-in-out',
      },
    },
  },
  plugins: [],
}