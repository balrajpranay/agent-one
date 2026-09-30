import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Exact vector geometry matching media_1790759812476.png
const createFaviconSvg = ({ isDarkTab = false } = {}) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <!-- Right leg and apex loop gradient: bright mint highlight down to deep emerald base -->
    <linearGradient id="mainRibbonGrad" x1="25%" y1="8%" x2="85%" y2="92%">
      <stop offset="0%" stop-color="#00FFA3"/>
      <stop offset="25%" stop-color="#00E68F"/>
      <stop offset="65%" stop-color="#00B06B"/>
      <stop offset="100%" stop-color="#015233"/>
    </linearGradient>

    <!-- Left leg outer illuminated surface -->
    <linearGradient id="leftFrontGrad" x1="15%" y1="85%" x2="75%" y2="15%">
      <stop offset="0%" stop-color="#028551"/>
      <stop offset="45%" stop-color="#00C475"/>
      <stop offset="100%" stop-color="#00FFA3"/>
    </linearGradient>

    <!-- Left leg inner shaded fold facet (3D twist) -->
    <linearGradient id="innerShadedGrad" x1="65%" y1="15%" x2="15%" y2="85%">
      <stop offset="0%" stop-color="#0B4534"/>
      <stop offset="50%" stop-color="#042F22"/>
      <stop offset="100%" stop-color="#011B13"/>
    </linearGradient>

    <!-- Ambient ground contact reflection -->
    <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.38"/>
      <stop offset="65%" stop-color="#00C475" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#00C475" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <style>
    .numeral-one {
      fill: #072019;
    }
    @media (prefers-color-scheme: dark) {
      .numeral-one {
        fill: #FFFFFF;
      }
    }
  </style>

  <!-- Ambient floor glow -->
  <ellipse cx="50" cy="91" rx="38" ry="4.5" fill="url(#groundGlow)"/>

  <!-- STANDALONE "A + 1" EMBLEM (Centered with 12% padding) -->
  <g>
    <!-- 1. Left Lower Ribbon Turn & Outer Surface -->
    <path
      d="M 16 76 C 11 68 16 52 27 36 L 44 14 C 48 8 52 8 56 12 L 44 34 C 36 48 27 61 25 70 C 23 78 19 82 16 76 Z"
      fill="url(#leftFrontGrad)"
    />

    <!-- 2. Left Shaded Inner Fold Facet (Realistic 3D depth) -->
    <path
      d="M 44 14 C 47 19 45 29 40 39 L 27 62 C 21 73 26 81 35 79 C 39 77 43 71 45 64 L 49 43 C 49 32 47 21 44 14 Z"
      fill="url(#innerShadedGrad)"
    />

    <!-- 3. Main Arch & Right Descending Pillar (Clean solid architectural band) -->
    <path
      d="M 44 14 C 48 7 54 7 58 13 L 86 65 C 92 76 88 86 78 86 L 57 86 L 55 25 C 53 19 49 16 44 14 Z"
      fill="url(#mainRibbonGrad)"
    />

    <!-- 4. Center Numeral '1' Glyph (True numeral '1' geometry) -->
    <path
      d="M 57 42 L 57 86 L 43 86 L 43 54 L 33 54 L 33 51 L 43 42 Z"
      class="numeral-one"
      fill="${isDarkTab ? '#FFFFFF' : '#072019'}"
    />
  </g>
</svg>`;
};

// Raster PNG version
const createPngSvg = ({ bg = 'transparent', isDarkTab = false } = {}) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
  <defs>
    <linearGradient id="mainRibbonGrad" x1="25%" y1="8%" x2="85%" y2="92%">
      <stop offset="0%" stop-color="#00FFA3"/>
      <stop offset="25%" stop-color="#00E68F"/>
      <stop offset="65%" stop-color="#00B06B"/>
      <stop offset="100%" stop-color="#015233"/>
    </linearGradient>

    <linearGradient id="leftFrontGrad" x1="15%" y1="85%" x2="75%" y2="15%">
      <stop offset="0%" stop-color="#028551"/>
      <stop offset="45%" stop-color="#00C475"/>
      <stop offset="100%" stop-color="#00FFA3"/>
    </linearGradient>

    <linearGradient id="innerShadedGrad" x1="65%" y1="15%" x2="15%" y2="85%">
      <stop offset="0%" stop-color="#0B4534"/>
      <stop offset="50%" stop-color="#042F22"/>
      <stop offset="100%" stop-color="#011B13"/>
    </linearGradient>

    <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.38"/>
      <stop offset="65%" stop-color="#00C475" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#00C475" stop-opacity="0"/>
    </radialGradient>
  </defs>

  ${bg !== 'transparent' ? `<rect width="100" height="100" rx="22" fill="${bg}"/>` : ''}

  <!-- Ambient floor glow -->
  <ellipse cx="50" cy="91" rx="38" ry="4.5" fill="url(#groundGlow)"/>

  <!-- STANDALONE "A + 1" EMBLEM -->
  <g>
    <!-- Left Lower Ribbon Turn & Outer Surface -->
    <path
      d="M 16 76 C 11 68 16 52 27 36 L 44 14 C 48 8 52 8 56 12 L 44 34 C 36 48 27 61 25 70 C 23 78 19 82 16 76 Z"
      fill="url(#leftFrontGrad)"
    />

    <!-- Left Shaded Inner Fold Facet -->
    <path
      d="M 44 14 C 47 19 45 29 40 39 L 27 62 C 21 73 26 81 35 79 C 39 77 43 71 45 64 L 49 43 C 49 32 47 21 44 14 Z"
      fill="url(#innerShadedGrad)"
    />

    <!-- Main Arch & Right Descending Pillar -->
    <path
      d="M 44 14 C 48 7 54 7 58 13 L 86 65 C 92 76 88 86 78 86 L 57 86 L 55 25 C 53 19 49 16 44 14 Z"
      fill="url(#mainRibbonGrad)"
    />

    <!-- Center Numeral '1' Glyph with subtle mint edge for dark browser tabs -->
    <path
      d="M 57 42 L 57 86 L 43 86 L 43 54 L 33 54 L 33 51 L 43 42 Z"
      fill="#072019"
      stroke="#00FFA3"
      stroke-width="1.2"
      stroke-opacity="0.35"
      stroke-linejoin="round"
    />
  </g>
</svg>`;
};

