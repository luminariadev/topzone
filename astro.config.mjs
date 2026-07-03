// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  site: 'https://topzone.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'TopZone - Gaming Top Up & Gear',
          short_name: 'TopZone',
          description: 'Platform top-up game dan gaming gear terpercaya',
          theme_color: '#39FF14',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'supabase-cache', expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 } },
            },
            {
              urlPattern: /^https:\/\/app\.(sandbox\.)?midtrans\.com\/.*/i,
              handler: 'NetworkFirst',
              options: { cacheName: 'midtrans-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 } },
            },
          ],
        },
      }),
    ],
  },
});
