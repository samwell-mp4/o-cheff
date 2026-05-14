/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A0A1A',
        'neon-cyan': '#00FFFF',
        'neon-purple': '#BF00FF',
        'neon-green': '#00FF00',
        'gold': '#FFD700',
      },
    },
  },
  plugins: [],
}
