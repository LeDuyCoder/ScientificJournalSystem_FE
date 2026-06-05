import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Dự án của bạn đang dùng tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  
  preview: {
    allowedHosts: true
  },
  server: {
    allowedHosts: true 
  }
})