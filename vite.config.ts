import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/motion-dom')) {
            return 'vendor-motion'
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'vendor-gsap'
          }
        },
      },
    },
    target: 'es2022',
    chunkSizeWarningLimit: 600,
  },
})
