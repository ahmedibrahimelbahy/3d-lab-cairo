// Image optimization for 3D Lab EG
// Converts source PNGs → WebP, generates OG image + favicons

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const SRC = 'Images';
const OUT = 'img';

// Unique source images mapped to short, semantic names + target dimensions
// width is the longer edge; quality is WebP quality (0-100)
const jobs = [
  // Hero images — loaded eagerly, need best quality
  { src: 'Gemini_Generated_Image_qrffbfqrffbfqrff.png', out: 'hero-printer.webp',    w: 1600, q: 82 },
  { src: 'Gemini_Generated_Image_eu7z0keu7z0keu7z.png', out: 'hero-enclosure.webp',  w: 800,  q: 82 },

  // Showcase strip — 320x220 on desktop, 2x retina
  { src: 'Gemini_Generated_Image_n6n7ren6n7ren6n7.png', out: 'showcase-01.webp',     w: 800, q: 78 },
  { src: 'Gemini_Generated_Image_gzzr6ugzzr6ugzzr.png', out: 'showcase-02.webp',     w: 800, q: 78 },
  { src: 'Gemini_Generated_Image_jjbuxsjjbuxsjjbu.png', out: 'showcase-03.webp',     w: 800, q: 78 },
  { src: 'Gemini_Generated_Image_lwkb3wlwkb3wlwkb.png', out: 'showcase-04.webp',     w: 800, q: 78 },
  { src: 'Gemini_Generated_Image_djqid3djqid3djqi.png', out: 'showcase-07.webp',     w: 800, q: 78 },

  // Shared: showcase + how-it-works step images
  { src: 'Gemini_Generated_Image_w71bwww71bwww71b.png', out: 'nozzle.webp',          w: 1200, q: 80 },
  { src: 'Gemini_Generated_Image_f72glif72glif72g.png', out: 'parts-collection.webp', w: 1200, q: 80 },

  // How-it-works step 1 + testimonial proof 2 (shared)
  { src: 'Gemini_Generated_Image_ses5nqses5nqses5.png', out: 'whatsapp-order-1.webp', w: 1000, q: 80 },
  // Testimonial proof 1
  { src: 'Gemini_Generated_Image_iaz9g8iaz9g8iaz9.png', out: 'whatsapp-order-2.webp', w: 1000, q: 80 },

  // Color strip — very wide banner, won't zoom in
  { src: 'Gemini_Generated_Image_2cf2pl2cf2pl2cf2.png', out: 'filament-colors.webp', w: 2000, q: 78 },

  // CTA background — blurred at 7% opacity, very low quality is fine
  { src: 'Gemini_Generated_Image_snv5t2snv5t2snv5.png', out: 'cta-texture.webp',     w: 1400, q: 60 },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeAll() {
  await ensureDir(OUT);

  let totalIn = 0, totalOut = 0;

  for (const job of jobs) {
    const srcPath = path.join(SRC, job.src);
    const outPath = path.join(OUT, job.out);

    const srcStat = await fs.stat(srcPath);
    totalIn += srcStat.size;

    await sharp(srcPath)
      .resize({ width: job.w, withoutEnlargement: true })
      .webp({ quality: job.q, effort: 6 })
      .toFile(outPath);

    const outStat = await fs.stat(outPath);
    totalOut += outStat.size;

    const inMB  = (srcStat.size / 1024 / 1024).toFixed(2);
    const outKB = (outStat.size / 1024).toFixed(0);
    const pct   = ((1 - outStat.size / srcStat.size) * 100).toFixed(1);
    console.log(`${job.out.padEnd(28)} ${inMB.padStart(6)} MB → ${outKB.padStart(5)} KB  (-${pct}%)`);
  }

  console.log('');
  console.log(`TOTAL: ${(totalIn / 1024 / 1024).toFixed(1)} MB → ${(totalOut / 1024).toFixed(0)} KB`);
  console.log(`Saved: ${((1 - totalOut / totalIn) * 100).toFixed(1)}%`);
}

async function generateOG() {
  console.log('\nGenerating OG image…');

  // Use the dramatic printer shot as backdrop, composite text + logo overlay
  const width = 1200, height = 630;

  const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#050914" stop-opacity="0.92"/>
      <stop offset="55%"  stop-color="#050914" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#050914" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#050914" stop-opacity="0"/>
      <stop offset="100%" stop-color="#050914" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#fade)"/>
  <rect width="${width}" height="${height}" fill="url(#bottomFade)"/>

  <!-- Accent bar -->
  <rect x="80" y="158" width="56" height="3" fill="#5A95FB"/>

  <!-- Eyebrow -->
  <text x="80" y="198" font-family="system-ui, -apple-system, sans-serif"
        font-size="22" font-weight="600" fill="#5A95FB" letter-spacing="4">
    3D LAB EG
  </text>

  <!-- Headline -->
  <text x="80" y="282" font-family="system-ui, -apple-system, sans-serif"
        font-size="72" font-weight="800" fill="#ffffff" letter-spacing="-2">
    Your 3D Vision,
  </text>
  <text x="80" y="362" font-family="system-ui, -apple-system, sans-serif"
        font-size="72" font-weight="800" fill="#5A95FB" letter-spacing="-2">
    Printed Fast.
  </text>

  <!-- Subline -->
  <text x="80" y="428" font-family="system-ui, -apple-system, sans-serif"
        font-size="26" font-weight="500" fill="#C8D4E8">
    3D printing in Cairo &amp; Giza — live WhatsApp tracking
  </text>

  <!-- Bottom badges -->
  <g transform="translate(80, 512)">
    <rect x="0" y="0" width="140" height="44" rx="22" fill="#25D366"/>
    <text x="70" y="29" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif"
          font-size="16" font-weight="700" fill="#ffffff">WHATSAPP</text>

    <text x="170" y="29" font-family="system-ui, -apple-system, sans-serif"
          font-size="16" font-weight="600" fill="#8B9CB3">
      48h delivery  ·  500+ orders
    </text>
  </g>
</svg>
  `);

  await sharp(path.join(SRC, 'Gemini_Generated_Image_qrffbfqrffbfqrff.png'))
    .resize({ width, height, fit: 'cover', position: 'attention' })
    .composite([{ input: overlay, blend: 'over' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile('og.jpg');

  const stat = await fs.stat('og.jpg');
  console.log(`og.jpg → ${(stat.size / 1024).toFixed(0)} KB`);
}

async function generateFavicons() {
  console.log('\nGenerating favicons…');

  const logo = 'assets/images/logo.png';

  // PNG favicons — modern browsers handle these perfectly
  const sizes = [
    { size: 16,  name: 'favicon-16.png' },
    { size: 32,  name: 'favicon-32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'icon-192.png' },
    { size: 512, name: 'icon-512.png' },
  ];

  for (const { size, name } of sizes) {
    await sharp(logo)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(name);
    const stat = await fs.stat(name);
    console.log(`${name.padEnd(24)} ${(stat.size / 1024).toFixed(1)} KB`);
  }
}

(async () => {
  console.log('=== Image optimization ===\n');
  await optimizeAll();
  await generateOG();
  await generateFavicons();
  console.log('\nDone.');
})();
