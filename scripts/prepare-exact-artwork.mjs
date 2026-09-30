import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcPath = 'C:/Users/shush/.gemini/antigravity/brain/ff26d50e-4567-4aec-88c3-c1a62e90b4e5/.user_uploaded/media_1790759777935.png';

// Alpha keying helper to make light studio background transparent while preserving anti-aliasing & shadows
function removeBackground(data, w, h, isLogoDark = false) {
  const out = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      let r = data[idx];
      let g = data[idx + 1];
      let b = data[idx + 2];

      // Check if inside clear background zones:
      // Zone 1: Above the wordmark (x > 220 and y < 40)
      const isAboveWordmark = (x > 210 && y < 42);
      // Zone 2: Far top-right studio gradient (x > 650 && y < 65)
      const isTopRightCorner = (x > 650 && y < 58);
      // Zone 3: Above symbol crest (y < 6)
      const isAboveSymbol = (x <= 210 && y < 6);
      const isBelowSymbol = (x <= 210 && y >= 178);

      if (isAboveWordmark || isTopRightCorner || isAboveSymbol || isBelowSymbol) {
        out[idx] = r;
        out[idx + 1] = g;
        out[idx + 2] = b;
        out[idx + 3] = 0;
        continue;
      }

      const isGreenColor = (g > r + 25 && g > b + 25) || (g > 150 && g - r > 15);
      const isDarkTextOrShadow = (r < 140 && g < 140 && b < 140);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      let alpha = 255;
      if (!isGreenColor && !isDarkTextOrShadow) {
        if (luminance >= 248) {
          alpha = 0;
        } else if (luminance >= 220) {
          const t = (248 - luminance) / 28;
          alpha = Math.min(255, Math.max(0, Math.round(t * 255)));
        }
      }

      // If generating dark-mode version:
      // Word 'Agent' spans x: 210 to 575, and y: 40 to 154 (includes bottom of 'g')
      if (isLogoDark && alpha > 0) {
        if (x >= 210 && x <= 575 && y <= 152 && !isGreenColor) {
          // 'Agent' wordmark -> crisp white
          r = 255;
          g = 255;
          b = 255;
        } else if (x >= 210 && y > 152 && !isGreenColor) {
          // Tagline -> light slate (#94A3B8)
          r = 148;
          g = 163;
          b = 184;
        }
      }

      out[idx] = r;
      out[idx + 1] = g;
      out[idx + 2] = b;
      out[idx + 3] = alpha;
    }
  }

  return out;
}

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
  console.log('🖼️  Extracting Exact Original Agent One Artwork...');

  const rootDir = process.cwd();
  const brandDir = path.join(rootDir, 'public', 'brand');
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'src', 'app');

  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

  // 1. Crop exact full logo: left 106, top 218, width 818, height 188
  const logoCrop = await sharp(srcPath)
    .extract({ left: 106, top: 218, width: 818, height: 188 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const logoLightBuf = removeBackground(logoCrop.data, logoCrop.info.width, logoCrop.info.height, false);
  const logoDarkBuf = removeBackground(logoCrop.data, logoCrop.info.width, logoCrop.info.height, true);

  await sharp(logoLightBuf, { raw: { width: logoCrop.info.width, height: logoCrop.info.height, channels: 4 } })
    .png()
    .toFile(path.join(brandDir, 'agent-one-logo.png'));
  console.log('✅ Saved exact original logo (light theme): public/brand/agent-one-logo.png');

  await sharp(logoDarkBuf, { raw: { width: logoCrop.info.width, height: logoCrop.info.height, channels: 4 } })
    .png()
    .toFile(path.join(brandDir, 'agent-one-logo-dark.png'));
  console.log('✅ Saved exact original logo (dark theme): public/brand/agent-one-logo-dark.png');

  // 2. Crop exact standalone symbol: left 106, top 218, width 210, height 188
  const symbolCrop = await sharp(srcPath)
    .extract({ left: 106, top: 218, width: 210, height: 188 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const symbolAlphaBuf = removeBackground(symbolCrop.data, symbolCrop.info.width, symbolCrop.info.height, false);

  const rawSymbolPng = await sharp(symbolAlphaBuf, {
    raw: { width: symbolCrop.info.width, height: symbolCrop.info.height, channels: 4 }
  }).png().toBuffer();

  // 3. Create square, perfectly centered symbol icon (512x512) with balanced padding
  const squareSize = 512;
  const targetSymbolSize = Math.round(squareSize * 0.78); // 400px symbol inside 512px canvas (14% padding)

  const resizedSymbol = await sharp(rawSymbolPng)
    .resize(targetSymbolSize, targetSymbolSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const squareIconBuffer = await sharp({
    create: {
      width: squareSize,
      height: squareSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resizedSymbol, gravity: 'center' }])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(brandDir, 'agent-one-symbol.png'), squareIconBuffer);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), squareIconBuffer);
  console.log('✅ Saved exact square centered symbol: public/brand/agent-one-symbol.png & public/icon-512.png');

  // 4. Generate all favicon sizes directly from the exact square symbol
  const sizes = [16, 32, 48, 64, 128, 192];
  const icoFrames = [];

  for (const size of sizes) {
    const buf = await sharp(squareIconBuffer)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, `favicon-${size}x${size}.png`), buf);
    if (size === 192) {
      fs.writeFileSync(path.join(publicDir, 'icon-192.png'), buf);
    }
    if ([16, 32, 48].includes(size)) {
      icoFrames.push({ width: size, height: size, buffer: buf });
    }
    console.log(`✅ Generated favicon ${size}x${size} from exact artwork`);
  }

  // Apple touch icon (180x180)
  const appleBuf = await sharp(squareIconBuffer)
    .resize(180, 180, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), appleBuf);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleBuf);
  console.log('✅ Generated apple-touch-icon.png (180x180)');

  // 5. Generate multi-resolution favicon.ico
  const icoBuffer = createIcoFile(icoFrames);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✅ Generated multi-resolution favicon.ico in public and src/app');

  // 6. SVG wrapping exact base64 image of original symbol
  const base64Data = squareIconBuffer.toString('base64');
  const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${base64Data}" width="512" height="512" />
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgWrapper);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgWrapper);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgWrapper);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.svg'), svgWrapper);
  fs.writeFileSync(path.join(appDir, 'apple-icon.svg'), svgWrapper);
  console.log('✅ Generated exact SVG wrappers embedding original artwork base64');

  console.log('🚀 Exact Agent One artwork extraction and favicon preparation complete!');
}

run().catch(console.error);
