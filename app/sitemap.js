export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexus.dev'
  const locales = ['en', 'ar']

  const routes = ['', '#services', '#portfolio', '#contact']

  const urls = []
  for (const locale of locales) {
    for (const route of routes) {
      urls.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
      })
    }
  }

  return urls
}