// Apple Touch Icon
const createAppleTouchSvg = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <linearGradient id="appleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E1624"/>
      <stop offset="100%" stop-color="#06090F"/>
    </linearGradient>

    <linearGradient id="appleMain" x1="25%" y1="8%" x2="85%" y2="92%">
      <stop offset="0%" stop-color="#00FFA3"/>
      <stop offset="25%" stop-color="#00E68F"/>
      <stop offset="65%" stop-color="#00B06B"/>
      <stop offset="100%" stop-color="#015233"/>
    </linearGradient>

    <linearGradient id="appleLeft" x1="15%" y1="85%" x2="75%" y2="15%">
      <stop offset="0%" stop-color="#028551"/>
      <stop offset="45%" stop-color="#00C475"/>
      <stop offset="100%" stop-color="#00FFA3"/>
    </linearGradient>

    <linearGradient id="appleShaded" x1="65%" y1="15%" x2="15%" y2="85%">
      <stop offset="0%" stop-color="#0B4534"/>
      <stop offset="50%" stop-color="#042F22"/>
      <stop offset="100%" stop-color="#011B13"/>
    </linearGradient>

    <radialGradient id="appleGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00FFA3" stop-opacity="0.45"/>
      <stop offset="65%" stop-color="#00C475" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#00C475" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="180" height="180" rx="40" fill="url(#appleBg)"/>
  <rect x="2" y="2" width="176" height="176" rx="38" fill="none" stroke="#00FFA3" stroke-width="1.5" stroke-opacity="0.25"/>

  <g transform="translate(18, 14) scale(1.44)">
    <ellipse cx="50" cy="91" rx="38" ry="4.5" fill="url(#appleGlow)"/>

    <path
      d="M 16 76 C 11 68 16 52 27 36 L 44 14 C 48 8 52 8 56 12 L 44 34 C 36 48 27 61 25 70 C 23 78 19 82 16 76 Z"
      fill="url(#appleLeft)"
    />

    <path
      d="M 44 14 C 47 19 45 29 40 39 L 27 62 C 21 73 26 81 35 79 C 39 77 43 71 45 64 L 49 43 C 49 32 47 21 44 14 Z"
      fill="url(#appleShaded)"
    />

    <path
      d="M 44 14 C 48 7 54 7 58 13 L 86 65 C 92 76 88 86 78 86 L 57 86 L 55 25 C 53 19 49 16 44 14 Z"
      fill="url(#appleMain)"
    />

    <path
      d="M 57 42 L 57 86 L 43 86 L 43 54 L 33 54 L 33 51 L 43 42 Z"
      fill="#FFFFFF"
    />
  </g>
</svg>`;
};

// ICO binary generator
function createIcoFile(pngBuffers) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = numImages * dirEntrySize;
  let offset = headerSize + dirSize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(numImages, 4);

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
    entry.writeUInt32LE(offset, 12);
    offset += img.buffer.length;
    dirEntries.push(entry);
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(img => img.buffer)]);
}

async function run() {
  console.log('🎨 Generating Standalone Agent One Favicon Assets...');

  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'src', 'app');

  const standardFaviconSvg = createFaviconSvg();
  const appleSvg = createAppleTouchSvg();
  const pngSvg = createPngSvg();

  // 1. Write SVG favicons
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standardFaviconSvg);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardFaviconSvg);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), standardFaviconSvg);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.svg'), appleSvg);
  fs.writeFileSync(path.join(appDir, 'apple-icon.svg'), appleSvg);

  // 2. Generate PNG frames
  const sizes = [16, 32, 48, 64, 128, 192, 512];
  const pngFrames = [];

  for (const size of sizes) {
    const buf = await sharp(Buffer.from(pngSvg))
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, `favicon-${size}x${size}.png`), buf);
    if (size === 192 || size === 512) {
      fs.writeFileSync(path.join(publicDir, `icon-${size}.png`), buf);
    }
    if ([16, 32, 48].includes(size)) {
      pngFrames.push({ width: size, height: size, buffer: buf });
    }
  }

  // Apple touch PNG
  const appleBuf = await sharp(Buffer.from(appleSvg))
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), appleBuf);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleBuf);

  // 3. Multi-resolution favicon.ico
  const icoBuffer = createIcoFile(pngFrames);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

  console.log('✅ Generated standalone favicon and icon assets across public and src/app.');
}

run().catch(console.error);
