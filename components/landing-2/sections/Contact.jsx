'use client';

import Image from 'next/image';
import { Reveal, PrimaryButton, IconAsset, SiteLogo } from '../ui';
import { L2_GRAD } from '../tokens';

const COPY = {
  en: {
    badge: 'Ready to turn your idea into reality?',
    titleLead: 'Ready to',
    titleGrad: 'Transform',
    titleTail: 'Your Vision?',
    subtitle: "Let's discuss your project and bring it to life",
    arLine: 'Let us talk about your project',
    infoTitle: 'We turn ideas into',
    infoStrong: 'powerful digital',
    infoTail: 'solutions.',
    features: [
      { icon: 'expert-team', title: 'Expert Team', desc: '15+ years of experience' },
      { icon: 'approach', title: 'Fast Delivery', desc: 'On-time, every time' },
      { icon: 'measurable-results', title: 'Results Driven', desc: 'Focused on your success' },
    ],
    fields: {
      name: { label: 'Full Name', placeholder: 'Your full name', icon: 'users' },
      email: { label: 'Email Address', placeholder: 'your@email.com', icon: 'archive' },
      phone: { label: 'Phone Number', placeholder: '+966', icon: 'phone-call' },
      company: { label: 'Company Name', placeholder: 'Your company name', icon: 'cube' },
      type: { label: 'Project Type', placeholder: 'Select project type', icon: 'tag' },
      timeline: { label: 'Project Timeline', placeholder: 'Select timeline', icon: 'clock' },
      budget: { label: 'Budget Range', placeholder: 'Select budget range', icon: 'credit-card' },
      message: { label: 'Message (optional)', placeholder: 'Tell us more about your project...', icon: 'web-design' },
    },
    projectTypes: ['Web Application', 'Mobile App', 'E-Commerce', 'SaaS Platform', 'Custom Software'],
    timelines: ['1-2 months', '3-4 months', '5-6 months', '6+ months'],
    budgets: ['$5K - $15K', '$15K - $50K', '$50K - $100K', '$100K+'],
    cta: 'BOOK FREE CONSULTATION',
    response: "We'll get back to you within",
    responseTime: '24 hours',
    strip: [
      { key: 'whatsapp', title: 'WhatsApp', value: '+966-XXX-XXX', tone: 'whatsapp' },
      { key: 'email', title: 'Email', value: 'hello@joe13.dev', tone: 'email' },
      { key: 'location', title: 'Location', value: 'Riyadh, Saudi Arabia', tone: 'location' },
    ],
  },
  ar: {
    badge: 'جاهز لتحويل فكرتك إلى واقع؟',
    titleLead: 'جاهز',
    titleGrad: 'لتحويل',
    titleTail: 'رؤيتك؟',
    subtitle: 'لنناقش مشروعك ونحوّله إلى واقع',
    arLine: 'دعونا نتحدث عن مشروعك',
    infoTitle: 'نحوّل الأفكار إلى',
    infoStrong: 'حلول رقمية',
    infoTail: 'قوية.',
    features: [
      { icon: 'expert-team', title: 'فريق خبراء', desc: 'أكثر من 15 سنة خبرة' },
      { icon: 'approach', title: 'تسليم سريع', desc: 'في الوقت المحدد دائماً' },
      { icon: 'measurable-results', title: 'نتائج ملموسة', desc: 'نركز على نجاحك' },
    ],
    fields: {
      name: { label: 'الاسم الكامل', placeholder: 'اسمك الكامل', icon: 'users' },
      email: { label: 'البريد الإلكتروني', placeholder: 'your@email.com', icon: 'archive' },
      phone: { label: 'رقم الهاتف', placeholder: '+966', icon: 'phone-call' },
      company: { label: 'اسم الشركة', placeholder: 'اسم شركتك', icon: 'cube' },
      type: { label: 'نوع المشروع', placeholder: 'اختر نوع المشروع', icon: 'tag' },
      timeline: { label: 'الجدول الزمني', placeholder: 'اختر المدة', icon: 'clock' },
      budget: { label: 'الميزانية', placeholder: 'اختر نطاق الميزانية', icon: 'credit-card' },
      message: { label: 'رسالة (اختياري)', placeholder: 'أخبرنا المزيد عن مشروعك...', icon: 'web-design' },
    },
    projectTypes: ['تطبيق ويب', 'تطبيق جوال', 'تجارة إلكترونية', 'منصة SaaS', 'برمجيات مخصصة'],
    timelines: ['1-2 شهر', '3-4 أشهر', '5-6 أشهر', '6+ أشهر'],
    budgets: ['$5K - $15K', '$15K - $50K', '$50K - $100K', '$100K+'],
    cta: 'احجز استشارة مجانية',
    response: 'سنعود إليك خلال',
    responseTime: '24 ساعة',
    strip: [
      { key: 'whatsapp', title: 'واتساب', value: '+966-XXX-XXX', tone: 'whatsapp' },
      { key: 'email', title: 'البريد', value: 'hello@joe13.dev', tone: 'email' },
      { key: 'location', title: 'الموقع', value: 'الرياض، السعودية', tone: 'location' },
    ],
  },
};

