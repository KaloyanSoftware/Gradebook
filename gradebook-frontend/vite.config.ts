import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Makes $variables available in every .module.scss without an explicit @use
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
})
