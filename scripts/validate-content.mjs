// Content validator — catches what the zod schema can't.
// Runs automatically before every build (npm prebuild) and via `npm run check`.
// Exits 1 with a readable report if anything is wrong, so a bad commit can
// never reach the live site.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const workDir = path.join(root, 'src', 'content', 'work');

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const VID_EXT = ['.mp4', '.webm'];
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB per image
const MAX_VIDEO_BYTES = 5 * 1024 * 1024; // 5 MB per preview loop
const MAX_ANY_BYTES = 20 * 1024 * 1024; // Cloudflare Pages caps files at 25 MB

const errors = [];
const warnings = [];

function err(slug, msg) {
  errors.push(`  ${slug}: ${msg}`);
}
function warn(slug, msg) {
  warnings.push(`  ${slug}: ${msg}`);
}

const projects = fs
  .readdirSync(workDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const slug of projects) {
  const dir = path.join(workDir, slug);
  const mdxPath = path.join(dir, 'index.mdx');

  if (!fs.existsSync(mdxPath)) {
    err(slug, 'has no index.mdx');
    continue;
  }

  const raw = fs.readFileSync(mdxPath, 'utf8');
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    err(slug, 'index.mdx has no frontmatter block');
    continue;
  }
  const fm = fmMatch[1];

  const isDraft = /^draft:\s*true\s*$/m.test(fm);

  // Drafts never block a deploy (they are excluded from the build anyway):
  // their problems are reported as warnings. Published projects get hard errors.
  const report = isDraft ? (s, m) => warn(s, `(draft) ${m}`) : err;

  // -- previews: must be the inline array form, every file must exist --------
  const previewsLine = fm.match(/^previews:\s*(.*)$/m);
  let previews = [];
  if (previewsLine) {
    const val = previewsLine[1].trim();
    const inline = val.match(/^\[(.*)\]$/);
    if (!inline) {
      report(
        slug,
        'previews must use the inline form: previews: ["./a.jpg", "./b.mp4"] (one line)'
      );
    } else if (inline[1].trim()) {
      previews = inline[1]
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
  }

  for (const p of previews) {
    const file = path.join(dir, p.replace(/^\.\//, ''));
    const ext = path.extname(p).toLowerCase();
    if (!fs.existsSync(file)) {
      report(slug, `previews references "${p}" but that file does not exist in the folder`);
      continue;
    }
    if (![...IMG_EXT, ...VID_EXT].includes(ext)) {
      report(slug, `previews entry "${p}" has unsupported type (use jpg/png/webp or mp4/webm)`);
      continue;
    }
    const size = fs.statSync(file).size;
    if (VID_EXT.includes(ext) && size > MAX_VIDEO_BYTES) {
      report(slug, `preview loop "${p}" is ${(size / 1e6).toFixed(1)} MB — keep loops under 5 MB`);
    }
    if (IMG_EXT.includes(ext) && size > MAX_IMAGE_BYTES) {
      report(slug, `preview image "${p}" is ${(size / 1e6).toFixed(1)} MB — keep images under 1.5 MB`);
    }
  }

  if (!isDraft && previews.length === 0) {
    warn(slug, 'is published with no previews — it will have no hover media on the index');
  }

  if (previews.length > 4) {
    warn(slug, `has ${previews.length} previews — more than 4 gets cramped in the collage`);
  }

  // -- placeholder text must not ship --------------------------------------
  if (!isDraft && /^summary:.*TODO/m.test(fm)) {
    err(slug, 'is published (draft: false) but summary still contains TODO');
  }

  // -- videoId format -------------------------------------------------------
  const videoId = fm.match(/^videoId:\s*["']?([^"'\r\n]+)["']?\s*$/m);
  if (videoId && !/^(gumlet|vimeo|youtube):.+/.test(videoId[1].trim())) {
    report(
      slug,
      `videoId "${videoId[1].trim()}" must be provider-prefixed: gumlet:ID, vimeo:ID or youtube:ID`
    );
  }

  // -- every file in the folder: size + type sanity -------------------------
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    if (!fs.statSync(fp).isFile()) continue;
    const size = fs.statSync(fp).size;
    const ext = path.extname(f).toLowerCase();
    if (size > MAX_ANY_BYTES) {
      err(slug, `file "${f}" is ${(size / 1e6).toFixed(0)} MB — too large for the repo. Full films go to Gumlet, not git.`);
    } else if (IMG_EXT.includes(ext) && size > MAX_IMAGE_BYTES) {
      warn(slug, `image "${f}" is ${(size / 1e6).toFixed(1)} MB — consider re-exporting under 1.5 MB`);
    }
  }
}

if (warnings.length) {
  console.log(`\nContent warnings (${warnings.length}):`);
  for (const w of warnings) console.log(w);
}

if (errors.length) {
  console.error(`\nContent errors (${errors.length}) — fix these before publishing:`);
  for (const e of errors) console.error(e);
  console.error('\nSee CLAUDE.md for the content rules.');
  process.exit(1);
}

console.log(`\nContent OK: ${projects.length} projects validated.`);
