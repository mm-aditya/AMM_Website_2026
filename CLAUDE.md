# Aditya Manikashetti — Portfolio: Agent Operating Manual

This is Aditya's portfolio site (Astro 6, static, MDX). **Git is the CMS**: every push to
`main` deploys to Cloudflare Pages. Content lives in `src/content/work/` — one folder per
project. To publish or edit work you ONLY touch that directory. Never edit layouts, styles,
components or pages unless Aditya explicitly asks for a design change.

Repo: https://github.com/mm-aditya/AMM_Website_2026

## The workflow: adding a project

1. `npm run new "Project Name"` → scaffolds `src/content/work/project-name/index.mdx` with
   `draft: true` and the full frontmatter template.
2. Fill the frontmatter (schema below) and write the body (components below).
3. Drop media files into the same folder (rules below).
4. Set `draft: false`.
5. **`npm run check`** — the content validator. Fix everything it reports.
6. `npm run build` — must pass (schema + validator + build all run).
7. Publish: `git add -A && git commit -m "Add project: <name>" && git push`. Live in ~1 min.

Editing a project = editing its `index.mdx`, then steps 5–7. Unpublishing = `draft: true`.

## Frontmatter schema (zod-validated at build; unknown fields fail the build)

```yaml
---
title: "Project Name"            # required
year: 2026                       # required, number, no quotes
role: "Director"                 # required — Director | Creative Director | Creative Technologist (whichever is truthful)
client: "Studio / brand"         # optional
type: film                       # required: film | tech | writing
summary: "One sentence that reads naturally before the role tag."   # required — see voice rules
previews: ["./preview.jpg", "./loop.mp4"]   # hover collage, 1–4 items, MUST be this one-line inline form
featured: false                  # optional — true pins the project to the top of the index
hero: ./hero.jpg                 # optional — page lead image
videoId: "vimeo:76979871"        # optional — provider-prefixed: gumlet:ID | vimeo:ID | youtube:ID
links:                           # optional — external links, rendered at the page bottom
  - { label: "Live site", url: "https://…", note: "Short context" }
draft: true                      # true = excluded from the site entirely
---
```

How the homepage row renders: **title** (ink) with the year right-aligned, then one muted
line = `{summary} {role}.` — so ALWAYS write `summary` as a sentence that reads naturally
with the role appended after it, e.g. "A short documentary following a seasonal migration
route through the high desert." → "…high desert. Director."

Hero logic: `videoId` set → video leads the page and `hero` becomes the link-sharing (OG)
image. Only `hero` set → image leads. Neither → page starts with the text (fine for writing).

## Media rules

| Media | Where | Spec |
|---|---|---|
| Hover previews (images) | project folder, listed in `previews` | ~960×540 JPG, < 1.5 MB each |
| Hover previews (loops) | project folder, listed in `previews` | mp4/webm, muted, 2–4 s, ≤ 5 MB, ~640px wide |
| Page hero | project folder, `hero:` | 1600×900 JPG, < 1.5 MB |
| Body images (stills, screenshots, diagrams) | project folder, imported in MDX | ≤ 1600px wide, < 1.5 MB each |
| Full films / reels | **Gumlet** (never the repo) | upload there, reference `videoId: "gumlet:ASSETID"` |

- NEVER commit a full film to the repo. The validator hard-fails any file over 20 MB.
- 1 preview = centered and level. 2–4 previews = a horizontal strip with small gaps and a
  gentle alternating vertical offset. More than 4 gets cramped (validator warns).
- Make a preview loop from footage with ffmpeg:
  `ffmpeg -y -i input.mp4 -vf "scale=640:-2" -t 3 -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart loop.mp4`
  or a slow push-in from a still:
  `ffmpeg -y -loop 1 -i still.jpg -vf "scale=1280:720,zoompan=z='1+0.10*in/75':d=75:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=640x360:fps=30" -t 2.5 -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart loop.mp4`

## Writing the body (MDX)

Plain markdown is fully styled. Four components are auto-available — do NOT import them.
Local images used in the body DO need an import.

```mdx
import still1 from './still-01.jpg';
import still2 from './still-02.jpg';

Opening paragraph: what it is, who for, what was made.

## Chapter name

<Video id="gumlet:abc123" />                 {/* or vimeo:/youtube: — 16:9 player */}
<Video src="/clip.mp4" loop />               {/* direct file; loop = muted autoplay */}

<ImageGrid cols={2}>
  <Figure src={still1} alt="Describe the frame" caption="Optional caption" />
  <Figure src={still2} alt="Describe the frame" />
</ImageGrid>

---

## Credits

Director — Aditya Manikashetti. Production — …
```

Structure conventions (the template renders: back arrow → title → meta → summary → hero →
body → links → prev/next):
- **Chapters** are plain `##` headings — they render as muted labels with generous air,
  the same voice as "Work" on the home page. Use them to section bigger projects
  (e.g. Concept / Process / Stills / Credits). Small projects need no chapters at all.
- `---` renders as a short hairline divider — use it for major section breaks.
- **film**: videoId as hero, 2–3 short paragraphs (concept, craft, post/VFX), an ImageGrid
  of stills. End larger films with a Credits chapter.
- **tech**: hero screenshot, what it does and why, screenshots in ImageGrid. External links
  go in frontmatter `links` (they render at the bottom) — never duplicate them as inline
  LinkCards.
- **writing**: mostly prose with `##` chapters and Figures for diagrams. No hero needed.

### Voice
Restrained and concrete. Short sentences. Say what was made, how, and what was hard.
No marketing language, no superlatives, no "passionate", no exclamation marks, no "delve".

## Design rules (relevant only if Aditya asks for design work)

- ONE typeface: Satoshi variable (`public/fonts/`), ONE weight: 550, set once on `body`.
- Hierarchy is COLOR only: `--ink` (soft warm dark gray — never pure black) for what
  matters; `--muted` for everything else. NO bold, no borders, no uppercase labels, no
  extra font sizes. When something feels cluttered, remove information — don't style it.
- The single pop of color is the cursor blob (`--accent`, BaseLayout). No color anywhere else.
- Frame: everything anchors at 10vw left / 10vh top / 10vh bottom; nothing renders outside
  the margins. Home: masthead → "Work" list scrolling in its own masked region → muted
  footer line inside the frame. Project pages share the frame; the back arrow sits exactly
  where the name sits on home. Text column 640px; media keeps the left edge, extends right
  to 940px max. Below 1000px everything falls back to normal flow.

## Safety nets (what stops a bad commit going live)

1. `npm run check` (also runs automatically before every build, locally and on Cloudflare):
   verifies every `previews` file exists, media types/sizes, inline-array form, no TODO
   summaries on published projects, videoId format, nothing huge in the repo.
2. Astro's zod schema: wrong/missing/unknown frontmatter fields fail the build.
3. The build itself fails loudly on broken imports or missing hero files — a failed build
   never deploys; the live site stays on the last good version.

If a build fails, read the error: it names the project and field. Fix, re-run `npm run build`.

## File map (for orientation, not modification)

- `src/content/work/<slug>/index.mdx` — all content lives here
- `src/content.config.ts` — schema | `scripts/validate-content.mjs` — validator
- `src/pages/index.astro` — home | `src/pages/work/[slug].astro` — project template
- `src/styles/global.css` — entire design system | `src/layouts/BaseLayout.astro` — head/meta/blob
- `astro.config.mjs` — set `site` to the real domain when it's wired
