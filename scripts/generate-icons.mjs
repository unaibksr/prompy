// Generate PWA icons from SVG source
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public', 'icons', 'icon.svg');
const iconsDir = join(root, 'public', 'icons');

mkdirSync(iconsDir, { recursive: true });

const svg = readFileSync(svgPath);

const sizes = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 120, name: 'icon-120.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 167, name: 'icon-167.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' },
];

async function generate() {
  for (const { size, name } of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png({ compressionLevel: 9, quality: 90, effort: 10 })
      .toFile(join(iconsDir, name));
    console.log('Generated', name);
  }

  await sharp(svg)
    .resize(512, 512)
    .png({ compressionLevel: 9, quality: 90, effort: 10 })
    .toFile(join(iconsDir, 'icon-512-maskable.png'));
  console.log('Generated icon-512-maskable.png');

  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(join(root, 'public', 'favicon.ico'));
  console.log('Generated favicon.ico');
}

generate().catch((err) => { console.error(err); process.exit(1); });
