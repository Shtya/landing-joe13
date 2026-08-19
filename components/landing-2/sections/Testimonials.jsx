'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconAsset, Reveal, ArrowIcon } from '../ui';
import { L2_GRAD } from '../tokens';
import { useReducedMotion } from '../hooks';

const PIN_GAP = 10;
const CARD_FADE = 88;

const CARD_ICONS = [
  'shopping-cart',
  'data-analytics',
  'software-development',
  'mobile',
  'cloud-solution',
  'web-development',
  'analytics-2',
  'secure-reliable',
  'code',
  'rocket',
  'digital-network',
  'credit-card',
  'web-design',
  'trend-up',
  'expert-team',
];

const TESTIMONIALS = {
  en: [
    { product: 'E-Commerce Platform', tag: 'E-Commerce', name: 'Ahmed Al-Mansoori', role: 'CTO at E-Commerce Platform', country: 'Saudi Arabia', quote: 'The team delivered a robust and scalable e-commerce platform that exceeded our expectations in every way.', reviews: '120+', female: false },
    { product: 'Analytics Dashboard', tag: 'Analytics', name: 'Omar Hassan', role: 'Head of Operations', country: 'Bahrain', quote: 'The dashboard gave us real-time visibility into our data and helped us make smarter, faster business decisions.', reviews: '98+', female: false },
    { product: 'Custom Software', tag: 'Software', name: 'Youssef Nader', role: 'Product Owner', country: 'UAE', quote: 'Clean architecture, smooth delivery, and outstanding support throughout the entire project lifecycle.', reviews: '76+', female: false },
    { product: 'React Native Application', tag: 'Mobile App', name: 'Faisal Al-Harbi', role: 'Mobile Director', country: 'Saudi Arabia', quote: 'High-performance mobile app with a beautiful UI/UX. Users love the experience.', reviews: '64+', female: false },
    { product: 'Fintech Application', tag: 'Fintech', name: 'Fatima Al-Zahra', role: 'Product Manager', country: 'Egypt', quote: 'Secure, reliable, and user-friendly fintech solution that our customers truly trust.', reviews: '54+', female: true },
    { product: 'Mobile Banking', tag: 'Banking', name: 'Noura Al-Saud', role: 'Digital Banking Lead', country: 'Saudi Arabia', quote: 'A fast, secure, and intuitive banking app that our users enjoy using every day.', reviews: '87+', female: true },
    { product: 'Commerce Core Platform', tag: 'Enterprise', name: 'Huda Al-Rashid', role: 'COO', country: 'Oman', quote: 'Handled 50K+ concurrent users with ease. Scalable, stable, and future-proof platform.', reviews: '42+', female: false },
    { product: 'Product Platform', tag: 'SaaS', name: 'Lina Haddad', role: 'Head of Product', country: 'Jordan', quote: 'Clear roadmap, perfect execution, and a product that exceeded our expectations.', reviews: '68+', female: true },
    { product: 'Logistics OS', tag: 'Logistics', name: 'Khaled Al-Otaibi', role: 'Operations Manager', country: 'Kuwait', quote: 'Optimized our operations and tracking with a powerful logistics system.', reviews: '73+', female: false },
    { product: 'System Integration', tag: 'Integration', name: 'Sara Ibrahim', role: 'IT Director', country: 'UAE', quote: 'Seamless integration with our existing systems. Zero downtime, full reliability.', reviews: '61+', female: false },
    { product: 'Delivery Suite', tag: 'Platform', name: 'Danyal Samir', role: 'Founder', country: 'Kuwait', quote: 'From discovery to launch — smooth communication and on-time delivery.', reviews: '51+', female: false },
    { product: 'Cloud DevOps', tag: 'DevOps', name: 'Karim Darwish', role: 'Engineering Manager', country: 'Egypt', quote: 'Infrastructure is rock-solid. Monitoring, deployment, and scaling all automated.', reviews: '89+', female: false },
    { product: 'AI Operations', tag: 'AI / SaaS', name: 'Maya Khoury', role: 'Data Lead', country: 'Lebanon', quote: 'AI alerts now surface issues in seconds instead of after the damage.', reviews: '47+', female: true },
    { product: 'Enterprise Suite', tag: 'Enterprise', name: 'Aisha Rahman', role: 'CEO', country: 'Qatar', quote: 'A senior team, not a handoff factory. The people who scoped the work built it.', reviews: '55+', female: true },
    { product: 'SaaS Analytics', tag: 'SaaS', name: 'Tariq Benali', role: 'Founder', country: 'Morocco', quote: 'From discovery to launch, communication stayed clear. Weekly demos kept everything on track.', reviews: '59+', female: false },
  ],
  ar: [
    { product: 'منصة تجارة إلكترونية', tag: 'تجارة إلكترونية', name: 'أحمد المنصوري', role: 'مدير تقني', country: 'السعودية', quote: 'فريق محترف سلّم منصة تجارة إلكترونية قوية وقابلة للتوسع تجاوزت توقعاتنا.', reviews: '120+', female: false },
    { product: 'لوحة تحليلات', tag: 'تحليلات', name: 'عمر حسن', role: 'رئيس العمليات', country: 'البحرين', quote: 'منحتنا اللوحة رؤية لحظية للبيانات وساعدتنا على اتخاذ قرارات أسرع.', reviews: '98+', female: false },
    { product: 'برمجيات مخصصة', tag: 'برمجيات', name: 'يوسف نادر', role: 'مالك المنتج', country: 'الإمارات', quote: 'معمارية نظيفة، تسليم سلس، ودعم ممتاز طوال دورة المشروع.', reviews: '76+', female: false },
    { product: 'تطبيق React Native', tag: 'تطبيق جوال', name: 'فيصل الحربي', role: 'مدير الجوال', country: 'السعودية', quote: 'تطبيق عالي الأداء بواجهة جميلة. المستخدمون يحبون التجربة.', reviews: '64+', female: false },
    { product: 'تطبيق FinTech', tag: 'FinTech', name: 'فاطمة الزهراء', role: 'مديرة المنتج', country: 'مصر', quote: 'حل FinTech آمن وموثوق وسهل الاستخدام يثق به عملاؤنا.', reviews: '54+', female: true },
    { product: 'الخدمات المصرفية', tag: 'بنوك', name: 'نورة آل سعود', role: 'قائدة الخدمات الرقمية', country: 'السعودية', quote: 'تطبيق بنكي سريع وآمن وبديهي يستمتع به المستخدمون يومياً.', reviews: '87+', female: true },
    { product: 'منصة Commerce Core', tag: 'مؤسسات', name: 'هدى الراشد', role: 'مديرة العمليات', country: 'عُمان', quote: 'تحمل أكثر من 50 ألف مستخدم متزامن بسهولة. منصة مستقرة وقابلة للتوسع.', reviews: '42+', female: false },
    { product: 'منصة المنتج', tag: 'SaaS', name: 'لينا حداد', role: 'رئيسة المنتج', country: 'الأردن', quote: 'خارطة طريق واضحة وتنفيذ ممتاز ومنتج تجاوز توقعاتنا.', reviews: '68+', female: true },
    { product: 'نظام Logistics OS', tag: 'لوجستيات', name: 'خالد العتيبي', role: 'مدير العمليات', country: 'الكويت', quote: 'حسّن عملياتنا وتتبع الشحنات بنظام لوجستي قوي.', reviews: '73+', female: false },
    { product: 'تكامل الأنظمة', tag: 'تكامل', name: 'سارة إبراهيم', role: 'مديرة IT', country: 'الإمارات', quote: 'تكامل سلس مع أنظمتنا الحالية. بدون توقف وموثوقية كاملة.', reviews: '61+', female: false },
    { product: 'Delivery Suite', tag: 'منصة', name: 'دانيال سمير', role: 'مؤسس', country: 'الكويت', quote: 'من الاكتشاف إلى الإطلاق — تواصل سلس وتسليم في الوقت.', reviews: '51+', female: false },
    { product: 'Cloud DevOps', tag: 'DevOps', name: 'كريم درويش', role: 'مدير هندسة', country: 'مصر', quote: 'بنية تحتية صلبة. المراقبة والنشر والتوسع آلية بالكامل.', reviews: '89+', female: false },
    { product: 'AI Operations', tag: 'AI / SaaS', name: 'مايا خوري', role: 'قائدة البيانات', country: 'لبنان', quote: 'تنبيهات AI تكشف المشاكل في ثوانٍ بدلاً من بعد وقوع الضرر.', reviews: '47+', female: true },
    { product: 'Enterprise Suite', tag: 'مؤسسات', name: 'عائشة رحمن', role: 'CEO', country: 'قطر', quote: 'فريق senior حقيقي. من خطط المشروع هم من بنوه.', reviews: '55+', female: true },
    { product: 'SaaS Analytics', tag: 'SaaS', name: 'طارق بن علي', role: 'مؤسس', country: 'المغرب', quote: 'تواصل واضح من البداية للنهاية. عروض أسبوعية أبقت كل شيء تحت السيطرة.', reviews: '59+', female: false },
  ],
};

