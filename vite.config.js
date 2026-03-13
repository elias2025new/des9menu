import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 3000,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
