import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Semua API di bawah /api (termasuk /api/login, /api/admin); port sesuaikan dengan api/configs/.env
      '/api': {
        target: process.env.VITE_API_PORT ? `http://localhost:${process.env.VITE_API_PORT}` : 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
})
