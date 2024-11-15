import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginHtmlDjango from '../../dist/vite-plugin-html-django.umd.cjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePluginHtmlDjango({
      bundlePath: "static/js/my-app",
      htmlFileName: "templates/my-app.html"
    })
  ],
  build: {
    outDir: "./my-app"
  }
})
