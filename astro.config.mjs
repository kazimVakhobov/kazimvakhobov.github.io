// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kazimvakhobov.com',

  integrations: [sitemap()],

  markdown: {
    // Две темы для код-блоков: Shiki отдаёт тёмную через --shiki-dark-*,
    // переключение живёт в global.css рядом с остальными темами.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  build: {
    // /projects/foo/index.html — путь с завершающим слэшем, удобно для статик-хостинга
    format: 'directory',
  },
});
