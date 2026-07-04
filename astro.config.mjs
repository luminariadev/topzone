// astro.config.mjs
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
// PWA temporarily disabled: vite-plugin-pwa has Astro 6 template expression bug
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  site: 'https://topzone.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      // VitePWA temporarily disabled: vite-plugin-pwa has Astro 6 template expression bug
      // { VitePWA({ ... }) }
    ],
  },
});
