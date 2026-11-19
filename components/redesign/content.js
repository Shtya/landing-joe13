import { getLandingTwoContent } from '@/components/landing-2/content';

/*
 * Copy for the /redesign home. Data (process, projects, testimonials, stats,
 * stack, plans, contact details) is read from the existing content files so
 * both homes stay in sync. The six services, the 3D icon choices and the
 * Mission / Vision / Approach values follow the current home (landing-2).
 */

const PLATFORMS = [
  'amazonaws', 'google', 'microsoft', 'openai', 'vercel', 'cloudflare', 'docker',
  'github', 'stripe', 'mongodb', 'redis', 'figma', 'shopify', 'slack', 'twilio', 'salesforce',
];

// Social profiles — fill in the real URLs; entries without a URL are not rendered as links.
const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin', href: '' },
  { key: 'twitter', label: 'X (Twitter)', icon: 'twitter', href: '' },
  { key: 'facebook', label: 'Facebook', icon: 'facebook', href: '' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram', href: '' },
];

export function getRedesignContent(locale) {
  const base = getLandingTwoContent(locale);
  const ar = locale === 'ar';
  const t = (en, arText) => (ar ? arText : en);

  const stats = base.stats.items;
  const tech = base.tech.groups;

  return {
    locale,
    dir: ar ? 'rtl' : 'ltr',
    meta: {
      title: t('JOE13 | Bold ideas, engineered to lead', 'JOE13 | أفكار جريئة، مُهندَسة لتقود'),
      description: base.metaDescription,
    },
    brand: 'JOE13',
    tagline: t('Empowering your success', 'نُمكّن نجاحك'),
    ui: {
      skip: t('Skip to current section', 'انتقل إلى القسم الحالي'),
      startProject: t('Start a project', 'ابدأ مشروعك'),
      language: ar ? 'English' : 'العربية',
      languageShort: ar ? 'EN' : 'ع',
      themeToLight: t('Switch to light mode', 'التبديل إلى الوضع الفاتح'),
      themeToDark: t('Switch to dark mode', 'التبديل إلى الوضع الداكن'),
      railLabel: t('Sections', 'الأقسام'),
      mainNav: t('Main', 'الرئيسية'),
      slideOf: (i, n, name) => t(`Section ${i} of ${n}: ${name}`, `القسم ${i} من ${n}: ${name}`),
      next: t('Next', 'التالي'),
      previous: t('Previous', 'السابق'),
      scrollHint: t('Scroll, swipe or use the arrow keys', 'مرّر أو اسحب أو استخدم الأسهم'),
    },
    // tone: 'light' slides echo the white sections of the current home
    slides: [
      { id: 'top', name: t('Intro', 'البداية'), tone: 'dark' },
      { id: 'services', name: t('Services', 'الخدمات'), tone: 'light', nav: true },
      { id: 'process', name: t('Process', 'آلية العمل'), tone: 'light', nav: true },
      { id: 'stack', name: t('Stack', 'التقنيات'), tone: 'dark' },
      { id: 'work', name: t('Work', 'الأعمال'), tone: 'dark', nav: true },
      { id: 'voices', name: t('Clients', 'العملاء'), tone: 'dark' },
      { id: 'studio', name: t('About', 'من نحن'), tone: 'dark', nav: true },
      { id: 'platforms', name: t('Why JOE13', 'لماذا JOE13'), tone: 'dark' },
      { id: 'plans', name: t('Plans', 'الباقات'), tone: 'light', nav: true },
      { id: 'contact', name: t('Contact', 'تواصل'), tone: 'dark' },
    ],
    hero: {
      badge: t('We build category-leading digital products', base.hero.badge),
      lines: ar ? ['أفكار جريئة.', 'مُهندَسة', 'لتقود.'] : ['Bold ideas.', 'Engineered', 'to lead.'],
      sub: base.hero.sub,
      primary: t('Start a project', 'ابدأ مشروعك'),
      secondary: t('See the work', 'شاهد الأعمال'),
      telemetry: [stats[0], stats[1], stats[3], stats[2]].map((s) => ({
        value: `${s.value}${s.suffix}`,
        label: s.label,
      })),
    },
    services: {
      title: t('Smart solutions for modern businesses', 'حلول ذكية للأعمال الحديثة'),
      lead: t(
        'We help startups and enterprises build digital products that are scalable, secure and ready for what comes next.',
        'نساعد الشركات الناشئة والمؤسسات على بناء منتجات رقمية قابلة للتوسع وآمنة وجاهزة للمستقبل.',
      ),
      stackLabel: t('Typical stack', 'التقنيات المعتادة'),
      cta: t('Discuss this service', 'ناقش هذه الخدمة'),
      items: [
        {
          key: 'strategy', icon: 'product-strategy',
          title: t('Product strategy', 'استراتيجية المنتج'),
          desc: t('We turn ideas into products worth building, with validated scope, audience and roadmap before a line of code.', 'نحوّل الأفكار إلى منتجات تستحق البناء، بنطاق وجمهور وخارطة طريق مُتحقق منها قبل كتابة أي كود.'),
          tech: ['Discovery workshops', 'Market research', 'Feasibility study', 'Roadmap'],
        },
        {
          key: 'design', icon: 'ux-desinger',
          title: t('UI/UX design', 'تصميم UI/UX'),
          desc: t('Clear, intuitive interfaces and design systems your team can keep extending.', 'واجهات واضحة وسهلة، وأنظمة تصميم يستطيع فريقك تطويرها باستمرار.'),
          tech: ['Figma', 'Design systems', 'Prototyping', 'Usability testing'],
        },
        {
          key: 'web', icon: 'web-development',
          title: t('Web development', 'تطوير الويب'),
          desc: t('High-performance web applications and platforms built on a modern, maintainable stack.', 'تطبيقات ومنصات ويب عالية الأداء مبنية على تقنيات حديثة وسهلة الصيانة.'),
          tech: tech[0].items.slice(0, 3).concat(tech[1].items.slice(0, 2)),
        },
        {
          key: 'mobile', icon: 'mobile-service',
          title: t('Mobile development', 'تطوير تطبيقات الجوال'),
          desc: t('Native and cross-platform apps for iOS and Android that feel at home on both.', 'تطبيقات أصلية ومتعددة المنصات لـ iOS وAndroid بتجربة طبيعية على كليهما.'),
          tech: tech[2].items,
        },
        {
          key: 'cloud', icon: 'cloud-solution',
          title: t('Cloud solutions', 'الحلول السحابية'),
          desc: t('Secure, scalable infrastructure with CI/CD and monitoring from the first release.', 'بنية تحتية آمنة وقابلة للتوسع مع CI/CD ومراقبة من أول إصدار.'),
          tech: tech[3].items,
        },
        {
          key: 'data', icon: 'data-analytics',
          title: t('Data & AI', 'البيانات والذكاء الاصطناعي'),
          desc: t('Dashboards, pipelines and machine learning that turn your data into decisions.', 'لوحات معلومات وخطوط بيانات وتعلم آلة تحوّل بياناتك إلى قرارات.'),
          tech: ['Python', 'PostgreSQL', 'Redis', 'OpenAI', 'Analytics pipelines'],
        },
      ],
    },
    process: {
      title: t('How a project moves', 'كيف يتحرك المشروع'),
      lead: t(
        'Fifteen weeks from first call to launch, then we stay. Open a phase to see what happens in it.',
        'خمسة عشر أسبوعًا من أول مكالمة حتى الإطلاق، ثم نبقى معك. افتح أي مرحلة لترى تفاصيلها.',
      ),
      icons: ['search', 'web-design', 'code', 'qc', 'rocket', 'support'],
      phases: base.process.phases,
      phaseOf: (i, n) => t(`Phase ${i} of ${n}`, `المرحلة ${i} من ${n}`),
      next: t('Next', 'التالي'),
      restart: t('Back to the start', 'العودة للبداية'),
    },
    stack: {
      title: ar ? ['امتلك التقنية.', 'وابقَ في السيطرة.'] : ['Own the stack.', 'Stay in control.'],
      body: base.tech.body,
      icons: ['web-design', 'code', 'mobile', 'cloud', 'archive', 'cube'],
      groups: tech,
      pick: t('Choose a layer', 'اختر طبقة'),
    },
    work: {
      title: t('Selected work', 'أعمال مختارة'),
      challenge: t('Challenge', 'التحدي'),
      solution: t('What we built', 'ما بنيناه'),
      results: t('Results', 'النتائج'),
      stack: t('Stack', 'التقنيات'),
      items: base.projects.items,
    },
    voices: {
      title: t('What clients say after launch', 'ماذا يقول العملاء بعد الإطلاق'),
      items: base.testimonials.items.slice(0, 8),
      pick: t('Choose a client', 'اختر عميلًا'),
      rating: t('Rated 5 out of 5', 'التقييم 5 من 5'),
      pause: t('Pause the rotation', 'إيقاف التنقل التلقائي'),
      play: t('Resume the rotation', 'استئناف التنقل التلقائي'),
    },
    studio: {
      statement: t(
        'A senior team that scopes it, builds it, and stays for what comes after.',
        'فريق خبير يحدد النطاق، ويبني، ويبقى لما يأتي بعد الإطلاق.',
      ),
      body: t(
        'JOE13 is a software studio based in Riyadh, working with companies across the Gulf and the wider region.',
        'JOE13 استوديو برمجيات مقرّه الرياض، نعمل مع شركات في الخليج والمنطقة.',
      ),
      values: [
        { icon: 'Mission-1', title: t('Mission', 'الرسالة'), body: t('Empower businesses with software that drives growth and lasts.', 'تمكين الشركات ببرمجيات تدفع النمو وتدوم.') },
        { icon: 'mission', title: t('Vision', 'الرؤية'), body: t('Be the digital partner companies trust with their next product.', 'أن نكون الشريك الرقمي الذي تثق به الشركات في منتجها القادم.') },
        { icon: 'approach', title: t('Approach', 'المنهجية'), body: t('Strategy first, design led, engineered with measurable outcomes.', 'الاستراتيجية أولًا، والتصميم يقود، وهندسة بنتائج قابلة للقياس.') },
      ],
      stats: [
        { ...stats[0], icon: 'archive' },
        { ...stats[1], icon: 'happy-client' },
        { ...stats[4], icon: 'network-globe' },
        { ...stats[5], icon: 'expert-team' },
      ],
    },
    platforms: {
      title: t('Why companies build with JOE13', 'لماذا تبني الشركات مع JOE13'),
      lead: t(
        'We ship on the infrastructure and tools that run the products you already use.',
        'نُطلق منتجاتنا على البنية والأدوات التي تشغّل المنتجات التي تستخدمها يوميًا.',
      ),
      ring: t('platforms we ship on', 'منصة نبني عليها'),
      logos: PLATFORMS,
      commitments: [
        { icon: 'secure-reliable', title: t('Secure and reliable', 'آمن وموثوق'), body: t('Security reviews and audits are part of every release.', 'مراجعات وتدقيقات الأمان جزء من كل إصدار.') },
        { icon: 'expert-team', title: t('Senior team only', 'فريق خبير فقط'), body: t('The people who scope your project build it.', 'من يحدد نطاق مشروعك هو من يبنيه.') },
        { icon: 'measurable-results', title: t('Measurable results', 'نتائج قابلة للقياس'), body: t('Every phase ends with numbers you can check.', 'كل مرحلة تنتهي بأرقام يمكنك التحقق منها.') },
        { icon: 'support', title: t('Support around the clock', 'دعم على مدار الساعة'), body: t('Monitoring and on-call support ship with release one.', 'المراقبة والدعم الفوري يُطلقان مع أول إصدار.') },
      ],
    },
    plans: {
      title: t('Ways to work with us', 'طرق العمل معنا'),
      lead: t(
        'Start with a small team and scale up, or bring us a whole platform. Every plan includes code reviews and weekly reports.',
        'ابدأ بفريق صغير وتوسّع، أو أحضر لنا منصة كاملة. كل باقة تشمل مراجعة الكود وتقارير أسبوعية.',
      ),
      popular: base.pricing.popular,
      month: base.pricing.month,
      choose: t('Choose this plan', 'اختر هذه الباقة'),
      custom: base.pricing.customCta,
      icons: ['rocket', 'lightning', 'cube'],
      plans: base.pricing.plans,
      prefill: (name) => t(`I'm interested in the ${name}.`, `أنا مهتم بـ ${name}.`),
    },
    contact: {
      title: t('Tell us what you are building.', 'أخبرنا بما تبنيه.'),
      lead: t(
        'Send a short brief. A senior engineer replies within 24 hours with questions or a call slot.',
        'أرسل وصفًا قصيرًا. يرد عليك مهندس خبير خلال 24 ساعة بأسئلة أو موعد مكالمة.',
      ),
      fields: {
        name: base.cta.fields.name,
        email: base.cta.fields.email,
        company: t('Company (optional)', 'الشركة (اختياري)'),
        service: t('What do you need?', 'ما الذي تحتاجه؟'),
        message: t('About the project', 'عن المشروع'),
        messageHint: t('Goals, timeline, anything we should know. At least 20 characters.', 'الأهداف، المدة، وأي شيء يجب أن نعرفه. 20 حرفًا على الأقل.'),
      },
      services: [
        { value: 'web', label: t('Web app', 'تطبيق ويب') },
        { value: 'mobile', label: t('Mobile app', 'تطبيق جوال') },
        { value: 'ai', label: t('AI', 'ذكاء اصطناعي') },
        { value: 'cloud', label: t('Cloud', 'سحابة') },
        { value: 'other', label: t('Something else', 'شيء آخر') },
      ],
      submit: t('Send brief', 'أرسل الوصف'),
      sending: t('Sending', 'جارٍ الإرسال'),
      sentTitle: t('Brief sent', 'تم إرسال الوصف'),
      sentBody: t('We reply within 24 hours. Check your inbox for a confirmation.', 'سنرد خلال 24 ساعة. تحقق من بريدك لرسالة التأكيد.'),
      sendAnother: t('Send another brief', 'أرسل وصفًا آخر'),
      errors: {
        name: base.cta.errors.name,
        email: base.cta.errors.email,
        message: t('Add a few more words about the project (20 characters minimum).', 'أضف كلمات أكثر عن المشروع (20 حرفًا على الأقل).'),
        server: base.cta.errors.server,
        rate: t('Too many briefs from this network. Try again in an hour.', 'طلبات كثيرة من هذه الشبكة. حاول مجددًا بعد ساعة.'),
      },
      promises: [
        { icon: 'expert-team', label: t('Senior team', 'فريق خبير') },
        { icon: 'clock', label: t('Reply in 24 hours', 'رد خلال 24 ساعة') },
        { icon: 'verify', label: t('Free first consultation', 'استشارة أولى مجانية') },
      ],
      channels: [
        { icon: 'archive', label: t('Email', 'البريد'), value: base.footer.email, href: `mailto:${base.footer.email}` },
        { icon: 'phone-call', label: t('Phone', 'الهاتف'), value: base.footer.phone, href: `tel:${base.footer.phone.replace(/[^\d+]/g, '')}`, ltr: true },
        { icon: 'location-pin', label: t('Office', 'المكتب'), value: base.footer.address },
        { icon: 'clock', label: t('Hours', 'ساعات العمل'), value: base.footer.hours[0] },
      ],
      socials: SOCIALS,
      follow: t('Follow us', 'تابعنا'),
      copyright: t('© 2026 JOE13. All rights reserved.', '© 2026 JOE13. جميع الحقوق محفوظة.'),
    },
  };
}
