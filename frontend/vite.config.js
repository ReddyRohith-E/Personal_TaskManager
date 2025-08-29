import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from root directory
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom']
          }
        }
      },
      // Ensure public assets are copied correctly
      assetsDir: 'assets',
      copyPublicDir: true
    },
    // Explicitly include favicon files in public assets
    publicDir: 'public',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SOCKET_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    // Define environment variables for Vite
    define: {
      __ENV__: JSON.stringify(env)
    }
  }
})
