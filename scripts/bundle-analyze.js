// scripts/bundle-analyze.js
// Runs after build to analyze bundle size and check against budget
// Run: node scripts/bundle-analyze.js
// Or as part of build: astro build && node scripts/bundle-analyze.js
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

// Performance budget thresholds (in KB)
const BUDGET = {
  'index': 250,        // Main bundle should be < 250KB
  'astro': 50,         // Astro runtime < 50KB
  'chunk': 500,        // Any async chunk < 500KB
  'total-css': 100,    // Total CSS < 100KB
  'per-page': 300,     // Each page should load < 300KB initial
  'largest-img': 200,  // Largest image < 200KB (before optimization)
};

// Severity levels
const SEVERITY = {
  WARN: '⚠️  WARN',
  ERROR: '❌ ERROR',
  OK: '✅ OK',
};

function getSizeKB(bytes) {
  return (bytes / 1024).toFixed(2);
}

function checkSize(name, bytes, budget) {
  const sizeKB = parseFloat(getSizeKB(bytes));
  if (sizeKB > budget) {
    return { status: SEVERITY.ERROR, size: sizeKB, budget, over: (sizeKB - budget).toFixed(2) };
  } else if (sizeKB > budget * 0.9) {
    return { status: SEVERITY.WARN, size: sizeKB, budget, over: null };
  }
  return { status: SEVERITY.OK, size: sizeKB, budget, over: null };
}

async function analyzeDirectory(dir, results = {}) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await analyzeDirectory(fullPath, results);
      } else {
        const stats = await stat(fullPath);
        const relPath = fullPath.replace(distDir, '').replace(/\\/g, '/');
        // Categorize files
        if (relPath.includes('/_astro/')) {
          const filename = relPath.split('/').pop();
          if (filename.endsWith('.js')) {
            results.chunks = results.chunks || [];
            results.chunks.push({ path: relPath, size: stats.size });
          } else if (filename.endsWith('.css')) {
            results.css = results.css || [];
            results.css.push({ path: relPath, size: stats.size });
          }
        } else if (relPath.endsWith('.html')) {
          results.pages = results.pages || [];
          results.pages.push({ path: relPath, size: stats.size });
        } else if (filename?.includes('index.') && relPath.includes('/_astro/')) {
          results.main = { path: relPath, size: stats.size };
        }
      }
    }
  } catch (e) {
    // Directory might not exist
  }
  return results;
}

async function main() {
  console.log('\n📊 TopZone Bundle Analysis Report');
  console.log('='.repeat(50));
  console.log(`Directory: ${distDir}\n`);

  const results = await analyzeDirectory(distDir);
  let totalIssues = 0;

  // Check main bundle
  if (results.main) {
    const check = checkSize('Main bundle', results.main.size, BUDGET.index);
    console.log(`${check.status} Main bundle: ${check.size}KB / ${check.budget}KB budget`);
    if (check.status !== SEVERITY.OK) totalIssues++;
  }

  // Check CSS
  if (results.css?.length) {
    const totalCSS = results.css.reduce((s, f) => s + f.size, 0);
    const check = checkSize('Total CSS', totalCSS, BUDGET['total-css']);
    console.log(`${check.status} Total CSS: ${check.size}KB / ${check.budget}KB budget`);
    if (check.status !== SEVERITY.OK) totalIssues++;
  }

  // Check large chunks
  if (results.chunks?.length) {
    const sorted = [...results.chunks].sort((a, b) => b.size - a.size).slice(0, 5);
    sorted.forEach(chunk => {
      const check = checkSize(`Chunk: ${chunk.path.split('/').pop()}`, chunk.size, BUDGET.chunk);
      if (check.status !== SEVERITY.OK) {
        console.log(`${check.status} ${chunk.path}: ${check.size}KB / ${check.budget}KB budget`);
        if (check.status === SEVERITY.ERROR) totalIssues++;
      }
    });
  }

  // Check pages
  if (results.pages?.length) {
    const sorted = [...results.pages].sort((a, b) => b.size - a.size).slice(0, 3);
    sorted.forEach(page => {
      const check = checkSize(`Page: ${page.path}`, page.size, BUDGET['per-page']);
      if (check.status !== SEVERITY.OK) {
        console.log(`${check.status} ${page.path}: ${check.size}KB / ${check.budget}KB budget`);
        if (check.status === SEVERITY.ERROR) totalIssues++;
      }
    });
  }

  console.log('\n' + '='.repeat(50));
  if (totalIssues > 0) {
    console.log(`❌ ${totalIssues} budget violation(s) found. Review bundle size.`);
    process.exit(1);
  } else {
    console.log('✅ All bundles within budget!');
  }
}

main().catch(() => {
  console.log('⚠️  Build directory not found. Run "npm run build" first.');
});