function FieldControl({ icon, children, tall = false }) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-[10px] border border-[#dbe5f5] bg-white px-[15px] shadow-[0_3px_8px_rgba(32,74,144,0.035)] transition-[border-color,box-shadow] duration-200 focus-within:border-[#5590ff] focus-within:shadow-[0_4px_12px_rgba(32,74,144,0.06)] ${
        tall ? 'min-h-[82px] items-start py-3.5' : 'h-[52px]'
      }`}
    >
      <IconAsset name={icon} size={34} scale={1} className="shrink-0 text-[#274cff]" />
      {children}
    </div>
  );
}

function SelectChevron() {
  return (
    <svg className="ms-auto h-5 w-5 shrink-0 text-[#7185a8]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 8 L10 13 L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16v10H4V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockBadgeIcon() {
  return (
    <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-[#d9e3fb] text-[#2d64ff]">
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function StripIcon({ tone }) {
  const tones = {
    whatsapp: 'bg-[linear-gradient(135deg,#20db69,#22b956)]',
    email: 'bg-[linear-gradient(135deg,#1686ff,#2556e8)]',
    location: 'bg-[linear-gradient(135deg,#bd5bff,#7542e8)]',
  };

  return (
    <div className={`grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full text-white ${tones[tone]}`}>
      {tone === 'whatsapp' && <IconAsset name="whatsapp" size={24} scale={1.05} />}
      {tone === 'email' && <MailIcon className="h-[22px] w-[22px]" />}
      {tone === 'location' && <IconAsset name="location-pin" size={24} scale={1.05} />}
    </div>
  );
}

export default function Contact({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const t = COPY[isAr ? 'ar' : 'en'];
  const inputClass =
    'w-full flex-1 border-0 bg-transparent text-[13px] text-[#08183b] outline-none placeholder:text-[#6c7da1]';

  return (
    <section
      id="contact"
      className="relative min-h-[1024px] overflow-hidden bg-[radial-gradient(500px_260px_at_50%_45%,rgba(92,143,255,0.05),transparent_72%),linear-gradient(180deg,#fbfcff_0%,#fbfcff_68%,#f7faff_100%)] px-[clamp(1.25rem,3.6vw,3.3rem)] pb-[110px] pt-7 max-[1000px]:min-h-0 max-[1000px]:pb-[30px] max-md:px-5"
      aria-labelledby="l2c-heading"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[39px] top-[39px] h-[190px] w-[187px] max-[1000px]:hidden">
          <Image src="/contact-us/square.png" alt="" fill sizes="187px" className="object-contain mix-blend-multiply opacity-90" />
        </div>
        
        <div className="absolute right-[55px] top-[370px] h-[108px] w-[112px] max-[1000px]:hidden">
          <Image src="/contact-us/square.png" alt="" fill sizes="112px" className="object-contain mix-blend-multiply opacity-80" />
        </div>
        <div className="absolute left-[90px] top-[335px] h-[435px] w-[435px] rounded-full border border-[#aec3ff] opacity-75 max-[1000px]:hidden" />
        <div className="absolute right-[98px] top-[430px] h-[450px] w-[450px] rounded-full border border-[#aec3ff] opacity-75 max-[1000px]:hidden" />
      </div>

      <header className="relative z-[5] mx-auto text-center">
        <Reveal>
           
          <h2
            id="l2c-heading"
            className="my-4 mb-2 text-[60px] font-bold leading-[1.05] tracking-[-2.5px] text-[#08183b] max-[1000px]:px-[15px] max-[1000px]:text-[clamp(40px,7vw,60px)] max-[650px]:text-[39px]"
          >
            {isAr ? (
              <>
                {t.titleLead} <span className={`${L2_GRAD} not-italic`}>{t.titleGrad}</span> {t.titleTail}
              </>
            ) : (
              <>
                {t.titleLead} <span className={`${L2_GRAD} not-italic`}>{t.titleGrad}</span> {t.titleTail}
              </>
            )}
          </h2>
          <p className="m-0 text-[19px] text-[#8995b0] max-[1000px]:px-5 max-[1000px]:text-base">{t.subtitle}</p>
           
        </Reveal>
      </header>

      <Reveal delay={70}>
        <div className="relative z-[4] mx-auto mt-9 grid h-auto min-h-[641px] w-[1125px] max-w-[92vw] grid-cols-1 overflow-visible rounded-[28px] border border-[#e0e8f7] bg-white/[0.92] shadow-[0_18px_42px_rgba(35,76,151,0.11)] min-[1001px]:grid-cols-[296px_1fr]">
          <aside className="-m-px rounded-[28px] border border-[#e2e9f7] bg-[linear-gradient(145deg,#fbfdff,#f5f8ff)] px-7 pb-[30px] pt-12 shadow-[8px_0_28px_rgba(48,89,164,0.055)] min-[1001px]:me-0 min-[1001px]:rounded-e-none max-[1000px]:rounded-b-none max-[1000px]:rounded-t-[25px] max-[1000px]:px-[30px] max-[1000px]:py-[35px] max-[650px]:px-[22px]">
            <div className="relative mx-auto mb-[34px] grid h-[150px] w-[150px] place-items-center rounded-full bg-white">
              <SiteLogo variant="black" alt={copy.brand} className="relative z-[1] h-[52px] w-[115px]" />
            </div>
            <h3 className="mb-[22px] text-[27px] font-bold leading-[1.28] tracking-[-0.8px] text-[#08183b]">
              {t.infoTitle}{' '}
              <strong className="block font-bold text-[#2856ed]">{t.infoStrong}</strong>
              {t.infoTail}
            </h3>
            <div className="mb-7 h-[3px] w-[51px] bg-[linear-gradient(90deg,#6723f5,#4b38ff)]" />
            <div className="flex flex-col gap-6">
              {t.features.map((feature) => (
                <div key={feature.title} className="flex items-center gap-[15px]">
                  <div className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-xl border border-[#e0e8f7] bg-white shadow-[0_5px_14px_rgba(34,74,149,0.09)]">
                    <IconAsset name={feature.icon} size={64} scale={1} />
                  </div>
                  <div>
                    <b className="mb-1 block text-sm text-[#08183b]">{feature.title}</b>
                    <small className="text-xs text-[#617299]">{feature.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <form className="px-[46px] py-10 ps-[51px] max-[1000px]:px-[30px] max-[650px]:px-5 max-[650px]:py-[25px]" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-x-7 gap-y-[27px] max-[650px]:grid-cols-1 max-[650px]:gap-5">
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.name.label}</label>
                <FieldControl icon={t.fields.name.icon}>
                  <input type="text" placeholder={t.fields.name.placeholder} className={inputClass} />
                </FieldControl>
              </div>
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.email.label}</label>
                <FieldControl icon={t.fields.email.icon}>
                  <input type="email" placeholder={t.fields.email.placeholder} className={inputClass} />
                </FieldControl>
              </div>
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.phone.label}</label>
                <FieldControl icon={t.fields.phone.icon}>
                  <input type="tel" placeholder={t.fields.phone.placeholder} className={inputClass} />
                </FieldControl>
              </div>
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.company.label}</label>
                <FieldControl icon={t.fields.company.icon}>
                  <input type="text" placeholder={t.fields.company.placeholder} className={inputClass} />
                </FieldControl>
              </div>
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.type.label}</label>
                <FieldControl icon={t.fields.type.icon}>
                  <select className={`${inputClass} cursor-pointer appearance-none`} defaultValue="">
                    <option value="" disabled>
                      {t.fields.type.placeholder}
                    </option>
                    {t.projectTypes.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </FieldControl>
              </div>
              <div>
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.timeline.label}</label>
                <FieldControl icon={t.fields.timeline.icon}>
                  <select className={`${inputClass} cursor-pointer appearance-none`} defaultValue="">
                    <option value="" disabled>
                      {t.fields.timeline.placeholder}
                    </option>
                    {t.timelines.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </FieldControl>
              </div>
              <div className="col-span-full max-[650px]:col-span-1">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.budget.label}</label>
                <FieldControl icon={t.fields.budget.icon}>
                  <select className={`${inputClass} cursor-pointer appearance-none`} defaultValue="">
                    <option value="" disabled>
                      {t.fields.budget.placeholder}
                    </option>
                    {t.budgets.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <SelectChevron />
                </FieldControl>
              </div>
              <div className="col-span-full max-[650px]:col-span-1">
                <label className="mb-2.5 block text-[13px] font-semibold text-[#08183b]">{t.fields.message.label}</label>
                <FieldControl icon={t.fields.message.icon} tall>
                  <textarea placeholder={t.fields.message.placeholder} className={`${inputClass} min-h-[52px] resize-none`} rows={3} />
                </FieldControl>
              </div>
            </div>

            <div className="mt-[22px] flex items-center justify-between gap-[18px] max-[650px]:flex-col max-[650px]:items-start">
              <PrimaryButton
                type="submit"
                size="sm"
                className="w-[335px] max-w-full text-sm font-bold tracking-[0.8px] max-[650px]:w-full"
              >
                {t.cta}
              </PrimaryButton>
              <div className="flex items-center gap-2 text-xs text-[#7683a2] max-[650px]:self-end">
                <ClockBadgeIcon />
                <span>
                  {t.response} <b className="text-[#4030e6]">{t.responseTime}</b>
                </span>
              </div>
            </div>
          </form>
        </div>
      </Reveal>
 
    </section>
  );
}
