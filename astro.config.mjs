import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://ht-epistolist.github.io',
  integrations: [tailwind()],
});
