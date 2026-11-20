import { getLandingTwoContent } from '@/components/landing-2/content';

/*
 * All copy for the home page, in both locales. This module is the page's i18n
 * source: components never contain user-facing text; they read it from here.
 * Shared data (process, projects, testimonials, stats, stack, plans, contact
 * details) is read from the existing content files so /temp and / stay in sync.
 */

const PLATFORMS = [
  { slug: 'amazonaws', name: 'AWS' },
  { slug: 'google', name: 'Google Cloud' },
  { slug: 'microsoft', name: 'Microsoft Azure' },
  { slug: 'openai', name: 'OpenAI' },
  { slug: 'vercel', name: 'Vercel' },
  { slug: 'cloudflare', name: 'Cloudflare' },
  { slug: 'docker', name: 'Docker' },
  { slug: 'github', name: 'GitHub' },
  { slug: 'stripe', name: 'Stripe' },
  { slug: 'mongodb', name: 'MongoDB' },
  { slug: 'redis', name: 'Redis' },
  { slug: 'figma', name: 'Figma' },
  { slug: 'shopify', name: 'Shopify' },
  { slug: 'slack', name: 'Slack' },
  { slug: 'twilio', name: 'Twilio' },
  { slug: 'salesforce', name: 'Salesforce' },
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
      description: t(
        'JOE13 designs and engineers digital products — web platforms, mobile apps, cloud and AI — for companies across the Gulf and beyond.',
        'JOE13 تصمم وتهندس المنتجات الرقمية — منصات ويب وتطبيقات جوال وحلول سحابية وذكاء اصطناعي — لشركات في الخليج وخارجه.',
      ),
      ogAlt: t('JOE13 logo', 'شعار JOE13'),
    },
    brand: 'JOE13',
    tagline: t('Empowering your success', 'نُمكّن نجاحك'),
    ui: {
      skip: t('Skip to content', 'تخطَّ إلى المحتوى'),
      startProject: t('Start a project', 'ابدأ مشروعك'),
      language: ar ? 'English' : 'العربية',
      languageShort: ar ? 'EN' : 'ع',
      languageLabel: t('Switch language to Arabic', 'تغيير اللغة إلى الإنجليزية'),
      themeToLight: t('Switch to light mode', 'التبديل إلى الوضع الفاتح'),
      themeToDark: t('Switch to dark mode', 'التبديل إلى الوضع الداكن'),
      railLabel: t('Page sections', 'أقسام الصفحة'),
      mainNav: t('Main', 'الرئيسية'),
      menuOpen: t('Open menu', 'فتح القائمة'),
      menuClose: t('Close menu', 'إغلاق القائمة'),
      menu: t('Menu', 'القائمة'),
      sectionOf: (i, n, name) => t(`Section ${i} of ${n}: ${name}`, `القسم ${i} من ${n}: ${name}`),
      next: t('Next', 'التالي'),
      previous: t('Previous', 'السابق'),
      scroll: t('Scroll to explore', 'مرّر للاستكشاف'),
      backToTop: t('Back to top', 'العودة للأعلى'),
      loading: t('Loading', 'جارٍ التحميل'),
    },
    // Order = page order = side indicator order. `nav` puts it in the top bar.
    // `shape` picks the ribbon form that sits behind the section.
    sections: [
      { id: 'top', name: t('Intro', 'البداية'), shape: 'top' },
      { id: 'impact', name: t('Impact', 'الأثر'), shape: 'platforms' },
      { id: 'services', name: t('Services', 'الخدمات'), shape: 'services', nav: true },
      { id: 'process', name: t('Process', 'آلية العمل'), shape: 'process', nav: true },
      { id: 'work', name: t('Work', 'الأعمال'), shape: 'work', nav: true },
      { id: 'studio', name: t('About', 'من نحن'), shape: 'studio', nav: true },
      { id: 'stack', name: t('Stack', 'التقنيات'), shape: 'stack' },
      { id: 'voices', name: t('Clients', 'العملاء'), shape: 'voices' },
      { id: 'plans', name: t('Plans', 'الباقات'), shape: 'plans', nav: true },
      { id: 'contact', name: t('Contact', 'تواصل'), shape: 'contact' },
    ],

    hero: {
      badge: t('Software studio · Riyadh', 'استوديو برمجيات · الرياض'),
      lines: ar ? ['أفكار جريئة.', 'مُهندَسة', 'لتقود.'] : ['Bold ideas.', 'Engineered', 'to lead.'],
      accentLine: 1,
      // 3D scene: hint under it and the cursor label over it
      sceneHint: t('Drag to spin · click to build', 'اسحب للتدوير · اضغط للبناء'),
      dragShort: t('Drag', 'اسحب'),
      sub: base.hero.sub,
      primary: t('Start a project', 'ابدأ مشروعك'),
      secondary: t('See the work', 'شاهد الأعمال'),
      proof: [
        { value: `${stats[0].value}${stats[0].suffix}`, label: stats[0].label },
        { value: `${stats[3].value}${stats[3].suffix}`, label: stats[3].label },
        { value: t('24h', '24 ساعة'), label: t('Reply to every brief', 'للرد على كل طلب') },
      ],
    },

    impact: {
      eyebrow: t('Impact', 'الأثر'),
      title: t('Numbers we are proud to sign.', 'أرقام نفخر بالتوقيع عليها.'),
      lead: t(
        'Every figure below is a product that shipped, a client who stayed, or an engineer who owns the work.',
        'كل رقم هنا منتج تم إطلاقه، أو عميل بقي معنا، أو مهندس يمتلك عمله.',
      ),
      items: stats.map((s, i) => ({ ...s, icon: ['archive', 'happy-client', 'expert-team', 'measurable-results', 'network-globe', 'users'][i] })),
      platformsLabel: t('Shipping on the platforms you already trust', 'نُطلق على المنصات التي تثق بها'),
      logos: PLATFORMS,
    },

    services: {
      eyebrow: t('What we do', 'ما نقدمه'),
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
      eyebrow: t('How we work', 'كيف نعمل'),
      title: t('How a project moves', 'كيف يتحرك المشروع'),
      lead: t(
        'Fifteen weeks from first call to launch, then we stay. Scroll through the phases or pick one.',
        'خمسة عشر أسبوعًا من أول مكالمة حتى الإطلاق، ثم نبقى معك. مرّر عبر المراحل أو اختر إحداها.',
      ),
      icons: ['search', 'web-design', 'code', 'qc', 'rocket', 'support'],
      phases: base.process.phases,
      phaseOf: (i, n) => t(`Phase ${i} of ${n}`, `المرحلة ${i} من ${n}`),
      pick: t('Process phases', 'مراحل العمل'),
    },

    work: {
      eyebrow: t('Selected work', 'أعمال مختارة'),
      title: t('Products in the wild', 'منتجات تعمل في الواقع'),
      lead: base.projects.subtitle,
      challenge: t('Challenge', 'التحدي'),
      solution: t('What we built', 'ما بنيناه'),
      results: t('Results', 'النتائج'),
      stack: t('Stack', 'التقنيات'),
      hint: t('Keep scrolling — the work moves sideways', 'استمر في التمرير — الأعمال تتحرك أفقيًا'),
      hintTouch: t('Swipe to see every project', 'اسحب لرؤية كل المشاريع'),
      cta: t('Build something like this', 'ابنِ شيئًا مشابهًا'),
      prefill: (name) => t(`We'd like something like "${name}".`, `نريد شيئًا مثل "${name}".`),
      items: base.projects.items,
    },

    studio: {
      eyebrow: t('About JOE13', 'عن JOE13'),
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
      commitTitle: t('Why companies build with us', 'لماذا تبني الشركات معنا'),
      commitments: [
        { icon: 'secure-reliable', title: t('Secure and reliable', 'آمن وموثوق'), body: t('Security reviews and audits are part of every release.', 'مراجعات وتدقيقات الأمان جزء من كل إصدار.') },
        { icon: 'expert-team', title: t('Senior team only', 'فريق خبير فقط'), body: t('The people who scope your project build it.', 'من يحدد نطاق مشروعك هو من يبنيه.') },
        { icon: 'measurable-results', title: t('Measurable results', 'نتائج قابلة للقياس'), body: t('Every phase ends with numbers you can check.', 'كل مرحلة تنتهي بأرقام يمكنك التحقق منها.') },
        { icon: 'support', title: t('Support around the clock', 'دعم على مدار الساعة'), body: t('Monitoring and on-call support ship with release one.', 'المراقبة والدعم الفوري يُطلقان مع أول إصدار.') },
      ],
    },

    stack: {
      eyebrow: t('Technology', 'التقنية'),
      title: ar ? ['امتلك التقنية.', 'وابقَ في السيطرة.'] : ['Own the stack.', 'Stay in control.'],
      body: base.tech.body,
      icons: ['web-design', 'code', 'mobile', 'cloud', 'archive', 'cube'],
      groups: tech,
      pick: t('Choose a layer', 'اختر طبقة'),
    },

    voices: {
      eyebrow: t('Clients', 'العملاء'),
      title: t('What clients say after launch', 'ماذا يقول العملاء بعد الإطلاق'),
      items: base.testimonials.items.slice(0, 12),
      rating: t('Rated 5 out of 5', 'التقييم 5 من 5'),
      pause: t('Pause the moving reviews', 'إيقاف حركة المراجعات'),
      play: t('Play the moving reviews', 'تشغيل حركة المراجعات'),
    },

    plans: {
      eyebrow: t('Engagement', 'التعاقد'),
      title: t('Ways to work with us', 'طرق العمل معنا'),
      lead: t(
        'Start with a small team and scale up, or bring us a whole platform. Every plan includes code reviews and weekly reports.',
        'ابدأ بفريق صغير وتوسّع، أو أحضر لنا منصة كاملة. كل باقة تشمل مراجعة الكود وتقارير أسبوعية.',
      ),
      popular: base.pricing.popular,
      month: base.pricing.month,
      choose: t('Choose this plan', 'اختر هذه الباقة'),
      custom: base.pricing.customCta,
      included: t('What’s included', 'ما تشمله الباقة'),
      icons: ['rocket', 'lightning', 'cube'],
      plans: base.pricing.plans,
      prefill: (name) => t(`I'm interested in the ${name}.`, `أنا مهتم بـ ${name}.`),
    },

    contact: {
      eyebrow: t('Start a project', 'ابدأ مشروعك'),
      big: ar ? ['لنبنِ', 'الشيء القادم.'] : ["Let's build", 'what’s next.'],
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
        { icon: 'mail', label: t('Email', 'البريد'), value: base.footer.email, href: `mailto:${base.footer.email}` },
        { icon: 'phone', label: t('Phone', 'الهاتف'), value: base.footer.phone, href: `tel:${base.footer.phone.replace(/[^\d+]/g, '')}`, ltr: true },
        { icon: 'pin', label: t('Office', 'المكتب'), value: base.footer.address },
        { icon: 'clock', label: t('Hours', 'ساعات العمل'), value: base.footer.hours[0] },
      ],
    },

    footer: {
      about: t(
        'A software studio that designs and engineers digital products for ambitious companies.',
        'استوديو برمجيات يصمم ويهندس المنتجات الرقمية للشركات الطموحة.',
      ),
      explore: t('Explore', 'استكشف'),
      services: t('Services', 'الخدمات'),
      contact: t('Contact', 'تواصل'),
      follow: t('Follow us', 'تابعنا'),
      socials: SOCIALS,
      copyright: t('© 2026 JOE13. All rights reserved.', '© 2026 JOE13. جميع الحقوق محفوظة.'),
      made: t('Designed and engineered in Riyadh.', 'صُمم وهُندس في الرياض.'),
    },
  };
}
