import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Update this to '/your-repository-name/' before deploying to GitHub Pages.
  base: '/',
})
