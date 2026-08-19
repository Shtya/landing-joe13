'use client';

import { Reveal, ArrowIcon, IconAsset } from '../ui';
import { L2_GRAD } from '../tokens';

const SERVICE_ICONS = ['product-strategy', 'ux-desinger', 'web-development', 'mobile-service', 'cloud-solution', 'data-analytics'];

const STAT_ICONS = ['archive', 'happy-client', 'network-globe', 'lightning'];

const SERVICES_STATIC = [
  { title: 'Product\nStrategy', desc: 'We turn ideas into winning products with validated strategies.' },
  { title: 'UI/UX\nDesign', desc: 'Beautiful, intuitive designs that create meaningful user experiences.' },
  { title: 'Web\nDevelopment', desc: 'High-performance web applications built with modern technologies.' },
  { title: 'Mobile\nDevelopment', desc: 'Native and cross-platform mobile apps that scale with your business.' },
  { title: 'Cloud\nSolutions', desc: 'Secure, scalable, and reliable cloud infrastructure for your business.' },
  { title: 'Data &\nAnalytics', desc: 'Data-driven insights that help you make smarter business decisions.' },
];

const STATS_STATIC = [
  { value: '180+', label: 'Projects Delivered', desc: 'Successful projects across various industries.' },
  { value: '100+', label: 'Happy Clients', desc: 'Long-term partnerships built on trust and results.' },
  { value: '25+', label: 'Countries Served', desc: 'Helping businesses grow across the globe.' },
  { value: '98%', label: 'Client Satisfaction', desc: 'Our clients love working with Joe13.' },
];

const DOT_GRID = Array.from({ length: 48 }, (_, i) => i);

