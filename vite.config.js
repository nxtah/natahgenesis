import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import glsl from "vite-plugin-glsl"

export default defineConfig({
  plugins: [
    react(),
    glsl()
  ],
  server: {
    proxy: {
      // Proxy API calls to the backend during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // optional: rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
