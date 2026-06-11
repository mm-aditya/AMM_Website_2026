import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const name = process.argv.slice(2).join(' ');

if (!name || !name.trim()) {
  console.error('Error: please provide a project name.');
  console.error('Usage: node scripts/new-project.mjs "Project Name"');
  process.exit(1);
}

// Slugify: lowercase, non-alphanumeric -> hyphen, trim hyphens
const slug = name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

if (!slug) {
  console.error('Error: the provided name produces an empty slug.');
  process.exit(1);
}

const dir = path.join(root, 'src', 'content', 'work', slug);

if (fs.existsSync(dir)) {
  console.error(`Error: folder already exists: ${dir}`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const year = new Date().getFullYear();

const stub = `---
title: ${name.trim()}
year: ${year}
role: Director
type: film
summary: TODO — one sentence that reads naturally before the role, e.g. "A short film about X."
previews: ["./preview.jpg"]
draft: true
# client: ""
# featured: false
# hero: ./hero.jpg
# videoId: "vimeo:XXXXXXX"
# links:
#   - label: ""
#     url: ""
#     note: ""
---

{/* Available components (auto-injected — no imports needed):
  <Video id="vimeo:XXXX" />            — embed a Vimeo, YouTube, or Gumlet video
  <Video src="/path/to/file.mp4" />    — embed a direct video file; add loop for looping
  <ImageGrid cols={2}>...</ImageGrid>  — responsive image grid; wrap Figure children inside
  <Figure src={importedImg} alt="" caption="" /> — single image with optional caption
  <LinkCard url="" label="" note="" /> — external link card with label and optional note
  Chapters: plain ## headings. Section breaks: ---. See CLAUDE.md for the full manual.
*/}
`;

const filePath = path.join(dir, 'index.mdx');
fs.writeFileSync(filePath, stub, 'utf8');

console.log(`Created: ${filePath}`);
console.log('Next: add preview.jpg (960×540) into the folder, write the body,');
console.log('set draft: false, then run "npm run check" to validate before pushing.');
