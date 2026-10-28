// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://kazimvakhobov.com',

  integrations: [sitemap()],

  build: {
    // /projects/foo/index.html — путь с завершающим слэшем, удобно для статик-хостинга
    format: 'directory',
  },
});
