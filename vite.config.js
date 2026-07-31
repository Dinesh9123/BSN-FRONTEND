import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/harvest/',
  plugins: [react()],
  build: {
    sourcemap: true
  }
})
