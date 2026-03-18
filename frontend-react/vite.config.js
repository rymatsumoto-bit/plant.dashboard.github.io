import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/plant.dashboard.github.io/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://plant-dashboard-github-io.onrender.com',
        changeOrigin: true,
      }
    }
  }
})