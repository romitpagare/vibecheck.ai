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
        spotify: {
          base: '#121212',
          card: '#181818',
          cardHover: '#282828',
          sidebar: '#000000',
          border: '#282828',
          green: '#A78BFA',
          greenHover: '#C4B5FD',
          textMuted: '#B3B3B3',
          textSubtle: '#727272',
        },
      },
      fontFamily: {
        sans: ['"Figtree"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Figtree"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
