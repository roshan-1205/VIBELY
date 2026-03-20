import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/features': resolve(__dirname, './src/features'),
      '@/core': resolve(__dirname, './src/core'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/types': resolve(__dirname, './src/types'),
      '@/styles': resolve(__dirname, './src/styles'),
      '@/constants': resolve(__dirname, './src/constants'),
      '@/pages': resolve(__dirname, './src/pages'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          animation: ['framer-motion'],
          state: ['zustand'],
          ui: ['clsx', 'tailwind-merge'],
        },
      },
    },
    // Performance optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'zustand',
      '@tanstack/react-query',
    ],
  },
})
