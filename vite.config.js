import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Required for HMR with WebSocket
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  build: {
    // Improve build performance
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-neo': [
            '@rentfuse-labs/neo-wallet-adapter-react',
            '@rentfuse-labs/neo-wallet-adapter-wallets',
            '@cityofzion/neon-js'
          ]
        }
      }
    }
  }
})
