'use client';

import Image from 'next/image';
import { IconAsset, Reveal, ArrowIcon, LocaleSwitch, SiteLogo } from '../ui';import { L2_BTN_ICON } from '../tokens';

const FOOTER_HREFS = {
  links: ['#hero', '#services', '#work', '#about', '#blog', '#contact'],
  services: ['#services', '#services', '#services', '#services', '#services', '#contact'],
};

const STRENGTHS = {
  en: [
    { title: 'Secure & Reliable', desc: 'Enterprise-grade security and reliability.', icon: 'secure-reliable' },
    { title: 'On-Time Delivery', desc: 'We value your time and always deliver on schedule.', icon: 'clock' },
    { title: 'Expert Team', desc: 'Experienced professionals passionate about your success.', icon: 'expert-team' },
    { title: 'Measurable Results', desc: 'Data-driven approach that delivers real impact.', icon: 'measurable-results' },
    { title: '24/7 Support', desc: "We're here whenever you need us.", icon: 'support' },
  ],
  ar: [
    { title: 'آمن وموثوق', desc: 'أمان وموثوقية على مستوى المؤسسات.', icon: 'secure-reliable' },
    { title: 'تسليم في الوقت', desc: 'نحترم وقتك ونلتزم بالمواعيد دائماً.', icon: 'clock' },
    { title: 'فريق خبراء', desc: 'محترفون ذوو خبرة شغوفون بنجاحك.', icon: 'expert-team' },
    { title: 'نتائج قابلة للقياس', desc: 'نهج مبني على البيانات يحقق أثراً حقيقياً.', icon: 'measurable-results' },
    { title: 'دعم 24/7', desc: 'نحن هنا عندما تحتاجنا.', icon: 'support' },
  ],
};

const GLOBAL_COPY = {
  en: {
    title: 'Global',
    grad: 'Impact',
    desc: 'Delivering digital solutions that make a difference worldwide.',
  },
  ar: {
    title: 'أثر',
    grad: 'عالمي',
    desc: 'نقدّم حلولاً رقمية تصنع فرقاً حول العالم.',
  },
};

function GradientRule({ className = 'mb-5 h-1 w-[34px] rounded bg-[linear-gradient(90deg,#168dff,#7b2dff)]' }) {
  return <div className={className} aria-hidden="true" />;
}

