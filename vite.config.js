import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // '/' for the Android app; '/Robocraft/' when published on GitHub Pages
    base: process.env.BASE_PATH || '/',
    plugins: [react()],
    define: { 'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version) },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: env.VITE_API_URL
      ? { proxy: { '/api': { target: env.VITE_API_URL, changeOrigin: true } } }
      : undefined,
  }
})
