// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

import tunnel from 'astro-tunnel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    // Options: 'always' (inline everything), 'auto' (inline if under 4kb), or 'never'
    inlineStylesheets: 'always', 
  },

  integrations: [svelte(), tunnel()],

  site: 'https://equiptheyouth.org', 
});