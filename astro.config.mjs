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
          icons: [
            { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml' },
            { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml' },
          ],
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