function withIcons(items) {
  return items.map((item, index) => ({
    ...item,
    icon: CARD_ICONS[index % CARD_ICONS.length],
  }));
}

function HeaderDivider() {
  return (
    <div className="mx-auto mt-[19px] flex h-4 w-[220px] items-center justify-center gap-3">
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,transparent,#9abaff)]" aria-hidden="true" />
      <span className="h-2 w-2 shrink-0 rounded-full bg-[#2b6cff]" aria-hidden="true" />
      <span className="h-px w-[94px] bg-[linear-gradient(90deg,#a17cff,transparent)]" aria-hidden="true" />
    </div>
  );
}

function WaveSvg() {
  return (
    <svg viewBox="0 0 420 260" fill="none" className="h-full w-full">
      <g stroke="#1a65bd" strokeWidth="1">
        <path d="M0 218C105 219 198 177 267 111S367 22 420 3" />
        <path d="M0 224C110 225 203 184 272 118S371 29 420 10" />
        <path d="M0 230C114 231 208 190 277 125S376 36 420 17" />
        <path d="M0 236C118 237 213 196 282 132S381 43 420 24" />
        <path d="M0 242C122 243 218 202 287 139S386 50 420 31" />
        <path d="M0 248C126 249 223 208 292 146S391 57 420 38" />
        <path d="M0 254C130 255 228 214 297 153S396 64 420 45" />
      </g>
    </svg>
  );
}

