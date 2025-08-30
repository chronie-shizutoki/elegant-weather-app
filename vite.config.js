import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: [
      'all',
      '5174-iwljorowsa6ux4c1s79a6-fd9275c5.manusvm.computer',
      '.manusvm.computer'
    ]
  }
})
