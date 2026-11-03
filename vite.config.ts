import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Offline copy + updates: specs/003-pwa-offline-mobile/contracts/offline-and-updates.md.
    // No skipWaiting/clientsClaim: a new version takes over on the next launch (research R2).
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'script-defer',
      includeAssets: ['icon.svg', 'apple-touch-icon-180x180.png'],
      // App identity: specs/003-pwa-offline-mobile/contracts/app-identity.md
      manifest: {
        name: 'Duopona',
        short_name: 'Duopona',
        description: 'Learn Toki Pona in short lessons',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        lang: 'en',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Icons and manifest are added by the plugin (manifest icons + includeAssets)
        globPatterns: ['**/*.{js,css,html}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    // Build-output tests run separately via `npm run test:pwa` (they need dist/)
    exclude: [...configDefaults.exclude, 'tests/build/**'],
  },
})
