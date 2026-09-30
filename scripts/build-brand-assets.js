const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createSymbolSvg({ withBadge = true } = {}) {
  const badgeDef = withBadge ? `
    <!-- Dark Obsidian Squircle Badge with Emerald-Cyan Border -->
    <rect x="24" y="24" width="464" height="464" rx="116" fill="url(#bgGrad)" stroke="url(#badgeBorder)" stroke-width="10" filter="url(#badgeShadow)" />
    <rect x="29" y="29" width="454" height="454" rx="111" fill="url(#badgeAmbientGlow)" />
  ` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Dark Obsidian Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a121e" />
      <stop offset="50%" stop-color="#050a12" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>

    <!-- Outer Perimeter Neon Border Gradient -->
    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="45%" stop-color="#10b981" />
      <stop offset="80%" stop-color="#059669" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <!-- Ambient Center Radial Glow -->
    <radialGradient id="badgeAmbientGlow" cx="50%" cy="48%" r="68%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.36" />
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Arch Left Leg Gradient: Deep Forest -> Vivid Emerald -> Mint -->
    <linearGradient id="archLeft" x1="10%" y1="100%" x2="90%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="35%" stop-color="#059669" />
      <stop offset="70%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Arch Right Leg Gradient: Mint Apex -> Vibrant Cyan-Emerald -->
    <linearGradient id="archRight" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="35%" stop-color="#10b981" />
      <stop offset="75%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <!-- Apex Fold Highlight -->
    <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#6ee7b7" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>

    <!-- Numeral 1 Gradient: Pure, ultra-crisp, high-contrast -->
    <linearGradient id="numeralGrad" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#f0fdf4" />
      <stop offset="75%" stop-color="#a7f3d0" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Drop Shadows and Glows -->
    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="0" stdDeviation="28" flood-color="#10b981" flood-opacity="0.45" />
    </filter>

    <filter id="numeralGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#10b981" flood-opacity="0.7" />
    </filter>
  </defs>

  ${badgeDef}

  <!-- Ambient Concentric Tech Guidance Ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.22" />

  <!-- === THE "A" RIBBON ARCH (Mathematically Symmetrical around x=256) === -->
  <path d="
    M 84 404
    C 78 336, 156 148, 256 68
    C 282 92, 238 158, 186 248
    C 152 306, 136 362, 144 404
    Z
  " fill="url(#archLeft)" />

  <path d="
    M 118 404
    C 114 346, 180 186, 256 96
  " fill="none" stroke="#6ee7b7" stroke-width="3" opacity="0.45" stroke-linecap="round" />

  <path d="
    M 256 68
    C 356 148, 434 336, 428 404
    L 368 404
    C 376 362, 360 306, 326 248
    C 274 158, 230 92, 256 68
    Z
  " fill="url(#archRight)" />

  <path d="
    M 394 404
    C 398 346, 332 186, 256 96
  " fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.45" stroke-linecap="round" />

  <path d="
    M 224 108
    C 242 76, 270 76, 288 108
    C 272 118, 240 118, 224 108
    Z
  " fill="url(#apexGrad)" opacity="0.9" />

  <path d="
    M 84 404
    C 78 330, 160 140, 256 68
    C 352 140, 434 330, 428 404
  " fill="none" stroke="#a7f3d0" stroke-width="3" opacity="0.65" stroke-linecap="round" />

  <!-- === THE BOLD NUMERAL 1 (100% Mathematically Centered at x=256) === -->
  <g filter="url(#numeralGlow)">
    <path d="
      M 172 398
      L 172 362
      C 172 354, 178 348, 186 348
      L 234 348
      L 234 186
      L 194 220
      C 186 226, 176 222, 172 214
      L 162 192
      C 158 184, 162 174, 170 168
      L 246 114
      C 254 108, 278 112, 278 126
      L 278 348
      L 326 348
      C 334 348, 340 354, 340 362
      L 340 398
      C 340 406, 334 410, 326 410
      L 186 410
      C 178 410, 172 406, 172 398
      Z
    " fill="url(#numeralGrad)" />

    <path d="
      M 246 114
      L 278 126
      L 278 348
      L 326 348
      L 326 358
      L 268 358
      L 268 136
      L 186 182
      L 174 170
      Z
    " fill="#ffffff" opacity="0.85" />

    <line x1="186" y1="379" x2="326" y2="379" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
  </g>

  <!-- Precision Corner Nodes -->
  <circle cx="86" cy="86" r="5" fill="#34d399" opacity="0.8" />
  <circle cx="426" cy="86" r="5" fill="#06b6d4" opacity="0.8" />
  <circle cx="86" cy="426" r="5" fill="#10b981" opacity="0.8" />
  <circle cx="426" cy="426" r="5" fill="#34d399" opacity="0.8" />
</svg>`;
}

function createHorizontalLogoSvg({ isDark = false, width = 1180, height = 310 } = {}) {
  const agentColor = isDark ? '#ffffff' : '#0f172a';
  const taglineColor = isDark ? '#94a3b8' : '#475569';
  const oneGradStart = isDark ? '#34d399' : '#10b981';
  const oneGradEnd = isDark ? '#10b981' : '#047857';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a121e" />
      <stop offset="50%" stop-color="#050a12" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>

    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="45%" stop-color="#10b981" />
      <stop offset="80%" stop-color="#059669" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <radialGradient id="badgeAmbientGlow" cx="50%" cy="48%" r="68%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.36" />
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="archLeft" x1="10%" y1="100%" x2="90%" y2="0%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="35%" stop-color="#059669" />
      <stop offset="70%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <linearGradient id="archRight" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="35%" stop-color="#10b981" />
      <stop offset="75%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>

    <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#6ee7b7" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>

    <linearGradient id="numeralGrad" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#f0fdf4" />
      <stop offset="75%" stop-color="#a7f3d0" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <linearGradient id="wordOneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${oneGradStart}" />
      <stop offset="100%" stop-color="${oneGradEnd}" />
    </linearGradient>

    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.85" />
      <feDropShadow dx="0" dy="0" stdDeviation="28" flood-color="#10b981" flood-opacity="0.45" />
    </filter>

    <filter id="numeralGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000" flood-opacity="0.75" />
      <feDropShadow dx="0" dy="0" stdDeviation="18" flood-color="#10b981" flood-opacity="0.7" />
    </filter>
  </defs>

  <!-- Left: The Centered-1 Symbol Mark -->
  <g transform="translate(24, 25) scale(0.51)">
    <rect x="24" y="24" width="464" height="464" rx="116" fill="url(#bgGrad)" stroke="url(#badgeBorder)" stroke-width="10" filter="url(#badgeShadow)" />
    <rect x="29" y="29" width="454" height="454" rx="111" fill="url(#badgeAmbientGlow)" />
    <circle cx="256" cy="256" r="190" fill="none" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.22" />

    <path d="M 84 404 C 78 336, 156 148, 256 68 C 282 92, 238 158, 186 248 C 152 306, 136 362, 144 404 Z" fill="url(#archLeft)" />
    <path d="M 118 404 C 114 346, 180 186, 256 96" fill="none" stroke="#6ee7b7" stroke-width="3" opacity="0.45" stroke-linecap="round" />
    <path d="M 256 68 C 356 148, 434 336, 428 404 L 368 404 C 376 362, 360 306, 326 248 C 274 158, 230 92, 256 68 Z" fill="url(#archRight)" />
    <path d="M 394 404 C 398 346, 332 186, 256 96" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.45" stroke-linecap="round" />
    <path d="M 224 108 C 242 76, 270 76, 288 108 C 272 118, 240 118, 224 108 Z" fill="url(#apexGrad)" opacity="0.9" />
    <path d="M 84 404 C 78 330, 160 140, 256 68 C 352 140, 434 330, 428 404" fill="none" stroke="#a7f3d0" stroke-width="3" opacity="0.65" stroke-linecap="round" />

    <g filter="url(#numeralGlow)">
      <path d="M 172 398 L 172 362 C 172 354, 178 348, 186 348 L 234 348 L 234 186 L 194 220 C 186 226, 176 222, 172 214 L 162 192 C 158 184, 162 174, 170 168 L 246 114 C 254 108, 278 112, 278 126 L 278 348 L 326 348 C 334 348, 340 354, 340 362 L 340 398 C 340 406, 334 410, 326 410 L 186 410 C 178 410, 172 406, 172 398 Z" fill="url(#numeralGrad)" />
      <path d="M 246 114 L 278 126 L 278 348 L 326 348 L 326 358 L 268 358 L 268 136 L 186 182 L 174 170 Z" fill="#ffffff" opacity="0.85" />
      <line x1="186" y1="379" x2="326" y2="379" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
    </g>

    <circle cx="86" cy="86" r="5" fill="#34d399" opacity="0.8" />
    <circle cx="426" cy="86" r="5" fill="#06b6d4" opacity="0.8" />
    <circle cx="86" cy="426" r="5" fill="#10b981" opacity="0.8" />
    <circle cx="426" cy="426" r="5" fill="#34d399" opacity="0.8" />
  </g>

  <!-- Right: Typography "Agent One" -->
  <g transform="translate(318, 0)">
    <text x="0" y="168" font-family="Arial, 'Segoe UI', Helvetica, sans-serif" font-weight="bold" font-size="112" letter-spacing="-1.5">
      <tspan fill="${agentColor}">Agent </tspan>
      <tspan fill="url(#wordOneGrad)">One</tspan>
    </text>

    <text x="4" y="226" font-family="Arial, 'Segoe UI', Helvetica, sans-serif" font-weight="normal" font-size="28" fill="${taglineColor}" letter-spacing="0">
      AI-Powered Document Intelligence &amp; Insight Extraction
    </text>
  </g>
</svg>`;
}

async function createIcoFromPngBuffers(pngBuffers, outputPath) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let currentOffset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(numImages, 4); // count

  const dirEntries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);

    dirEntries.push(entry);
    currentOffset += img.buffer.length;
  }

  const finalIcoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(img => img.buffer)
  ]);

  fs.writeFileSync(outputPath, finalIcoBuffer);
}

