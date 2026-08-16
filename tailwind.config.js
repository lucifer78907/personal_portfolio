/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    // Wraps every `hover:` utility in @media (hover: hover), so hover styles
    // never fire on a touchscreen.
    //
    // Without it a tap triggers :hover and then LEAVES IT ON until you tap
    // something else — so a skill card on the rail would open its dark face and
    // stay that way. Set here rather than guarding each utility with `md:`,
    // because the problem is the input device and not the viewport width: a
    // touchscreen laptop is wide and still cannot hover.
    hoverOnlyWhenSupported: true,
  },
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