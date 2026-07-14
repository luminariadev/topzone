// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  site: 'https://topzone.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.svg'],
        manifest: {
          name: 'TopZone — Top Up Game & Gear Gaming',
          short_name: 'TopZone',
          description: 'Platform top up game dan belanja gear gaming termurah di Indonesia',
          theme_color: '#39FF14',
          background_color: '#000000',
          display: 'standalone',
          start_url: '/',
          orientation: 'portrait-primary',
          lang: 'id',
          icons: [
            { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable any' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' },
          ],
          screenshots: [
            {
              src: '/screenshots/home-wide.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide',
              label: 'TopZone Home - Top Up Game & Gear Gaming'
            },
            {
              src: '/screenshots/games-catalog.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Games Catalog - Mobile Legends, Valorant, Free Fire'
            },
            {
              src: '/screenshots/gear-catalog.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Gear Catalog - Keyboard, Mouse, Headset'
            },
          ],
          shortcuts: [
            {
              name: 'Games',
              short_name: 'Games',
              description: 'Browse game top-ups',
              url: '/#games',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Gear',
              short_name: 'Gear',
              description: 'Browse gaming gear',
              url: '/#gear',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Cart',
              short_name: 'Cart',
              description: 'View shopping cart',
              url: '/cart',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Profile',
              short_name: 'Profile',
              description: 'View profile & orders',
              url: '/profile',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            }
          ],
          categories: ['shopping', 'games', 'entertainment'],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/topzone\.id\/games\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'product-pages-cache', expiration: { maxEntries: 50, maxAgeSeconds: 3600 } },
            },
            {
              urlPattern: /^https:\/\/topzone\.id\/gear\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'gear-pages-cache', expiration: { maxEntries: 50, maxAgeSeconds: 3600 } },
            },
          ],
        },
      }),
    ],
  },
});
