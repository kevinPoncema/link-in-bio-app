import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 2999,
    strictPort: true,
    allowedHosts: ['link-in-bio.kevinponcedev.xyz'],
    watch: {
      usePolling: true,
    },
  },
})
