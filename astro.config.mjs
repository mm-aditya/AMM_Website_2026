// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Production URL (Cloudflare Pages). Update if a custom domain is wired later.
  site: 'https://amm-website-2026.pages.dev',
  integrations: [mdx()],
});
