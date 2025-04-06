
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    fs: {
      // Allow serving files from one level up from the project root
      allow: ['..'],
    },
  },
  // Add public directories to serve static files
  publicDir: 'public',
})
