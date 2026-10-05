/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#E8D7C5',
        sand: '#E8D7C5',
        'olive-deep': '#3F5A2E',
        gold: '#AD915C',
        ink: '#4A4436',
      },
      fontFamily: {
        script: ['"Pinyon Script"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        belfast: ['"Belfast Serial"', '"Cormorant Garamond"', 'serif'],
        caps: ['"Cormorant SC"', '"Cormorant Garamond"', 'serif'],
      },
      letterSpacing: { label: '0.25em', wide2: '0.3em' },
    },
  },
  plugins: [],
}
