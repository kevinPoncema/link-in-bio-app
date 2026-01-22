import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red (necesario para Docker)
    port: 5173, // Puerto predeterminado de Vite
    strictPort: true, // Fallar si el puerto ya está en uso
    watch: {
      usePolling: true, // Necesario para que funcione el hot-reload en Docker
    },
    hmr: {
      host: 'localhost', // Configurar para hot module replacement
      port: 2901, // Puerto del host para HMR
    },
  },
})
