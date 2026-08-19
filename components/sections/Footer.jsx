'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const footerLinks = {
  company: ['about', 'team', 'careers', 'blog'],
  services: ['web', 'mobile', 'cloud', 'ai'],
  resources: ['docs', 'changelog', 'status', 'support'],
  legal: ['privacy', 'terms', 'cookies', 'security'],
}

export default function Footer() {
  const t = useTranslations('footer')
  const router = useRouter()
  const pathname = usePathname()
  const [showTop, setShowTop] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const switchLocale = (locale) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer style={{ background: '#0C1416', borderTop: '1px solid #1E2E30' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-12">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#4DC9D8" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="6" fill="#4DC9D8" opacity="0.3" />
                <circle cx="16" cy="16" r="2.5" fill="#4DC9D8" />
                <line x1="16" y1="1" x2="16" y2="31" stroke="#4DC9D8" strokeWidth="0.5" opacity="0.3" />
                <line x1="1" y1="16" x2="31" y2="16" stroke="#4DC9D8" strokeWidth="0.5" opacity="0.3" />
              </svg>
              <span className="text-xl font-black text-white">Nexus</span>
            </div>
            <p className="text-sm max-w-xs" style={{ color: '#6FA0A6' }}>{t('tagline')}</p>
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
            {[
              { name: 'Twitter', path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
              { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
              { name: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
            ].map(s => (
              <a key={s.name} href="#" aria-label={s.name}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ background: '#131E20', border: '1px solid #1E2E30' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#6FA0A6" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Nav grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-white">{t(`nav.${group}`)}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm transition-colors hover:text-white" style={{ color: '#6FA0A6' }}>
                      {t(`links.${item}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl p-6 mb-12" style={{ background: '#131E20', border: '1px solid #1E2E30' }}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{t('newsletter.title')}</h4>
              <p className="text-sm" style={{ color: '#6FA0A6' }}>{t('newsletter.subtitle')}</p>
            </div>
            {subscribed ? (
              <p className="text-sm" style={{ color: '#5DBF96' }}>✓ {t('newsletter.subscribed')}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  className="flex-1 md:w-56 px-4 py-2 rounded-xl text-sm outline-none"
                  style={{ background: '#0C1416', border: '1px solid #1E2E30', color: '#DFF0F2' }}
                />
                <button type="submit" className="px-4 py-2 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
                  style={{ background: '#4DC9D8' }}>
                  {t('newsletter.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid #1E2E30' }}>
          <p className="text-sm" style={{ color: '#6FA0A6' }}>
            © {new Date().getFullYear()} Nexus. {t('copyright')} ❤️
          </p>

          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex gap-2">
              {['en', 'ar'].map(loc => (
                <button key={loc} onClick={() => switchLocale(loc)}
                  className="text-xs px-2 py-1 rounded-md font-medium transition-colors"
                  style={{ color: '#6FA0A6', background: '#131E20' }}>
                  {loc === 'en' ? 'EN' : 'عر'}
                </button>
              ))}
            </div>

            {/* Back to top */}
            {showTop && (
              <button onClick={scrollTop}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:-translate-y-0.5"
                style={{ background: '#131E20', border: '1px solid #1E2E30', color: '#4DC9D8' }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                {t('backToTop')}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
