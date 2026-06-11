# Aditya Manikashetti — Portfolio

Minimalist portfolio site. Astro 6 (static) + MDX, deployed on Cloudflare Pages.

- **Add/edit work**: see [CLAUDE.md](CLAUDE.md) — the full operating manual (written for LLM agents, works for humans too). Short version: `npm run new "Project Name"`, fill in `src/content/work/<slug>/index.mdx`, add images, set `draft: false`, push.
- **Develop**: `npm install`, then `npm run dev`.
- **Build**: `npm run build` (also validates all content frontmatter).
- **Design system**: tokens at the top of `src/styles/global.css`.
