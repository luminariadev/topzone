#!/usr/bin/env node
// scripts/generate-splash.js
// Generates iOS splash screen images for PWA
// Run: node scripts/generate-splash.js
// Requires: npm install sharp

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '../public/splash');

const splashColor = '#0A0A0A';
const textColor = '#39FF14';
const brandText = 'TOPZONE';

// Splash screen configs for different iOS devices
const splashes = [
  { file: 'splash-750x1334.png', width: 750, height: 1334, label: 'iPhone 6/6s/7/8' },
  { file: 'splash-1242x2208.png', width: 1242, height: 2208, label: 'iPhone 8 Plus / X' },
  { file: 'splash-828x1792.png', width: 828, height: 1792, label: 'iPhone XR / 11' },
  { file: 'splash-1125x2436.png', width: 1125, height: 2436, label: 'iPhone X / XS' },
  { file: 'splash-1284x2778.png', width: 1284, height: 2778, label: 'iPhone 12 Pro Max' },
  { file: 'splash-1170x2532.png', width: 1170, height: 2532, label: 'iPhone 12 / 13' },
  { file: 'splash-1179x2556.png', width: 1179, height: 2556, label: 'iPhone 14 Pro' },
  { file: 'splash-2048x1536.png', width: 2048, height: 1536, label: 'iPad (7.9-10.5")' },
  { file: 'splash-1668x2388.png', width: 1668, height: 2388, label: 'iPad Pro 11"' },
  { file: 'splash-2048x2732.png', width: 2048, height: 2732, label: 'iPad Pro 12.9"' },
];

async function generateSplash({ file, width, height, label }) {
  // Create SVG with centered logo
  const fontSize = Math.round(width * 0.08);
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${splashColor}"/>
    <rect x="${width * 0.15}" y="${height * 0.38}" width="${width * 0.7}" height="${height * 0.08}" fill="${textColor}"/>
    <text x="${width / 2}" y="${height * 0.43}" font-family="Arial Black, sans-serif" font-size="${fontSize}" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="8">${brandText}</text>
    <text x="${width / 2}" y="${height * 0.55}" font-family="Arial, sans-serif" font-size="${Math.round(fontSize * 0.35)}" font-weight="600" fill="#ffffff" text-anchor="middle" opacity="0.6">Top Up Game and Gear</text>
  </svg>`;

  const outputPath = join(outputDir, file);

  await mkdirSync(outputDir, { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`✓ ${file} (${label})`);
}

async function main() {
  console.log('🎨 Generating iOS splash screens for TopZone PWA...\n');

  if (!existsSync(join(__dirname, '../node_modules/sharp'))) {
    console.warn('⚠ sharp not found. Run: npm install sharp');
    console.log('  Creating placeholder SVG files instead...\n');

    // Create placeholder SVGs as fallback
    for (const splash of splashes) {
      const outputPath = join(outputDir, splash.file.replace('.png', '.svg'));
      const fontSize = Math.round(splash.width * 0.08);
      const svg = `<svg width="${splash.width}" height="${splash.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${splashColor}"/>
        <rect x="${splash.width * 0.15}" y="${splash.height * 0.38}" width="${splash.width * 0.7}" height="${splash.height * 0.08}" fill="${textColor}"/>
        <text x="${splash.width / 2}" y="${splash.height * 0.43}" font-family="Arial Black, sans-serif" font-size="${fontSize}" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="8">${brandText}</text>
        <text x="${splash.width / 2}" y="${splash.height * 0.55}" font-family="Arial, sans-serif" font-size="${Math.round(fontSize * 0.35)}" font-weight="600" fill="#ffffff" text-anchor="middle" opacity="0.6">Top Up Game and Gear</text>
      </svg>`;

      await mkdirSync(outputDir, { recursive: true });
      const { writeFileSync } = await import('fs');
      writeFileSync(outputPath, svg);
      console.log(`✓ ${splash.file.replace('.png', '.svg')} (${splash.label}) — SVG placeholder`);
    }

    console.log('\n⚠ To generate PNG images, run: npm install sharp && node scripts/generate-splash.js');
    return;
  }

  await Promise.all(splashes.map(s => generateSplash(s)));
  console.log(`\n✅ All splash screens generated in ${outputDir}/`);
}

main().catch(console.error);