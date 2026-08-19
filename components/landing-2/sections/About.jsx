'use client';

import Image from 'next/image';
import { Reveal, IconAsset } from '../ui';
import { L2_GRAD } from '../tokens';

const VALUES = {
  en: [
    {
      title: 'Mission',
      desc: 'Empower businesses with innovative software that drives growth and creates lasting impact.',
      icon: 'Mission-1',
    },
    {
      title: 'Vision',
      desc: 'Become the trusted digital partner for companies building the next generation of products.',
      icon: 'mission',
    },
    {
      title: 'Approach',
      desc: 'Strategy-first, design-led engineering with transparency, quality, and measurable outcomes.',
      icon: 'approach',
    },
  ],
  ar: [
    {
      title: 'الرسالة',
      desc: 'تمكين الشركات من خلال برمجيات مبتكرة تدفع النمو وتخلق أثراً مستداماً.',
      icon: 'Mission-1',
    },
    {
      title: 'الرؤية',
      desc: 'أن نكون الشريك الرقمي الموثوق للشركات التي تبني الجيل القادم من المنتجات.',
      icon: 'mission',
    },
    {
      title: 'المنهجية',
      desc: 'هندسة تقودها الاستراتيجية والتصميم مع الشفافية والجودة والنتائج القابلة للقياس.',
      icon: 'approach',
    },
  ],
};

function IntroShieldIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[50px] w-[50px] drop-shadow-[0_0_7px_rgba(65,115,255,0.55)]">
      <path d="M32 7 51 14v16c0 12.5-7.6 22.7-19 27C20.6 52.7 13 42.5 13 30V14L32 7Z" stroke="#6A8BFF" strokeWidth="2.4" />
      <path d="m23 32 6 6 13-14" stroke="#7AB5FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 11 47 16v14c0 10.3-5.8 18.8-15 22.6C22.8 48.8 17 40.3 17 30V16l15-5Z" stroke="#1B7DFF" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

