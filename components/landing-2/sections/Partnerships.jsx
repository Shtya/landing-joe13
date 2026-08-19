'use client';

import { IconAsset } from '../ui';
import { L2_GRAD } from '../tokens';

const PARTNERS = [
  { slug: 'microsoft', name: 'Microsoft' },
  { slug: 'google', name: 'Google' },
  { slug: 'amazonaws', name: 'AWS' },
  { slug: 'slack', name: 'Slack' },
  { slug: 'twilio', name: 'Twilio' },
  { slug: 'shopify', name: 'Shopify' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'meta', name: 'Meta' },
  { slug: 'adobe', name: 'Adobe' },
  { slug: 'salesforce', name: 'Salesforce' },
  { slug: 'oracle', name: 'Oracle' },
  { slug: 'ibm', name: 'IBM' },
  { slug: 'netflix', name: 'Netflix' },
  { slug: 'spotify', name: 'Spotify' },
  { slug: 'github', name: 'GitHub' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'paypal', name: 'PayPal' },
  { slug: 'airbnb', name: 'Airbnb' },
  { slug: 'uber', name: 'Uber' },
  { slug: 'vercel', name: 'Vercel' },
  { slug: 'intel', name: 'Intel' },
  { slug: 'openai', name: 'OpenAI' },
  { slug: 'notion', name: 'Notion' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'dropbox', name: 'Dropbox' },
  { slug: 'zoom', name: 'Zoom' },
  { slug: 'atlassian', name: 'Atlassian' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'redis', name: 'Redis' },
  { slug: 'cloudflare', name: 'Cloudflare' },
];

const MARQUEE_PARTNERS = [...PARTNERS, ...PARTNERS];

const FEATURES = [
  { title: 'Secure & Reliable', desc: 'Enterprise-grade security and reliability.', icon: 'secure-reliable' },
  // { title: 'On-Time Delivery', desc: 'We value your time and always deliver on schedule.', icon: 'clock' },
  { title: 'Expert Team', desc: 'Experienced professionals passionate about your success.', icon: 'expert-team' },
  { title: 'Measurable Results', desc: 'Data-driven approach that delivers real impact.', icon: 'measurable-results' },
  { title: '24/7 Support', desc: "We're here whenever you need us.", icon: 'support' },
];

