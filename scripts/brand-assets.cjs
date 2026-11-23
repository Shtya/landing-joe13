/*
 * Generate favicons, app icons and the social share card from the logo.
 *
 *   public/logos/logo-white.png  →  app/favicon.ico        16/32/48 px (browser tab)
 *                                   app/icon.png           512 px, transparent "J" mark
 *                                   app/apple-icon.png     180 px, "J" on the brand ground
 *                                   public/icon-192.png    PWA / Android (manifest)
 *                                   public/icon-512.png    PWA / Android (manifest)
 *                                   public/og-image.png    1200×630 share card
 *
 * The square icons use the "J" mark at the left of the wordmark; the full
 * wordmark is too wide to read at 16px.
 *
 * Needs `sharp` (not a project dependency). Run it with:
 *   npx -y -p sharp@0.33.5 node scripts/brand-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'logos', 'logo-white.png');
const GROUND = '#03060f'; // dark theme page ground (see viewport themeColor)

// The "J" sits in the left quarter of the 2163×727 wordmark.
async function mark() {
    const { width, height } = await sharp(LOGO).metadata();
    const left = await sharp(LOGO).extract({ left: 0, top: 0, width: Math.round(width * 0.236), height }).png().toBuffer();
    return sharp(left).trim({ threshold: 10 }).png().toBuffer();
}

// Mark centred on a square canvas; `fill` = share of the canvas it occupies.
async function square(markPng, size, fill, background) {
    const inner = Math.round(size * fill);
    const fitted = await sharp(markPng).resize(inner, inner, { fit: 'inside' }).png().toBuffer();
    const meta = await sharp(fitted).metadata();
    return sharp({ create: { width: size, height: size, channels: 4, background } })
        .composite([{ input: fitted, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
        .png()
        .toBuffer();
}

// Minimal ICO writer: one PNG-compressed image per size (supported by every
// current browser and by Windows since Vista).
function ico(pngs) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngs.length, 4);
    const entries = [];
    let offset = 6 + 16 * pngs.length;
    for (const { size, data } of pngs) {
        const e = Buffer.alloc(16);
        e.writeUInt8(size >= 256 ? 0 : size, 0);
        e.writeUInt8(size >= 256 ? 0 : size, 1);
        e.writeUInt8(0, 2);
        e.writeUInt8(0, 3);
        e.writeUInt16LE(1, 4);
        e.writeUInt16LE(32, 6);
        e.writeUInt32LE(data.length, 8);
        e.writeUInt32LE(offset, 12);
        offset += data.length;
        entries.push(e);
    }
    return Buffer.concat([header, ...entries, ...pngs.map(p => p.data)]);
}

async function ogImage() {
    const W = 1200;
    const H = 630;
    // Brand ground with a soft cobalt glow, like the site's hero.
    const bg = Buffer.from(
        `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="g" cx="50%" cy="38%" r="70%">
                    <stop offset="0" stop-color="#123a8f" stop-opacity="0.85"/>
                    <stop offset="0.55" stop-color="#071433" stop-opacity="0.9"/>
                    <stop offset="1" stop-color="${GROUND}"/>
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="${GROUND}"/>
            <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>`,
    );
    const logo = await sharp(LOGO).resize({ width: 840 }).png().toBuffer();
    const meta = await sharp(logo).metadata();
    return sharp(bg)
        .composite([{ input: logo, left: Math.round((W - meta.width) / 2), top: Math.round((H - meta.height) / 2) }])
        .png({ compressionLevel: 9 })
        .toBuffer();
}

(async () => {
    const m = await mark();
    const clear = { r: 0, g: 0, b: 0, alpha: 0 };
    const ground = GROUND;

    const write = (rel, data) => fs.writeFileSync(path.join(ROOT, rel), data);

    write('app/icon.png', await square(m, 512, 0.9, clear));
    write('app/apple-icon.png', await square(m, 180, 0.72, ground));
    // Maskable-safe: the mark stays inside the central 80% circle.
    write('public/icon-192.png', await square(m, 192, 0.62, ground));
    write('public/icon-512.png', await square(m, 512, 0.62, ground));
    write(
        'app/favicon.ico',
        ico(await Promise.all([16, 32, 48].map(async size => ({ size, data: await square(m, size, 0.96, clear) })))),
    );
    write('public/og-image.png', await ogImage());
    console.log('brand assets written');
})();
