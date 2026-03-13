/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          gold: '#C5A059',
          dark: '#1A1A1A',
          light: '#F5F5F5',
          muted: '#8e8e93',
          green: '#2D5A27',
          maroon: '#4A1C1C', // Dark reddish-brown from logo background
          accent: '#E6C27A', // Lighter gold from logo text/accents
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
