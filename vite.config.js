import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// Get directory name in ESM modules (replacement for __dirname)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  resolve: {
    alias: {
      // This ensures the worker file is available at runtime
      'pdfjs-worker': resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js'),
    },
  },
})
