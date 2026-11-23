// /manifest.webmanifest — install name and icons (icons from scripts/brand-assets.cjs).
export default function manifest() {
  return {
    name: 'JOE13 — Software Studio',
    short_name: 'JOE13',
    description: 'JOE13 designs and engineers digital products: web platforms, mobile apps, cloud and AI.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#03060f',
    theme_color: '#03060f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
