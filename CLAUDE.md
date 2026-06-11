# Aditya Manikashetti — Portfolio: Agent Operating Manual

This is Aditya's portfolio site (Astro 6, static, MDX). **Git is the CMS**: every push to
`main` deploys to Cloudflare Pages. Content lives in `src/content/work/` — one folder per
project. To publish or edit work you ONLY touch that directory. Never edit layouts, styles,
components or pages unless Aditya explicitly asks for a design change.

Repo: https://github.com/mm-aditya/AMM_Website_2026

## The workflow: adding a project

1. `npm run new "Project Name"` → scaffolds `src/content/work/project-name/index.mdx` with
   `draft: true` and the full frontmatter template.
2. Upload the media to Gumlet (films AND images — see Media rules) and collect the URLs/IDs.
3. Fill the frontmatter (schema below) and write the body (components below), referencing the
   Gumlet URLs.
4. Set `draft: false`.
5. **`npm run check`** — the content validator. Fix everything it reports. (No local build is
   required to publish — Cloudflare builds on push — but run `check` always; it is fast and
   needs no build.)
6. Publish via the branch you were told to use (see "Publishing & previewing" below).

Editing a project = editing its `index.mdx`, then re-running `check` and pushing.
Unpublishing = set `draft: true` and push.

## Publishing & previewing (no local build needed)

Cloudflare builds the site in the cloud on every push, so an agent on a VPS never needs a
local `npm run build`.

- **Preview before it goes live:** commit to the **`staging`** branch and push it. Cloudflare
  builds it and serves it at a stable URL — `staging.<project>.pages.dev` — that Aditya can
  open from any device. Iterate on `staging` until he approves.
- **Publish:** once approved, fast-forward `main` to `staging` and push `main`
  (`git checkout main && git merge --ff-only staging && git push`). `main` is the live site.
- **Default to `staging`** for anything Aditya should see first. Only push straight to `main`
  for changes he has explicitly pre-approved.
- `draft: true` hides an unfinished project even on whichever branch it's on; it never renders.

## Frontmatter schema (zod-validated at build; unknown fields fail the build)

```yaml
---
title: "Project Name"            # required
year: 2026                       # required, number, no quotes
role: "Director"                 # required — Director | Creative Director | Creative Technologist (whichever is truthful)
client: "Studio / brand"         # optional
type: film                       # required: film | tech | writing
summary: "One sentence that reads naturally before the role tag."   # required — see voice rules
previews: ["https://…gumlet…/a.jpg", "https://…/b.jpg"]   # hover collage, 1–4 items, one-line inline form. Gumlet URLs (or local ./files)
featured: false                  # optional — true pins the project to the top of the index
hero: "https://…gumlet…/hero.jpg"  # optional — page lead image: a Gumlet URL (or a local ./file)
videoId: "gumlet:ASSETID"        # optional — provider-prefixed: gumlet:ID | vimeo:ID | youtube:ID
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

**All media lives on Gumlet** (images and films alike). Upload it there, get the URL/ID, and
reference it from the frontmatter or MDX. Nothing media-related is committed to the repo.

| Media | How to reference | Spec |
|---|---|---|
| Hover previews (images) | Gumlet image URL in `previews` | ~960×540, landscape |
| Hover previews (loops) | Gumlet mp4/webm URL in `previews` | muted, 2–4 s, ~640px wide |
| Page hero | Gumlet image URL in `hero:` | ~1600×900 |
| Body images (stills, screenshots, diagrams) | Gumlet URL in `<Figure src="https://…" />` | ≤ 1600px wide |
| Full films / reels | `videoId: "gumlet:ASSETID"` | uploaded to Gumlet video |

- Upload images to Gumlet's image product; upload films to Gumlet's video product. Use the
  returned delivery URL for images, and the asset ID (as `gumlet:ID`) for films.
- A body image is just `<Figure src="https://…gumlet…/still.jpg" alt="…" />` — no import,
  no local file.
- 1 preview = centered and level. 2–4 previews = a horizontal strip with small gaps and a
  gentle alternating vertical offset. More than 4 gets cramped (validator warns).
- **Fallback (still supported):** a committed local file also works anywhere a Gumlet URL does
  — `hero: ./hero.jpg`, `previews: ["./a.jpg"]`, `<Figure src={importedImg} />`. Local images
  get optimized at build; use this only if you deliberately want media in the repo. The default
  is Gumlet URLs.
- NEVER commit a full film to the repo. The validator hard-fails any file over 20 MB.

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