export default function Services({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';

  return (
    <section
      id="services"
      className="relative z-[8] overflow-hidden px-[clamp(1.25rem,3.6vw,3.3rem)] pt-[120px] pb-20 max-md:px-5 max-md:pt-20 max-md:pb-[60px] bg-[radial-gradient(520px_330px_at_50%_48%,rgba(36,93,255,0.028),transparent_74%),linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] before:pointer-events-none before:absolute before:-top-[60px] before:inset-x-0 before:z-[1] before:h-[120px] before:bg-[linear-gradient(to_bottom,rgba(10,14,30,0.85)_0%,rgba(10,14,30,0.45)_25%,rgba(251,252,255,0.6)_60%,#fbfcff_100%)] before:backdrop-blur-[10px] before:content-['']"
      aria-labelledby="l2s-heading"
    >
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-[37px] top-[99px] h-[126px] w-[170px] bg-[radial-gradient(circle,rgba(106,153,255,0.20)_1.25px,transparent_1.45px)] bg-[length:16px_16px] opacity-70" />
        <div className="absolute right-[38px] top-[62px] h-[126px] w-[170px] bg-[radial-gradient(circle,rgba(106,153,255,0.20)_1.25px,transparent_1.45px)] bg-[length:16px_16px] opacity-70" />
        <div className="absolute left-[-118px] top-[248px] h-[185px] w-[355px] rounded-[50%] border-[1.3px] border-b-0 border-[#e4ecff] opacity-95 before:absolute before:inset-x-[39px] before:bottom-0 before:top-[39px] before:rounded-[50%] before:border-[1.3px] before:border-b-0 before:border-[#e6edff] before:content-[''] after:absolute after:inset-x-[79px] after:bottom-0 after:top-[79px] after:rounded-[50%] after:border-[1.3px] after:border-b-0 after:border-[#e6edff] after:content-['']" />
        <div className="absolute right-[-130px] top-[181px] h-[185px] w-[355px] scale-x-[-1] rounded-[50%] border-[1.3px] border-b-0 border-[#e4ecff] opacity-95 before:absolute before:inset-x-[39px] before:bottom-0 before:top-[39px] before:rounded-[50%] before:border-[1.3px] before:border-b-0 before:border-[#e6edff] before:content-[''] after:absolute after:inset-x-[79px] after:bottom-0 after:top-[79px] after:rounded-[50%] after:border-[1.3px] after:border-b-0 after:border-[#e6edff] after:content-['']" />
      </div>

      {/* Header */}
      <header className="relative z-[3] mx-auto mb-[60px] w-full text-center">
        <Reveal>
          <div className="inline-flex h-10 items-center gap-2.5 rounded-[22px] border border-[#ccdafe] bg-white/76 px-[21px] text-[17px] font-medium tracking-[0.2px] text-[#1659da] shadow-[0_5px_18px_rgba(38,87,183,0.045),inset_0_1px_0_#fff]">
            <span className="block h-2.5 w-2.5 rounded-full bg-[#1768ff]" />
            WHAT WE DO
          </div>
          <h2
            id="l2s-heading"
            className="mb-[15px] mt-6 text-[70px] font-[750] leading-[0.99] tracking-[-3.2px] text-[#07132d] max-[1200px]:text-[52px] max-md:text-[38px] max-md:tracking-[-1.5px]"
          >
            {isAr ? 'حلول ذكية للأعمال' : 'Smart Solutions for'}
            <span className="mt-2 block text-[#28344d]">
              {isAr ? 'الحديثة' : 'Modern '}
              <span className={L2_GRAD}>{isAr ? 'والمتطورة' : 'Businesses'}</span>
            </span>
          </h2>
          <p className="m-0 text-xl leading-[1.48] text-[#58637a] max-md:text-base">
            {isAr
              ? 'نساعد الشركات الناشئة والمؤسسات في بناء منتجات رقمية قابلة للتوسع وآمنة ومستقبلية.'
              : 'We help startups and enterprises build digital products that are scalable, secure, and future-ready.'}
          </p>
          <div className="relative mx-auto mt-[19px] h-4 w-[220px] before:absolute before:top-[7px] before:mr-3 before:h-px before:w-[94px] before:bg-[linear-gradient(90deg,transparent,#9abaff)] before:content-[''] before:right-1/2 after:absolute after:top-[7px] after:ml-3 after:h-px after:w-[94px] after:bg-[linear-gradient(90deg,#a17cff,transparent)] after:content-[''] after:left-1/2">
            <span className="absolute left-1/2 top-[3px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#2b6cff]" />
          </div>
        </Reveal>
      </header>

      {/* Service Cards */}
      <div className="relative z-[4] mx-auto mb-10 grid w-full grid-cols-6 gap-[18px] max-[1200px]:grid-cols-3 max-md:grid-cols-2 max-md:gap-3.5 max-[480px]:grid-cols-1">
        {SERVICES_STATIC.map((service, i) => {
          const isPurple = i % 2 === 1;

          return (
            <Reveal key={service.title} delay={i * 60}>
              <article
                className={`group/card relative flex flex-col items-center overflow-hidden rounded-[34px] border-2 border-[#e6eef9] bg-[radial-gradient(ellipse_320px_220px_at_52%_25%,rgba(255,255,255,0.98),rgba(255,255,255,0)_72%),linear-gradient(180deg,#fff_0%,#fff_78%,#fcfdff_100%)] px-[5px] py-2.5 pb-[18px] text-center shadow-[0_18px_46px_rgba(70,103,154,0.055),0_2px_10px_rgba(73,111,168,0.035),inset_0_1px_0_rgba(255,255,255,0.98)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(47,82,145,0.07),0_2px_7px_rgba(47,82,145,0.03)] max-md:min-h-[520px] max-[480px]:min-h-0 max-[480px]:px-3.5 max-[480px]:py-5 after:absolute after:-bottom-px after:left-1/2 after:h-[3px] after:w-[77px] after:-translate-x-1/2 after:rounded-[3px] after:content-[''] ${isPurple ? 'after:bg-[#982bff]' : 'after:bg-[#1468ff]'}`}
              >
                <span className="absolute left-[22px] top-[22px] z-[2] bg-[linear-gradient(95deg,#087dff_0%,#155df0_45%,#742ce7_100%)] bg-clip-text text-[38px] font-extrabold leading-[0.92] tracking-[-2px] text-transparent max-[480px]:left-[18px] max-[480px]:top-[18px] max-[480px]:text-[26px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute left-[22px] top-[78px] z-[2] h-[3px] w-12 rounded-full bg-[linear-gradient(90deg,#078bff_0%,#244ef1_48%,#8d2be6_100%)] max-[480px]:left-[18px] max-[480px]:top-[58px] max-[480px]:w-[34px]" />
                <div
                  className="absolute right-[22px] top-[26px] z-[1] grid h-14 w-[92px] grid-cols-[repeat(8,4px)] gap-x-2 gap-y-2 opacity-[0.58] max-md:h-12 max-md:w-[76px] max-md:gap-x-1.5 max-md:gap-y-1.5"
                  aria-hidden="true"
                >
                  {DOT_GRID.map((dot) => (
                    <span key={dot} className="h-1 w-1 rounded-full bg-[#d9e3f5]" />
                  ))}
                </div>

                <div className="relative z-[2] mx-auto mt-14 flex min-h-[196px] w-full max-w-[220px] shrink-0 items-center justify-center overflow-visible max-md:mt-12 max-md:min-h-[170px] max-md:max-w-[188px] max-[480px]:mt-10 max-[480px]:min-h-[156px] max-[480px]:max-w-[168px]">
                  <div
                    className={`relative z-[2] m-0 grid h-[108px] w-[108px] place-items-center overflow-visible rounded-full border bg-[radial-gradient(circle_at_50%_42%,#fff,#f8fbff_70%)] shadow-[0_10px_25px_rgba(31,94,210,0.055),inset_0_1px_0_#fff] max-md:h-24 max-md:w-24 max-[480px]:h-[88px] max-[480px]:w-[88px] ${isPurple ? 'border-[#e3d9ff] shadow-[0_10px_25px_rgba(123,43,255,0.045),inset_0_1px_0_#fff]' : 'border-[#dbe7ff]'}`}
                  >
                    <IconAsset name={SERVICE_ICONS[i]} size={148} scale={1.22} className="relative z-[3]" />
                  </div>
                </div>

                <div className="relative z-[4] mt-1.5 w-full px-2.5 pt-[18px] max-md:pt-3.5 max-[480px]:pt-3">
                  <h3 className="relative z-[2] m-0 text-[22px] font-extrabold leading-[1.04] tracking-[-1px] text-[#07132d] max-[480px]:text-lg">
                    {service.title.split('\n')[0]}
                    <span className="mt-[3px] block bg-[linear-gradient(93deg,#0a82ff_0%,#2462f0_46%,#712be5_100%)] bg-clip-text text-transparent">
                      {service.title.split('\n')[1]}
                    </span>
                  </h3>
                  <span className="relative z-[2] mx-auto my-4 mb-[18px] block h-1 w-10 rounded-full bg-[#dce4f3]" />
                  <p className="relative z-[2] mx-auto m-0 max-w-[180px] text-[13px] leading-[1.75] text-[#657086]">
                    {service.desc}
                  </p>
                  <a
                    className="group/cta relative z-[2] mx-auto mt-[22px] inline-flex items-center justify-center gap-[7px] border-0 bg-transparent p-0 no-underline shadow-none transition-[gap,color] duration-200 ease-in-out"
                    href="#contact"
                  >
                    <span className="m-0 text-sm font-[750] leading-none tracking-[-0.3px] text-[#102654] transition-colors duration-200 ease-in-out group-hover/cta:text-[#1767ff] max-[480px]:text-[13px]">
                      {isAr ? 'اعرف المزيد' : 'Learn more'}
                    </span>
                    <ArrowIcon className="h-3.5 w-3.5 flex-none text-[#1767ff] transition-transform duration-200 ease-in-out group-hover/cta:translate-x-0.5 rtl:scale-x-[-1] rtl:group-hover/cta:-translate-x-0.5 max-[480px]:h-3 max-[480px]:w-3" />
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Results bar */}
      <Reveal delay={100}>
        <div className="relative z-[4] mx-auto grid w-full grid-cols-[1.6fr_repeat(4,1fr)] rounded-[20px] border border-[#e6ebf4] bg-white/88 px-[22px] py-[34px] shadow-[0_16px_35px_rgba(45,77,132,0.045),inset_0_1px_0_#fff] max-[1200px]:grid-cols-2 max-[1200px]:gap-6 max-md:grid-cols-1 max-md:gap-5 max-md:px-[18px] max-md:py-6">
          <div className="flex items-center gap-[25px] pl-3.5">
            <div className="grid h-[118px] w-[118px] shrink-0 place-items-center overflow-visible rounded-full border border-[#dce7ff] bg-[radial-gradient(circle_at_50%_42%,#fff,#f4f8ff)] shadow-[0_9px_23px_rgba(37,95,206,0.06)]">
              <IconAsset name="star" size={88} scale={1.12} />
            </div>
            <div>
              <div className="mb-2.5 text-[19px] font-bold leading-[1.25] text-[#07132d]">
                {isAr ? 'نتائج تتحدث عن نفسها' : <>Results That<br />Speak for Themselves</>}
              </div>
              <p className="m-0 max-w-[220px] text-[13px] leading-[1.6] text-[#526078]">
                {isAr ? 'نفتخر بالأثر الذي نصنعه لعملائنا حول العالم.' : "We're proud of the impact we create for our clients worldwide."}
              </p>
            </div>
          </div>
          {STATS_STATIC.map((stat, i) => {
            const isPurple = i % 2 === 1;

            return (
              <div
                key={stat.label}
                className="flex flex-col justify-center border-l border-[#e1e7f1] pl-[22px]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`grid h-[72px] w-[72px] shrink-0 place-items-center overflow-visible rounded-full border ${isPurple ? 'border-[#e5dbff] bg-[#f9f5ff]' : 'border-[#d9e5ff] bg-[#f4f8ff]'}`}
                  >
                    <IconAsset name={STAT_ICONS[i]} size={58} scale={1.18} className="relative z-[2]" />
                  </div>
                  <div
                    className={`text-[36px] font-bold leading-none tracking-[-1.5px] bg-clip-text text-transparent ${isPurple ? 'bg-[linear-gradient(90deg,#7c31ff,#a82cff)]' : 'bg-[linear-gradient(90deg,#176aff,#3b4fff)]'}`}
                  >
                    {stat.value}
                  </div>
                </div>
                <h4 className="my-2 mb-1 text-[15px] font-semibold leading-[1.2] text-[#07132d]">{stat.label}</h4>
                <p className="m-0 max-w-[180px] text-[13px] leading-[1.55] text-[#56627a]">{stat.desc}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
