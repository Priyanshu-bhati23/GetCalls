import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // expose only VITE_* prefixed env vars to the client
  define: {},
})