async function main() {
  console.log('Building canonical Agent One brand assets...');

  const symbolSvg = createSymbolSvg({ withBadge: true });
  const lightLogoSvg = createHorizontalLogoSvg({ isDark: false });
  const darkLogoSvg = createHorizontalLogoSvg({ isDark: true });

  const symbolSvgBuffer = Buffer.from(symbolSvg);
  const lightLogoBuffer = Buffer.from(lightLogoSvg);
  const darkLogoBuffer = Buffer.from(darkLogoSvg);

  // 1. Write SVGs
  const svgTargets = [
    'public/brand/agent-one-symbol.svg',
    'public/icon.svg',
    'public/favicon.svg',
    'public/apple-icon.svg',
    'src/app/icon.svg',
    'src/app/apple-icon.svg',
  ];
  for (const t of svgTargets) {
    fs.writeFileSync(t, symbolSvg);
  }
  console.log('Saved all SVG icons.');

  // 2. Write Horizontal Logo PNGs
  await sharp(lightLogoBuffer).png().toFile('public/brand/agent-one-logo.png');
  await sharp(darkLogoBuffer).png().toFile('public/brand/agent-one-logo-dark.png');
  console.log('Saved horizontal logo PNGs (light & dark).');

  // 3. Write Symbol PNGs at all standard sizes
  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];
  const renderedBuffers = {};

  for (const s of sizes) {
    renderedBuffers[s] = await sharp(symbolSvgBuffer).resize(s, s).png().toBuffer();
  }

  fs.writeFileSync('public/brand/agent-one-symbol.png', renderedBuffers[512]);
  fs.writeFileSync('public/favicon-16x16.png', renderedBuffers[16]);
  fs.writeFileSync('public/favicon-32x32.png', renderedBuffers[32]);
  fs.writeFileSync('public/favicon-48x48.png', renderedBuffers[48]);
  fs.writeFileSync('public/favicon-64x64.png', renderedBuffers[64]);
  fs.writeFileSync('public/favicon-128x128.png', renderedBuffers[128]);
  fs.writeFileSync('public/favicon-192x192.png', renderedBuffers[192]);
  fs.writeFileSync('public/favicon-512x512.png', renderedBuffers[512]);
  fs.writeFileSync('public/apple-icon.png', renderedBuffers[180]);
  fs.writeFileSync('public/apple-touch-icon.png', renderedBuffers[180]);
  fs.writeFileSync('public/icon-192.png', renderedBuffers[192]);
  fs.writeFileSync('public/icon-512.png', renderedBuffers[512]);
  console.log('Saved all multi-resolution PNG favicons and app icons.');

  // 4. Generate multi-resolution ICO file (16, 32, 48)
  const icoBuffers = [
    { width: 16, height: 16, buffer: renderedBuffers[16] },
    { width: 32, height: 32, buffer: renderedBuffers[32] },
    { width: 48, height: 48, buffer: renderedBuffers[48] },
  ];
  await createIcoFromPngBuffers(icoBuffers, 'public/favicon.ico');
  await createIcoFromPngBuffers(icoBuffers, 'src/app/favicon.ico');
  console.log('Saved multi-resolution ICO favicons in public/ and src/app/.');

  console.log('Brand asset generation complete!');
}

main().catch(console.error);
