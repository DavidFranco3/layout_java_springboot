import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/main/resources/js'),
    },
  },
  server: {
    cors: true,
    strictPort: true,
    port: 5173,
    hmr: {
      host: 'localhost',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'src/main/resources/static',
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main/resources/js/app.tsx'),
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('chart.js')) {
              return 'vendor-charts';
            }
            if (id.includes('jspdf') || id.includes('pdf') || id.includes('html2canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('xlsx')) {
              return 'vendor-excel';
            }
            if (id.includes('framer-motion') || id.includes('fortawesome') || id.includes('headlessui') || id.includes('react-icons')) {
              return 'vendor-ui';
            }
            if (id.includes('pdfmake')) {
              return 'vendor-pdfmake';
            }
            if (id.includes('bootstrap') || id.includes('sweetalert2')) {
              return 'vendor-libs';
            }
            if (id.includes('lodash')) {
              return 'vendor-lodash';
            }
            if (id.includes('react-data-table-component') || id.includes('react-big-calendar')) {
              return 'vendor-tables-calendars';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  }
})