export default function About({ copy }) {
  const isAr = copy.nav?.home === 'الرئيسية';
  const values = VALUES[isAr ? 'ar' : 'en'];

  return (
    <section
      id="about"
      className="relative overflow-hidden px-[clamp(1rem,4vw,2rem)] pb-[90px] pt-[72px] max-[1100px]:min-h-0 max-[1100px]:pb-20 max-[1100px]:pt-10 lg:px-[clamp(1.25rem,3.6vw,3.3rem)] lg:pb-[110px] lg:pt-[90px] bg-[radial-gradient(900px_560px_at_23%_41%,rgba(10,68,190,0.105),transparent_62%),radial-gradient(780px_560px_at_78%_36%,rgba(41,31,148,0.055),transparent_68%),linear-gradient(180deg,#020617_0%,#020817_55%,#020817_100%)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_30%,rgba(22,71,154,0.07),transparent_26%),linear-gradient(90deg,rgba(0,0,0,0.08),transparent_28%,transparent_72%,rgba(0,0,0,0.09))] before:content-['']"
      aria-labelledby="l2a-heading"
    >
      <div
        className="pointer-events-none absolute start-[19px] top-[61px] z-[1] h-[120px] w-[130px] bg-[radial-gradient(circle,rgba(37,103,245,0.78)_1px,transparent_1.4px)] bg-[length:20px_20px] opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[89px] end-[-3px] z-[1] h-[120px] w-[130px] bg-[radial-gradient(circle,rgba(37,103,245,0.78)_1px,transparent_1.4px)] bg-[length:20px_20px] opacity-[0.36]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-95px] end-[138px] z-[1] h-[390px] w-[390px] rotate-[8deg] rounded-full border border-[rgba(114,41,255,0.48)] border-b-transparent border-s-transparent opacity-80 max-[1100px]:hidden"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1536px]">
        <div className="relative flex flex-col gap-8 pb-9 max-[1100px]:pt-[35px] lg:min-h-[608px] lg:flex-row lg:items-start lg:gap-0 lg:pb-0 lg:pt-0">
          <Reveal className="relative z-[2] mx-auto w-full max-w-[587px] shrink-0 lg:ms-12 lg:mt-[82px] lg:mx-0">
            <div className="relative aspect-[587/533] w-full overflow-hidden max-[1100px]:mx-auto">
              <Image
                src="/icons/about-us.png"
                alt=""
                fill
                sizes="(max-width: 1100px) 92vw, 587px"
                className="object-cover saturate-[1.02] contrast-[1.01]"
                priority={false}
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <Reveal delay={60} className="relative z-[4] w-full max-w-[718px] lg:ms-9 lg:mt-[121px]">
            <div className="inline-flex h-[45px] items-center gap-2.5 rounded-[24px] border border-[rgba(93,127,177,0.58)] bg-[rgba(2,10,23,0.38)] px-[27px] text-lg tracking-[0.1px] shadow-[inset_0_1px_0_rgba(255,255,255,0.025),0_0_20px_rgba(0,120,255,0.035)] before:h-[9px] before:w-[9px] before:shrink-0 before:rounded-full before:bg-[#10a6ff] before:shadow-[0_0_10px_#0aa9ff] before:content-['']">
              {isAr ? 'من نحن' : 'ABOUT US'}
            </div>

            <h2
              id="l2a-heading"
              className="mb-[15px] mt-8 text-[clamp(2.5rem,6vw,3.6875rem)] font-bold leading-[1.04] tracking-[-2.5px] text-[#f6f7fb] max-lg:whitespace-normal lg:whitespace-nowrap"
            >
              {isAr ? 'نبني ' : 'Building '}
              <span className={L2_GRAD}>{isAr ? 'تميزاً رقمياً' : 'Digital Excellence'}</span>
            </h2>

            <p className="m-0 text-xl leading-normal tracking-[-0.25px] text-[#c6cad5]">
              {copy.footer.about}
            </p>

            <div className="mt-[42px] flex min-h-[141px] w-full items-center rounded-[18px] border border-[rgba(86,122,171,0.55)] bg-[linear-gradient(105deg,rgba(3,14,29,0.74),rgba(3,12,24,0.58))] px-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_12px_35px_rgba(0,0,0,0.18)] max-[640px]:flex-col max-[640px]:gap-4 max-[640px]:py-6">
              <div className=" relative me-[21px] grid h-[82px] w-[82px] shrink-0 place-items-center rounded-full border border-[#078eff] bg-[radial-gradient(circle,rgba(25,77,182,0.16),rgba(2,12,26,0.1)_68%)] shadow-[0_0_20px_rgba(0,116,255,0.08),inset_0_0_16px_rgba(31,95,255,0.06)] max-[640px]:me-0">
                {/* <IntroShieldIcon /> */}
                <Image
                src="/icons/verify.png"
                alt=""
                fill 
                className="absolute inset-0 w-full h-full object-contain saturate-[1.02] contrast-[1.01]"
                priority={false}
                aria-hidden="true"
              />
              </div>
              <p className="m-0 text-lg leading-[1.72] tracking-[0.05px] text-[#c5cad4]">
                {isAr
                  ? 'نحن فريق من المهندسين والمصممين واستراتيجيي المنتجات نساعد الشركات على تحويل الأفكار إلى منتجات رقمية قابلة للتوسع — من الفكرة إلى الإطلاق وما بعده.'
                  : 'We are a team of engineers, designers, and product strategists helping companies turn ideas into scalable digital products — from concept to launch and beyond.'}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative z-[5] mx-auto mt-[15px] grid w-full max-w-[1261px] grid-cols-1 gap-[33px] max-[1100px]:px-0 lg:mt-3 lg:grid-cols-3">
          {values.map((item, index) => {
            const isPurple = index === 1;

            return (
              <Reveal key={item.title} delay={120 + index * 60}>
                <article
                  className={`relative min-h-[290px] overflow-hidden rounded-[18px] border border-[rgba(87,121,169,0.48)] bg-[radial-gradient(260px_170px_at_50%_42%,rgba(15,44,92,0.12),transparent_75%),linear-gradient(150deg,rgba(7,20,41,0.79),rgba(3,12,27,0.77))] px-12 pb-[22px] pt-[29px] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.035),inset_0_-1px_0_rgba(0,0,0,0.35),0_18px_35px_rgba(0,0,0,0.13)] lg:h-[325px] before:absolute before:end-[21px] before:top-[23px] before:h-[78px] before:w-[91px] before:bg-[radial-gradient(circle,rgba(31,105,248,0.7)_1px,transparent_1.35px)] before:bg-[length:13px_13px] before:opacity-45 before:content-[''] after:absolute after:bottom-[-1px] after:left-1/2 after:h-[5px] after:w-[94px] after:-translate-x-1/2 after:rounded-t-[5px] after:content-[''] ${
                    isPurple
                      ? 'after:bg-[linear-gradient(90deg,#a92dff,#7d2cff)] after:shadow-[0_0_12px_rgba(157,39,255,0.9),0_-1px_2px_rgba(255,255,255,0.18)]'
                      : 'after:bg-[linear-gradient(90deg,#0ba9ff,#1476ff)] after:shadow-[0_0_12px_rgba(0,145,255,0.9),0_-1px_2px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  <div
                    className={`relative mx-auto mb-5 grid h-[100px] w-[100px] place-items-center rounded-full border bg-[radial-gradient(circle_at_45%_40%,rgba(15,79,180,0.28),rgba(2,13,29,0.12)_65%)] border-[#087fff20] shadow-[inset_0_0_18px_rgba(0,104,255,0.09),0_0_22px_rgba(0,93,255,0.07)]`}
                  >
                    <IconAsset name={item.icon} size={100}  className=" scale-[2.1] drop-shadow-[0_0_6px_rgba(20,117,255,0.55)]" />
                  </div>

                  <h3 className="m-0 mb-4 text-[26px] font-bold leading-none tracking-[-0.7px] text-[#f6f7fb]">
                    {item.title}
                  </h3>
                  <p className="m-0 text-[17px] font-normal leading-[1.66] text-[#c2c8d3]">{item.desc}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
