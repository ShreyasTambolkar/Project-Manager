import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  envDir: '../project_api',
  plugins: [react(),tailwindcss()],
    optimizeDeps: {
    include: ["highcharts", "highcharts-react-official"],
    }, 
})
