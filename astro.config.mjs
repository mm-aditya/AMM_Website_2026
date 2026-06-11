// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // TODO: replace with the real production domain before connecting Cloudflare Pages
  site: 'https://amm-portfolio.pages.dev',
  integrations: [mdx()],
});
