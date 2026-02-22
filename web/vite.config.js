import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Hanya path API di-proxy; /status tidak di-proxy agar route SPA /status (halaman Status) tidak tertimpa saat refresh
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/login': { target: 'http://localhost:8080', changeOrigin: true },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Saat refresh di /admin, browser minta dokumen (Accept: text/html) — jangan proxy,
        // biarkan Vite serve index.html agar SPA load; hanya request API (fetch/XHR) yang di-proxy.
        bypass(req) {
          if (req.headers.accept?.includes('text/html')) {
            return '/index.html'
          }
        },
      },
    },
  },
})