export default function Partnerships() {
  return (
    <section
      id="partnerships"
      className="relative z-[9] overflow-hidden px-[var(--l2-gutter)] pb-20 pt-[72px] max-lg:px-5 max-lg:pb-[60px] max-lg:pt-[70px] bg-[radial-gradient(520px_430px_at_16%_37%,rgba(0,87,255,0.10),transparent_68%),radial-gradient(520px_360px_at_90%_79%,rgba(94,33,255,0.075),transparent_70%),linear-gradient(135deg,#010411_0%,#03081a_52%,#010411_100%)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(350px_220px_at_18%_23%,rgba(0,145,255,0.07),transparent_72%)] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(rgba(120,156,211,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(120,156,211,0.035)_1px,transparent_1px)] after:bg-[length:100%_40px,40px_100%] after:opacity-[0.18] after:[mask-image:linear-gradient(180deg,rgba(0,0,0,0.36),transparent_92%)] after:content-['']"
    >
      <div
        className="pointer-events-none absolute left-[-50px] top-[130px] h-[380px] w-[380px] rounded-full bg-[#006eff] opacity-[0.18] blur-[60px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[10px] right-[-20px] h-[280px] w-[280px] rounded-full bg-[#6327ff] opacity-[0.18] blur-[60px]"
        aria-hidden="true"
      />

      <div className="relative z-[2] mx-auto grid w-full grid-cols-1 items-center gap-y-8 isolate lg:grid-cols-[minmax(260px,40%)_minmax(0,1fr)] lg:gap-x-7 xl:grid-cols-[minmax(300px,40%)_minmax(0,1fr)] xl:gap-x-[clamp(24px,3.5vw,48px)]">
        <div
          className="relative z-[1] hidden w-full max-w-full justify-self-stretch self-center overflow-hidden [contain:layout_paint] pointer-events-none lg:block"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/world_image.png"
            alt=""
            className="block m-0 h-auto w-full max-w-full object-contain object-left "
            width={680}
            height={620}
          />
        </div>

        <div className="relative z-[4] flex w-full min-w-0 flex-col isolate">
          <header className="relative mb-6 flex flex-col items-start max-lg:items-center max-lg:text-center">
            <div className="mb-5 flex h-auto min-h-[45px] w-fit max-w-full items-center gap-[11px] rounded-3xl border border-[rgba(112,153,195,0.3)] bg-[rgba(8,21,38,0.58)] px-5 py-2.5 text-base font-semibold tracking-[0.05px] text-[#f5f7fb] shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_12px_30px_rgba(0,0,0,0.2)] max-md:w-full max-md:max-w-[385px] max-md:px-4 max-md:text-sm max-lg:mx-auto">
              <svg viewBox="0 0 30 30" className="h-[22px] w-5 shrink-0 fill-none stroke-[#00a3ff] stroke-[2.1]">
                <path d="m15 3 10 4v8c0 6-4 10-10 13C9 25 5 21 5 15V7l10-4Z" />
                <path d="m10 15 3 3 7-8" />
              </svg>
              TRUSTED BY INNOVATIVE COMPANIES
            </div>
            <h2 className="relative m-0 flex flex-col font-[Inter,'Segoe_UI',Arial,sans-serif] text-[clamp(2.8rem,4.8vw,4.45rem)] font-[760] leading-[0.98] tracking-[-0.045em] text-[#f5f6f8] max-md:text-[clamp(2.3rem,10vw,4rem)] max-md:tracking-[-0.06em]">
              <span className={L2_GRAD}>Partnerships</span>
              <span className="leading-[1.06] tracking-[-0.048em] text-[#f5f6f8] max-md:tracking-[-0.06em]">
                That Drive Results
              </span>
            </h2>
            <p className="relative mt-4 max-w-[680px] text-[19px] leading-[1.53] text-[#d0d5dd] max-md:text-base max-lg:mx-auto">
              We collaborate with forward-thinking brands and startups to build
              products that make a real impact.
            </p>
          </header>

          <div
            className="group relative w-full min-h-[118px] overflow-hidden rounded-[22px] border border-[rgba(127,164,200,0.38)] bg-[linear-gradient(180deg,rgba(14,32,56,0.92),rgba(6,16,32,0.88)),radial-gradient(120%_180%_at_50%_-40%,rgba(0,140,255,0.12),transparent_55%)] px-0 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-12px_28px_rgba(0,80,180,0.06),0_20px_40px_rgba(0,0,0,0.28)]"
            aria-label="Partner companies"
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1] animate-partners-shine bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] motion-reduce:animate-none"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-[4] w-16 bg-[linear-gradient(90deg,rgba(6,16,32,0.95)_0%,transparent_100%)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-0 right-0 top-0 z-[4] w-16 bg-[linear-gradient(270deg,rgba(6,16,32,0.95)_0%,transparent_100%)]"
              aria-hidden="true"
            />
            <div className="relative z-[3] w-full min-w-0 max-w-full overflow-hidden motion-reduce:overflow-visible">
              <div className="flex py-1 w-max items-center gap-5 px-3 will-change-transform animate-marquee-partners max-md:[animation-duration:42s] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-7 motion-reduce:px-5 motion-reduce:pt-2 motion-reduce:animate-none">
                {MARQUEE_PARTNERS.map((partner, index) => (
                  <div
                    key={`${partner.slug}-${index}`}
                    className="p-2 flex h-[82px] min-w-[126px] shrink-0 items-center justify-center rounded-2xl border border-[rgba(148,186,228,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] px-[26px] opacity-[0.92] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[opacity,transform,border-color,box-shadow] duration-300 hover:opacity-100 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[rgba(120,190,255,0.42)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(0,100,220,0.16)] max-xl:h-14 max-xl:min-w-[140px] max-xl:px-[22px] max-md:h-[52px] max-md:min-w-[128px] max-md:px-[18px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/partners/${partner.slug}.svg`}
                      alt={partner.name}
                      width={180}
                      height={48}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="pointer-events-none block h-full w-auto max-w-full select-none object-contain opacity-[0.96] brightness-0 invert "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {FEATURES.map((f, index) => {
              const isLast = index === FEATURES.length - 1;

              return (
                <article
                  key={f.title}
                  className={`group relative flex min-h-[152px] flex-col items-start gap-3 overflow-hidden rounded-[19px] border py-2 px-5  shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_28px_rgba(0,91,255,0.09),0_18px_34px_rgba(0,0,0,0.29)] transition-[transform,border-color,box-shadow] duration-[280ms] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(7,156,255,0.08),transparent_45%)] before:content-[''] hover:-translate-y-1 hover:border-[rgba(90,176,255,0.65)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_42px_rgba(0,0,0,0.34),0_0_28px_rgba(7,156,255,0.1)] ${
                    isLast
                      ? 'border-[rgba(139,56,255,0.55)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_28px_rgba(111,41,255,0.1),0_18px_34px_rgba(0,0,0,0.29)]'
                      : 'border-[rgba(80,179,255,0.62)] bg-[linear-gradient(180deg,rgba(9,22,39,0.94),rgba(4,13,27,0.96))]'
                  } ${isLast ? 'bg-[linear-gradient(180deg,rgba(9,22,39,0.94),rgba(4,13,27,0.96))]' : ''}`}
                >
                  <div
                    className={`grid h-fit w-fit shrink-0 place-items-center overflow-visible rounded-full     `}
                  >
                    <IconAsset name={f.icon} size={140} scale={1} />
                  </div>
                  <h3 className="m-0 text-[15px] font-[750] leading-[1.25] text-[#f7f8fa]">{f.title}</h3>
                  <p className="m-0 text-[12px] leading-[1.45] text-[#c6cdd7]">{f.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