function Avatar({ female }) {
  return (
    <div
      className={`relative h-[45px] w-[45px] shrink-0 overflow-hidden rounded-full border-2 border-[#d7dce1] shadow-[0_2px_7px_rgba(0,0,0,0.35)] before:absolute before:content-[''] after:absolute after:content-[''] ${
        female
          ? 'bg-[linear-gradient(145deg,#4b5361,#121a25)] before:left-3 before:top-3 before:h-6 before:w-[19px] before:rounded-[48%_48%_44%_44%] before:bg-[#dba47a] after:left-[5px] after:top-1 after:h-7 after:w-[31px] after:rounded-full after:bg-[#1b1516]'
          : 'bg-[radial-gradient(circle_at_50%_30%,#f1d0a8_0_18%,transparent_19%),linear-gradient(145deg,#6f7d88,#111a24)] before:left-[11px] before:top-3 before:h-[25px] before:w-5 before:rounded-[48%_48%_44%_44%] before:bg-[#e1a979] after:left-[7px] after:top-[5px] after:h-[18px] after:w-7 after:rounded-[50%_50%_40%_40%] after:bg-[#25201d]'
      }`}
    />
  );
}

function TestimonialCard({ item, reviewsLabel, cta }) {
  return (
    <article data-review-card className="w-full">
      <div className="group relative h-full overflow-hidden rounded-[18px] border border-[#1d3c5b] bg-[linear-gradient(145deg,rgba(13,32,53,0.98),rgba(6,21,37,0.98))] px-6 pb-5 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_14px_30px_rgba(0,0,0,0.18)] transition-[transform,border-color] duration-[250ms] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(250px_120px_at_18%_0%,rgba(31,107,210,0.08),transparent_75%)] before:content-[''] hover:border-[rgba(23,140,255,0.35)]">
        <div className="relative flex items-start gap-4">
          <div className="grid h-[62px] w-[62px] shrink-0 place-items-center overflow-hidden rounded-xl border border-[#3475c8] bg-[linear-gradient(145deg,#2866b5,#0b3470)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_6px_14px_rgba(0,75,170,0.18)]">
            <IconAsset name={item.icon} size={52} scale={1.08} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-0.5">
            <h3 className="m-0 text-[18px] font-bold leading-[1.2] text-[#f4f7fd]">{item.product}</h3>
            <span className="inline-flex w-fit items-center rounded-xl bg-[#0b4d91] px-2.5 py-1 text-[11px] font-semibold tracking-[0.2px] text-[#8fc7ff]">
              {item.tag}
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap text-right">
            <span className="text-[22px] leading-none tracking-[-2px] text-[#ffc400]">★</span>
            <strong className="text-[18px] leading-none text-[#f6f7fa]">5.0</strong>
            <small className="text-[11px] text-[#e0e6f0]">
              ({item.reviews} {reviewsLabel})
            </small>
          </div>
        </div>
        <p className="relative my-4 min-h-[56px] text-[15px] leading-[1.55] text-[#d6deea]">{item.quote}</p>
        <div className="mb-4 h-px bg-[#203b55]" />
        <div className="relative flex items-center gap-3">
          <Avatar female={item.female} />
          <div className="min-w-0 flex-1">
            <strong className="block text-[14px] leading-[1.2] text-[#f4f7fd]">{item.name}</strong>
            <small className="mt-1 block text-[12px] leading-[1.35] text-[#c3cddd]">{item.role}</small>
            <span className="mt-1 flex items-center gap-1.5 text-[12px] text-[#c6d0df]">
              <IconAsset name="location-pin" size={16} scale={0.9} className="opacity-90" />
              {item.country}
            </span>
          </div>
          <a
            className="ms-auto inline-flex shrink-0 items-center gap-1.5 self-end whitespace-nowrap text-[13px] font-semibold text-[#078cff] no-underline transition-colors duration-200 hover:text-[#4db8ff]"
            href="#work"
          >
            {cta}
            <ArrowIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const items = withIcons(TESTIMONIALS[isAr ? 'ar' : 'en']);
  const reducedMotion = useReducedMotion();
  const cta = copy.projects?.readStory ?? (isAr ? 'عرض القصة' : 'Read story');
  const reviewsLabel = isAr ? 'مراجعة' : 'reviews';

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pin = pinRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !pin || !viewport || !track) return undefined;

    const cards = [...track.querySelectorAll('[data-review-card]')];

    const clearLayout = () => {
      section.style.height = '';
      pin.style.height = '';
      gsap.set(track, { y: 0, clearProps: 'transform' });
      cards.forEach((card) => card.style.removeProperty('--enter'));
    };

    if (reducedMotion) {
      clearLayout();
      return clearLayout;
    }

    section.classList.add('is-scroll-pinned');
    ScrollTrigger.config({ ignoreMobileResize: true });

    const getOverflow = () => Math.max(0, track.scrollHeight - viewport.clientHeight);

    const syncLayout = () => {
      const pinHeight = Math.max(0, window.innerHeight - PIN_GAP);
      pin.style.height = `${pinHeight}px`;
      const overflow = getOverflow();
      section.style.height = `${pinHeight + overflow}px`;
      return overflow;
    };

    const updateCards = () => {
      const bounds = viewport.getBoundingClientRect();
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const enter = gsap.utils.clamp(0, 1, (bounds.bottom - rect.top) / CARD_FADE);
        const leave = gsap.utils.clamp(0, 1, (rect.bottom - bounds.top) / CARD_FADE);
        card.style.setProperty('--enter', String(Math.min(enter, leave)));
      });
    };

    const ctx = gsap.context(() => {
      syncLayout();
      updateCards();

      gsap.to(track, {
        y: () => -getOverflow(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: `top ${PIN_GAP}px`,
          end: () => `+=${Math.max(getOverflow(), 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: syncLayout,
          onUpdate: updateCards,
          onRefresh: updateCards,
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: updateCards,
        onRefresh: updateCards,
      });
    }, section);

    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      syncLayout();
      updateCards();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(refresh);
    });
    document.fonts?.ready?.then(refresh);
    window.addEventListener('resize', refresh);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', refresh);
      section.classList.remove('is-scroll-pinned');
      ctx.revert();
      clearLayout();
    };
  }, [items.length, reducedMotion]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-visible px-[clamp(1.25rem,3.6vw,3.3rem)] pb-0 pt-0 text-[#f4f7fd] bg-[radial-gradient(650px_520px_at_73%_38%,rgba(5,52,123,0.13),transparent_67%),radial-gradient(450px_360px_at_88%_15%,rgba(79,13,150,0.07),transparent_70%),linear-gradient(180deg,#01050c_0%,#00040a_100%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(0,0,0,0.05),transparent_40%,rgba(0,23,55,0.10))] after:content-[''] max-md:px-5"
      aria-labelledby="l2t-heading"
      style={{ minHeight: `calc(100vh - ${PIN_GAP}px)` }}
    >
      <div
        ref={pinRef}
        className="sticky top-[10px] z-[5] flex flex-col overflow-hidden pb-7 pt-[60px] "
        style={{ height: `calc(100vh - ${PIN_GAP}px)` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-[13px] top-[30px] h-[130px] w-[145px] bg-[radial-gradient(circle,#197bd8_1.45px,transparent_1.65px)] bg-[length:19px_19px] opacity-80" />
          <div className="absolute bottom-[72px] right-3 h-[130px] w-[145px] bg-[radial-gradient(circle,#197bd8_1.45px,transparent_1.65px)] bg-[length:19px_19px] opacity-80" />
          <div className="absolute -right-[5px] top-[-3px] h-[245px] w-[390px] rotate-[2deg] opacity-75">
            <WaveSvg />
          </div>
          <div className="absolute -left-[25px] bottom-[90px] h-[245px] w-[390px] scale-y-[-1] rotate-[4deg] opacity-75">
            <WaveSvg />
          </div>
        </div>

        <header className="relative z-[5] mx-auto mb-[60px] w-full shrink-0 text-center">
          <Reveal>
             
            <h2
              id="l2t-heading"
              className="mb-[15px] mt-6 text-[70px] font-[750] leading-[0.99] tracking-[-3.2px] text-[#f4f7fd] max-[1200px]:text-[52px] max-md:text-[38px] max-md:tracking-[-1.5px]"
            >
              {isAr ? (
                <>
                  آراء <span className={L2_GRAD}>عملائنا</span>
                </>
              ) : (
                <>
                  Client <span className={L2_GRAD}>Testimonials</span>
                </>
              )}
            </h2>
            <p className="mx-auto m-0 max-w-[720px] text-xl leading-[1.48] text-[#c5cfde] max-md:text-base">
              {copy.testimonials?.subtitle ??
                (isAr
                  ? 'قصص حقيقية من عملاء يثقون بحلولنا'
                  : 'Real stories from real clients who trust our solutions')}
            </p>
            <HeaderDivider />
          </Reveal>
        </header>

        <div ref={viewportRef} className="relative z-[4] mx-auto min-h-0 w-full max-w-[1320px] flex-1 overflow-hidden px-1">
          <div
            ref={trackRef}
            className="grid w-full grid-cols-1 gap-4 will-change-transform md:grid-cols-2 xl:grid-cols-3"
          >
            {items.map((item) => (
              <TestimonialCard key={`${item.name}-${item.product}`} item={item} reviewsLabel={reviewsLabel} cta={cta} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
