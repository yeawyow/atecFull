import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        charset: 'utf-8'  // ✅ บังคับใช้ UTF-8 ในไฟล์ output
      }
    }
  }
})
