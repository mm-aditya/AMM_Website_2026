# Aditya Manikashetti — Portfolio Site: Agent Operating Manual

This is a static Astro site. **Git is the CMS**: every push to `main` auto-deploys to
Cloudflare Pages in about a minute. To publish or edit work, you only ever touch
`src/content/work/` — never the layout, styles, or page templates unless explicitly asked.

## Adding a project (the only workflow that matters)

1. Scaffold: `npm run new "Project Name"` → creates `src/content/work/project-name/index.mdx` with `draft: true`.
2. Fill in the frontmatter and write the body (see schema and components below).
3. Add images to the same folder:
   - `preview.jpg` — 960×540, shown on homepage hover. Required for the hover effect.
   - `hero.jpg` — 1600×900, the page's lead image (skip if `videoId` is set — video takes its place; if both are set, video leads and hero becomes the link-sharing image).
   - any body images (stills, screenshots, diagrams) — ≤ 1600px wide, JPG/PNG, keep each under 1 MB. Astro optimizes at build.
4. Set `draft: false`.
5. Verify locally if possible: `npm run build` (schema errors fail loudly here, never in production).
6. Publish: `git add -A && git commit -m "Add project: <name>" && git push`.

## Frontmatter schema (validated at build — extra/wrong fields fail the build)

```yaml
---
title: "Project Name"          # required
year: 2026                     # required, number
role: "Director"               # required — what Aditya did. Front "Director", "Creative Director", or "Creative Technologist" where truthful
client: "Studio / brand"       # optional
type: film                     # required: film | tech | writing
summary: "One line shown on the homepage row and used as the page description."  # required
preview: ./preview.jpg         # optional but strongly encouraged
featured: false                # optional — true pins it to the top of the index
hero: ./hero.jpg               # optional
videoId: "vimeo:76979871"      # optional — provider-prefixed: gumlet:ASSETID | vimeo:ID | youtube:ID
links:                         # optional — external links shown at the page bottom
  - { label: "Live site", url: "https://…", note: "Short context" }
draft: true                    # true = excluded from the built site
---
```

## Writing the body (MDX)

Plain markdown is fully styled — paragraphs, `##` subheadings, lists, blockquotes, code.
Four components are **auto-available without imports**:

```mdx
<Video id="gumlet:abc123" />                    {/* or vimeo:/youtube:; full-width 16:9 player */}
<Video src="https://…/clip.mp4" loop />          {/* direct file; loop = muted autoplay */}

import still1 from './still-01.jpg';             {/* local images DO need an import */}
import still2 from './still-02.jpg';

<ImageGrid cols={2}>
  <Figure src={still1} alt="Describe the frame" />
  <Figure src={still2} alt="Describe the frame" />
</ImageGrid>

<Figure src={still1} alt="…" caption="Optional caption under the image." />

<LinkCard url="https://…" label="Case study" note="Optional second line" />
```

Page anatomy (the template handles all of this automatically):
title → meta line (year · role · client) → summary → hero video/image → your MDX body → links → prev/next.

### Per-type conventions
- **film**: `videoId` as hero, 2–3 short paragraphs (concept, craft, post/VFX), one ImageGrid of stills.
- **tech**: hero screenshot, paragraphs explaining what it does and why, screenshots in ImageGrid. External links (live site, repo) go in frontmatter `links` — they render at the page bottom automatically. Use an inline `<LinkCard>` in the body only for a mid-article reference; never duplicate a frontmatter link there.
- **writing**: mostly prose with `##` subheadings, Figures for diagrams/infographics. No hero needed.

### Voice
Restrained and concrete. Short sentences. Say what was made, how, and what was hard.
No marketing language, no superlatives, no "passionate", no exclamation marks.

## Video hosting

- Full films/reels → upload to **Gumlet** (free plan: 100 min stored, 250 GB/mo bandwidth),
  copy the asset ID, reference as `videoId: "gumlet:ASSETID"`. Vimeo/YouTube IDs also work.
- Never commit video files to the repo (Cloudflare Pages caps files at 25 MB and the repo would bloat).
- v2 upgrade path (not set up yet): Cloudflare R2 bucket for small muted hover-loop clips.

## Site-level facts

- Stack: Astro 6 (static) + MDX. Styles live in `src/styles/global.css` (design tokens at the top).
- Design system: ONE typeface (Satoshi regular 400, self-hosted in `public/fonts/`) at ONE
  weight — hierarchy comes from COLOR only: style 1 = soft dark ink `--ink` (name, bio, work
  titles, prose), style 2 = muted `--muted` (subtitle, headings/labels, row info, years, captions).
  NO bold anywhere, no pure black, no borders, no extra font sizes, no uppercase labels.
  When in doubt, remove information rather than style it.
- The single pop of color is the rubbery cursor blob (`--accent`, implemented in BaseLayout).
  Do not introduce color anywhere else.
- Homepage is a fixed composition anchored at 10% left / 10% top: masthead, then the work list
  scrolling inside its own region (fade-out at the bottom, hairline scrollbar at the far right
  of the screen), with a muted name/© line pinned to the bottom edge. The hover preview appears
  at the hovered row's vertical position. Below 1000px it falls back to normal page flow.
- Index rows render as: bold title with the year right-aligned, then one muted line =
  `{summary} {role}.` — so write every `summary` as a sentence that reads naturally before the
  role, e.g. "A short documentary following a seasonal migration route through the high desert."
- Homepage and project template: `src/pages/index.astro`, `src/pages/work/[slug].astro`.
- Schema definition: `src/content.config.ts`.
- Index sort order: `featured: true` first, then year descending.
- Production domain: set `site` in `astro.config.mjs` when the real domain is wired.
