'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const SOCIALS = [
  { name: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
  { name: 'Twitter', path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
  { name: 'GitHub', path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
  { name: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01 M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z' },
];

const FOOTER_HREFS = {
  links: ['#hero', '#services', '#work', '#hero', '#hero', '#contact'],
  services: ['#services', '#services', '#services', '#services', '#services', '#contact'],
  legal: ['#', '#', '#', '#'],
};

export default function Footer({ copy }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050814] pt-16 pb-8">
      <div className="l1-container grid sm:grid-cols-2 lg:grid-cols-6 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <span className="w-8 h-8 rounded-full border border-blue-400 grid place-items-center text-cyan-300">N</span>
            Nexus
          </div>
          <p className="text-sm text-slate-400">{copy.footer.about}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{copy.footer.columns.links}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {copy.footer.links.map((label, i) => (
              <li key={label}><a className="l1-link" href={FOOTER_HREFS.links[i]}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{copy.footer.columns.services}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {copy.footer.services.map((label, i) => (
              <li key={label}><a className="l1-link" href={FOOTER_HREFS.services[i]}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{copy.footer.columns.legal}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {copy.footer.legal.map((label) => (
              <li key={label}><a className="l1-link" href="#">{label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{copy.footer.columns.contact}</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📞 {copy.footer.phone}</li>
            <li>📧 {copy.footer.email}</li>
            <li>📍 {copy.footer.address}</li>
          </ul>
          <p className="text-xs font-semibold mt-4 mb-1 text-slate-300">{copy.footer.hoursTitle}</p>
          <ul className="space-y-1 text-xs text-slate-500">
            {copy.footer.hours.map((row) => <li key={row}>{row}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{copy.footer.columns.follow}</h3>
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a key={social.name} href="#" className="w-9 h-9 rounded-lg border border-white/10 grid place-items-center text-slate-400 hover:text-white hover:scale-110 transition-all" aria-label={social.name}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
                </svg>
              </a>
            ))}
          </div>
          <div className="mt-6 flex rounded-full border border-white/10 p-1 text-xs font-semibold w-fit">
            {['ar', 'en'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={`px-3 py-1 rounded-full ${locale === loc ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                {loc === 'ar' ? '🌐 عربي' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="l1-container mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-2 md:items-center justify-between text-xs text-slate-500">
        <span>{copy.footer.copyright}</span>
        <span>{copy.footer.made} | {copy.footer.updated}</span>
      </div>
    </footer>
  );
}
