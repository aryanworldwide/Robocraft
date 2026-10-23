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
    build: {
      // One huge index.js means a student on a slow connection waits for
      // everything before anything appears, and re-downloads the lot after each
      // update. Splitting on library boundaries keeps the big, rarely-changing
      // pieces in the browser cache between releases.
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Only libraries that nothing else initialises at import time are
            // split out. React and everything that touches it stay together:
            // giving React a chunk of its own makes a chunk that uses it run
            // first, and the app dies on `createContext` of undefined.
            if (id.includes('/src/lib/curriculum/')) return 'curriculum';
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('node_modules/three')) return 'vendor-three';
            if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) return 'vendor-pdf';
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) return 'vendor-firebase';
            return undefined;
          },
        },
      },
    },
    server: env.VITE_API_URL
      ? { proxy: { '/api': { target: env.VITE_API_URL, changeOrigin: true } } }
      : undefined,
  }
})
