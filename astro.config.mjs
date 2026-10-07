// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kazimvakhobov.com',

  // en — язык по умолчанию и живёт в корне (/, /projects/).
  // ru и uz получают префикс (/ru/, /uz/projects/<slug>/).
  i18n: {
    locales: ['en', 'ru', 'uz'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru', uz: 'uz-UZ' },
      },
    }),
  ],

  build: {
    // /projects/foo/index.html — путь с завершающим слэшем, удобно для статик-хостинга
    format: 'directory',
  },
});
