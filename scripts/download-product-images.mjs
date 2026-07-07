// scripts/download-product-images.mjs
//
// Downloads real product images from picsum.photos (free, no API key) for
// TopZone's gaming e-commerce project. Uses seeded URLs for consistency.
// Runs with max 5 concurrent downloads, skips existing files, and updates
// data source files (.svg → .png/.jpg for downloaded images).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// ── Download manifest ────────────────────────────────────────────────────────

const images = [
  // ── GAMES (400×400) ───────────────────────────────────────────────────────
  { url: 'https://picsum.photos/seed/mlbb/400/400',       file: 'public/assets/mlbb.png' },
  { url: 'https://picsum.photos/seed/valorant/400/400',   file: 'public/assets/valorant.png' },
  { url: 'https://picsum.photos/seed/freefire/400/400',   file: 'public/assets/freefire.png' },
  { url: 'https://picsum.photos/seed/pubg/400/400',       file: 'public/assets/pubg.png' },
  { url: 'https://picsum.photos/seed/genshin/400/400',    file: 'public/assets/genshin.png' },
  { url: 'https://picsum.photos/seed/roblox/400/400',     file: 'public/assets/roblox.png' },
  { url: 'https://picsum.photos/seed/fortnite/400/400',   file: 'public/assets/fortnite.png' },
  { url: 'https://picsum.photos/seed/pokemon/400/400',    file: 'public/assets/pokemon-unite.png' },
  { url: 'https://picsum.photos/seed/honkai/400/400',     file: 'public/assets/honkai-star-rail.png' },
  { url: 'https://picsum.photos/seed/league/400/400',     file: 'public/assets/league-of-legends.png' },

  // ── GEAR (600×600) ────────────────────────────────────────────────────────
  { url: 'https://picsum.photos/seed/keyboard/600/600',    file: 'public/assets/keyboard.png' },
  { url: 'https://picsum.photos/seed/mouse/600/600',       file: 'public/assets/mouse.png' },
  { url: 'https://picsum.photos/seed/headset/600/600',     file: 'public/assets/headset.png' },
  { url: 'https://picsum.photos/seed/gchair/600/600',      file: 'public/assets/gaming-chair.jpg' },
  { url: 'https://picsum.photos/seed/controller/600/600',  file: 'public/assets/controller.jpg' },
  { url: 'https://picsum.photos/seed/webcam/600/600',      file: 'public/assets/webcam.jpg' },
  { url: 'https://picsum.photos/seed/microphone/600/600',  file: 'public/assets/microphone.jpg' },
  { url: 'https://picsum.photos/seed/monitor/600/600',     file: 'public/assets/monitor-144hz.jpg' },
  { url: 'https://picsum.photos/seed/speaker/600/600',     file: 'public/assets/speaker-stereo.jpg' },
  { url: 'https://picsum.photos/seed/streaming/600/600',   file: 'public/assets/capture-card.jpg' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function downloadOne({ url, file }) {
  const absPath = path.resolve(root, file);

  if (fs.existsSync(absPath)) {
    console.log(`  [SKIP] ${file}  (already exists)`);
    return 'skipped';
  }

  fs.mkdirSync(path.dirname(absPath), { recursive: true });

  const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
  }

  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(absPath, buf);
  console.log(`  [OK]   ${file}`);
  return 'downloaded';
}

/** Process an array of items with at most `concurrency` in-flight promises. */
async function asyncPool(items, concurrency, fn) {
  const results = [];
  const queue = [...items];

  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      try {
        const status = await fn(item);
        results.push({ file: item.file, status });
      } catch (err) {
        console.error(`  [FAIL] ${item.file}  — ${err.message}`);
        results.push({ file: item.file, status: 'error', error: err.message });
      }
    }
  }

  const poolSize = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: poolSize }, worker));
  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== TopZone — Download Product Images ===\n');

  // Phase 1 — download -------------------------------------------------------
  const results = await asyncPool(images, 5, downloadOne);

  const downloaded = results.filter((r) => r.status === 'downloaded').length;
  const skipped   = results.filter((r) => r.status === 'skipped').length;
  const failed    = results.filter((r) => r.status === 'error').length;
  const total     = results.length;

  console.log(
    `\n--- Download complete: ${downloaded} new, ${skipped} skipped, ${failed} failed (${total} total) ---\n`,
  );

  // Phase 2 — update data files (.svg → .png/.jpg) ---------------------------
  const dataFiles = [
    { label: 'games.ts', abspath: path.resolve(root, 'src/data/games.ts') },
    { label: 'gears.ts', abspath: path.resolve(root, 'src/data/gears.ts') },
  ];

  for (const { label, abspath } of dataFiles) {
    let content = fs.readFileSync(abspath, 'utf-8');
    let modified = false;

    for (const { file } of images) {
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const oldRef = `/assets/${name}.svg`;
      const newRef = `/assets/${name}${ext}`;

      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        modified = true;
        console.log(`  [UPDATE] ${label}: ${oldRef} → ${newRef}`);
      }
    }

    if (modified) {
      fs.writeFileSync(abspath, content, 'utf-8');
      console.log(`  [SAVED]  ${label}\n`);
    } else {
      console.log(`  [OK]     ${label} — no .svg references to update\n`);
    }
  }

  console.log('=== All done ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
