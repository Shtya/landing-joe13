'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher({ currentLocale }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (locale) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {['en', 'ar'].map(loc => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className="px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200"
          style={currentLocale === loc
            ? { background: 'var(--primary)', color: '#fff' }
            : { color: 'var(--muted)' }
          }
        >
          {loc === 'en' ? 'EN' : 'عر'}
        </button>
      ))}
    </div>
  )
}
