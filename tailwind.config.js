module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        '(h-full-128)': 'calc(100vh + 128px)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