function FooterLinkList({ items, hrefs }) {
  return (
    <ul className="m-0 list-none p-0">
      {items.map((label, index) => (
        <li
          key={label}
          className="flex h-[63px] items-center gap-[15px] border-b border-[rgba(39,67,101,0.6)] text-[15px] text-[#a7b8d3] last:border-b-0"
        >
          <span className="text-[22px] text-[#1686ff]" aria-hidden="true">
            ›
          </span>
          <a href={hrefs[index] || '#contact'} className="text-inherit no-underline transition-colors hover:text-[#d8e4f8]">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContactIconBox({ children }) {
  return (
    <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-xl border border-[#234873] bg-[#0a1d38] text-[#2387ff]">
      {children}
    </div>
  );
}

export default function Footer({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const strengths = STRENGTHS[isAr ? 'ar' : 'en'];
  const global = GLOBAL_COPY[isAr ? 'ar' : 'en'];
  const hours = copy.footer.hours || [];

  return (
    <footer
      id="footer"
      className="overflow-hidden bg-[radial-gradient(700px_380px_at_50%_40%,rgba(19,76,164,0.09),transparent_72%),linear-gradient(180deg,#010610,#020817)] px-[15px] pb-[88px] pt-[94px] max-[560px]:px-2 max-[560px]:pb-5 max-[560px]:pt-5"
    >
      <div className="mx-auto min-h-[840px] w-full max-w-[1506px] rounded-[31px] border border-[#163253] bg-[linear-gradient(145deg,rgba(4,17,35,0.97),rgba(2,11,25,0.99))] px-[51px] py-12 shadow-[inset_0_1px_rgba(122,173,255,0.06),0_28px_70px_rgba(0,0,0,0.38)] max-[1200px]:w-[96%] max-[1200px]:px-[30px] max-[560px]:rounded-[22px] max-[560px]:px-5 max-[560px]:py-7">
        <Reveal>
          <div className="grid min-h-[525px] grid-cols-1 gap-0 max-[850px]:grid-cols-2 max-[1200px]:grid-cols-[250px_repeat(4,minmax(0,1fr))] min-[1201px]:grid-cols-[272px_repeat(5,minmax(0,1fr))] max-[850px]:gap-y-8 max-[560px]:grid-cols-1">
            {/* Brand */}
            <section className="border-[#183457] pe-[35px] max-[850px]:col-span-full max-[850px]:border-b max-[850px]:border-e-0 max-[850px]:pb-9 max-[850px]:pe-0 min-[1201px]:border-e">
              <div className="mb-7 flex items-center gap-4">
                <SiteLogo variant="white" alt={copy.brand} className="h-[38px] w-[min(180px,100%)]" />
              </div>
              <GradientRule className="mb-9 h-1 w-[50px] rounded bg-[linear-gradient(90deg,#168dff,#7b2dff)]" />
              <p className="m-0 mb-8 text-[17px] leading-[1.8] text-[#aab9d3]">{copy.footer.about}</p>

              <div className="relative min-h-[295px] w-full max-w-[270px] overflow-hidden rounded-[21px] border border-[#1d4a83] bg-[linear-gradient(150deg,rgba(9,29,57,0.93),rgba(3,16,34,0.96))] p-7 shadow-[inset_0_1px_rgba(139,189,255,0.08),0_12px_30px_rgba(0,0,0,0.22)] max-[560px]:max-w-none">
                <Image
                  src="/icons/world_image.png"
                  alt=""
                  fill
                  sizes="270px"
                  className="object-cover opacity-35"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-[rgba(2,12,25,0.43)]" aria-hidden="true" />
                <div className="relative z-[2]">
                  <div className="mb-6 grid h-[46px] w-[46px] place-items-center rounded-[11px] border border-[#285083] bg-[#0b2447]">
                    <IconAsset name="network-globe" size={26} scale={1.05} />
                  </div>
                  <h3 className="mb-2.5 text-2xl font-bold text-[#f5f8ff]">
                    {global.title} <span className="text-[#3673ff]">{global.grad}</span>
                  </h3>
                  <p className="m-0 mb-5 text-sm leading-[1.65] text-[#9eb0cd]">{global.desc}</p>
                  <a
                    href="#contact"
                    className={`${L2_BTN_ICON} text-white no-underline`}
                    aria-label={isAr ? 'تواصل معنا' : 'Contact us'}
                  >
                    <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* Quick Links */}
            <nav className="border-[#183457] px-9 max-[1200px]:px-[22px] max-[850px]:border-e-0 max-[850px]:px-5 min-[1201px]:border-e">
              <h2 className="m-0 text-[21px] font-semibold text-[#f5f8ff]">{copy.footer.columns.links}</h2>
              <GradientRule />
              <FooterLinkList items={copy.footer.links} hrefs={FOOTER_HREFS.links} />
            </nav>

            {/* Services */}
            <nav className="border-[#183457] px-9 max-[1200px]:px-[22px] max-[850px]:border-e-0 max-[850px]:px-5 min-[1201px]:border-e">
              <h2 className="m-0 text-[21px] font-semibold text-[#f5f8ff]">{copy.footer.columns.services}</h2>
              <GradientRule />
              <FooterLinkList items={copy.footer.services} hrefs={FOOTER_HREFS.services} />
            </nav>

            {/* Legal */}
            <nav className="border-[#183457] px-9 max-[1200px]:px-[22px] max-[850px]:border-e-0 max-[850px]:px-5 min-[1201px]:border-e">
              <h2 className="m-0 text-[21px] font-semibold text-[#f5f8ff]">{copy.footer.columns.legal}</h2>
              <GradientRule />
              <FooterLinkList items={copy.footer.legal} hrefs={copy.footer.legal.map(() => '#footer')} />
            </nav>

            {/* Contact */}
            <section className="border-[#183457] px-9 max-[1200px]:px-[22px] max-[850px]:border-e-0 max-[850px]:px-5 min-[1201px]:border-e">
              <h2 className="m-0 text-[21px] font-semibold text-[#f5f8ff]">{copy.footer.columns.contact}</h2>
              <GradientRule />
              <div className="mb-6 flex items-center gap-[17px]">
                <ContactIconBox>
                  <IconAsset name="phone-call" size={28} scale={1.05} />
                </ContactIconBox>
                <span className="text-sm text-[#a9b8d1]">{copy.footer.phone}</span>
              </div>
              <div className="mb-6 flex items-center gap-[17px]">
                <ContactIconBox>
                  <IconAsset name="archive" size={28} scale={1.05} />
                </ContactIconBox>
                <span className="text-sm text-[#a9b8d1]">{copy.footer.email}</span>
              </div>
              <div className="flex items-center gap-[17px]">
                <ContactIconBox>
                  <IconAsset name="location-pin" size={28} scale={1.05} />
                </ContactIconBox>
                <span className="text-sm text-[#a9b8d1]">{copy.footer.address}</span>
              </div>
            </section>

            {/* Follow Us */}
            <section className="px-9 max-[1200px]:px-[22px] max-[850px]:px-5">
              <h2 className="m-0 text-[21px] font-semibold text-[#f5f8ff]">{copy.footer.columns.follow}</h2>
              <GradientRule />
              <div className="mt-6 flex flex-wrap gap-[11px]" aria-label={copy.footer.columns.follow}>
                {[
                  { label: 'LinkedIn', icon: 'linkedin', href: '#footer' },
                  { label: 'Twitter', icon: 'twitter', href: '#footer' },
                  { label: 'Facebook', icon: 'facebook', href: '#footer' },
                  { label: 'Instagram', icon: 'instagram', href: '#footer' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-14 w-14 place-items-center rounded-xl border border-[#24466d] bg-[#07182f] text-[#2587ff] no-underline transition-[border-color,transform] hover:scale-105 hover:border-[#3a7fd4]"
                  >
                    <IconAsset name={social.icon} size={26} scale={1.08} />
                  </a>
                ))}
              </div>
              <div className="my-[38px] h-px bg-[#203c5f]" />
              <LocaleSwitch className="max-[560px]:w-full max-[560px]:justify-center" />
              <div className="mt-12">
                <div className="mb-4 flex items-center gap-4 text-base font-bold text-[#f5f8ff]">
                  <ContactIconBox>
                    <IconAsset name="clock" size={26} scale={1.05} />
                  </ContactIconBox>
                  {copy.footer.hoursTitle}
                </div>
                <p className="m-0 text-sm leading-8 text-[#a7b8d1]">
                  {hours.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </section>
          </div>
        </Reveal>
 

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#203c5f] pt-6 text-sm text-[#9eafca] max-[560px]:flex-col max-[560px]:items-start">
            <span>{copy.footer.copyright?.replace('Nexus', copy.brand) ?? `© 2026 ${copy.brand}`}</span>
            <span>{copy.footer.made}</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
