'use client';

import { useTranslations } from 'next-intl';

export default function Team() {
  const t = useTranslations('team');
  const members = t.raw('members');

  return (
    <section
      id="team"
      className="section-base py-24 section-with-blur"
      aria-labelledby="team-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--color-overlay)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            {t('badge')}
          </div>
          <h2
            id="team-heading"
            className="font-bold mb-3"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)' }}
          >
            {t('headline')}
          </h2>
          <p style={{ color: 'var(--color-muted)' }}>{t('subheadline')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => {
            const initials = member.name.split(' ').map(n => n[0]).join('');
            const colors = ['#2E6B74', '#4A9E7A', '#4DC9D8', '#5DBF96'];
            const bgColor = colors[i % colors.length];

            return (
              <div
                key={i}
                className="flip-card h-64"
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div
                    className="flip-card-front rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                    style={{
                      background: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-4"
                      style={{ background: bgColor, color: '#fff' }}
                    >
                      {initials}
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                      {member.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
                      {member.role}
                    </p>
                  </div>

                  {/* Back */}
                  <div
                    className="flip-card-back rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                    style={{
                      background: bgColor,
                    }}
                  >
                    <p className="text-sm text-white leading-relaxed mb-5">
                      {member.bio}
                    </p>
                    <div className="flex gap-3">
                      {['LinkedIn', 'GitHub'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                          style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                          {social}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
