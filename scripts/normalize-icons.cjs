/*
 * Normalise the 3D icon set for <Icon3D>.
 *
 *   public/icons/<name>.png  →  public/icons/3d/<name>.webp
 *
 * The source renders come in different canvas sizes (1536×1024, 1312×1199,
 * 1374×1145…) with uneven transparent padding, so at the same CSS size some
 * icons looked big, some tiny, and some touched or overflowed the card edge.
 * Each icon is trimmed to its visible pixels, then centred on a square
 * transparent canvas with the same margin all round, so every icon has the
 * same optical size and stays inside its box.
 *
 * Needs `sharp` (not a project dependency). Run it with:
 *   npx -y -p sharp@0.33.5 node scripts/normalize-icons.cjs
 * Re-run whenever an icon is added or replaced in public/icons.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'public', 'icons');
const OUT = path.join(SRC, '3d');
const CANVAS = 512; // px; covers the largest on-screen use (270px) at 2× DPR minus margin
const FILL = 0.9; // the icon's longest side fills 90% of the canvas

async function normalise(file) {
    const trimmed = await sharp(path.join(SRC, file)).trim({ threshold: 10 }).toBuffer();
    const inner = Math.round(CANVAS * FILL);
    const fitted = await sharp(trimmed).resize(inner, inner, { fit: 'inside' }).toBuffer();
    const { width, height } = await sharp(fitted).metadata();
    await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: fitted, left: Math.round((CANVAS - width) / 2), top: Math.round((CANVAS - height) / 2) }])
        .webp({ quality: 86, alphaQuality: 95, effort: 6 })
        .toFile(path.join(OUT, file.replace(/\.png$/i, '.webp')));
}

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const files = fs.readdirSync(SRC).filter(f => /\.png$/i.test(f));
    for (const file of files) await normalise(file);
    console.log(`normalised ${files.length} icons → public/icons/3d`);
})();
