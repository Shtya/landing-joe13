import { getLandingContent } from '@/components/landing-1/content';

export function getLandingTwoContent(locale) {
  const base = getLandingContent(locale);
  const isAr = locale === 'ar';
  const services = base.services.items;

  return {
    ...base,
    metaTitle: isAr
      ? 'Joe13 | تحويل الأفكار إلى برمجيات قوية'
      : 'Joe13 | Transform Ideas Into Powerful Software',
    metaDescription: base.metaDescription,
    brand: 'Joe13',
    nav: {
      ...base.nav,
      home: isAr ? 'الرئيسية' : 'Home',
      about: isAr ? 'من نحن' : 'About Us',
      contactCta: isAr ? 'تواصل معنا' : 'Get in Touch',
    },
    hero: {
      ...base.hero,
      badge: isAr ? 'نحوّل الرؤى إلى أثر رقمي' : 'WE BUILD CATEGORY-LEADING DIGITAL PRODUCTS',
      line1: isAr ? 'حوّل الأفكار الجريئة إلى' : 'Turn Bold Ideas Into',
      line2: isAr ? 'برمجيات تقود السوق' : 'Market-Leading Software',
      sub: isAr
        ? 'نصمم ونبني منتجات رقمية عالية الأداء تساعدك على الانطلاق أسرع، والتوسع بثقة، والتفوق على المنافسين.'
        : 'We design and engineer high-performance digital products that help you launch faster, scale with confidence, and outperform the competition.',
      cards: [
        { key: 'dev', title: services[0].title, body: services[0].desc },
        { key: 'cloud', title: services[3].title, body: services[3].desc },
        { key: 'ui', title: services[1].title, body: services[1].desc },
        { key: 'data', title: services[2].title, body: services[2].desc },
      ],
    },
    heroStats: [
      {
        key: 'clients',
        title: isAr ? 'يثق بنا العملاء' : 'Trusted by Clients',
        value: '100+',
        sub: isAr ? 'عملاء سعداء' : 'happy clients',
      },
      {
        key: 'delivery',
        title: isAr ? 'تسليم في الوقت' : 'On-Time Delivery',
        value: null,
        sub: isAr ? 'نحترم المواعيد النهائية' : 'We respect deadlines',
      },
      {
        key: 'quality',
        title: isAr ? 'جودة مضمونة' : 'Quality Assured',
        value: null,
        sub: isAr ? 'مبني بإتقان' : 'Built to perfection',
      },
    ],
    projects: {
      ...base.projects,
      badge: isAr ? 'أعمال مميزة' : 'FEATURED WORK',
      subtitle: isAr
        ? 'حلول حقيقية. أثر حقيقي. مبنية لتحقيق النتائج.'
        : 'Real solutions. Real impact. Built to drive results.',
      readStory: isAr ? 'عرض دراسة الحالة كاملة' : 'View Full Case Study',
      items: isAr
        ? [
            {
              title: 'منصة تجارة إلكترونية متقدمة',
              sector: 'قطاع الإلكترونيات',
              client: 'قطاع الإلكترونيات',
              challenge: 'العميل احتاج منصة تتحمل 50 ألف عميل متزامن.',
              solution: 'بنينا معمارية microservices على Kubernetes.',
              results: ['99.9% وقت تشغيل', 'زمن الاستجابة: 200ms', 'تحملنا زيادة ترافيك 10×'],
              stack: ['Next.js', 'Node.js', 'MongoDB', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=650&fit=crop',
            },
            {
              title: 'لوحة FinTech',
              sector: 'قطاع FinTech',
              client: 'قطاع FinTech',
              challenge: 'فريق القيادة احتاج رؤية لحظية عبر مصادر بيانات متفرقة.',
              solution: 'بنينا طبقة تحليلات فورية مع كشف شذوذ بالذكاء الاصطناعي.',
              results: ['وقت القرار أقل 60%', '12 مصدر بيانات موحّد', 'تنبيهات خلال 3 ثوانٍ'],
              stack: ['Python', 'FastAPI', 'PostgreSQL', 'React'],
              thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=650&fit=crop',
            },
            {
              title: 'نظام الرعاية الصحية',
              sector: 'قطاع الرعاية الصحية',
              client: 'قطاع الرعاية الصحية',
              challenge: 'المستشفى احتاج منصة موحّدة لإدارة السجلات والمواعيد.',
              solution: 'سلمنا نظام HIPAA-compliant مع تكامل EHR وبوابة للمرضى.',
              results: ['40% تقليل وقت الانتظار', '100% امتثال', '50K+ مريض'],
              stack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=650&fit=crop',
            },
            {
              title: 'تحليلات SaaS',
              sector: 'قطاع SaaS',
              client: 'قطاع SaaS',
              challenge: 'شركة SaaB ناشئة احتاجت لوحة نمو قابلة للتوسع.',
              solution: 'بنينا analytics pipeline مع تقارير وتنبؤات مخصّصة.',
              results: ['3× سرعة onboarding', '95% دقة التنبؤ', '200+ عميل B2B'],
              stack: ['Next.js', 'Python', 'Redis', 'GCP'],
              thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=650&fit=crop',
            },
            {
              title: 'تطبيق حجز السفر',
              sector: 'قطاع السفر',
              client: 'قطاع السفر',
              challenge: 'وكالة سفر احتاجت تجربة حجز سلسة على الجوال.',
              solution: 'طوّرنا تطبيق React Native مع حجز فوري ودفع آمن.',
              results: ['4.7★ تقييم', '500K+ حجز', '35% زيادة التحويل'],
              stack: ['React Native', 'Node.js', 'Stripe', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=650&fit=crop',
            },
            {
              title: 'منصة محتوى بالذكاء الاصطناعي',
              sector: 'AI / SaaS',
              client: 'قطاع AI / SaaS',
              challenge: 'فريق تسويق احتاج إنتاج محتوى على نطاق واسع دون فقدان الجودة.',
              solution: 'بنينا منصة AI content مع workflows قابلة للتخصيص.',
              results: ['10× سرعة الإنتاج', '85% رضا المستخدمين', '1M+ قطعة محتوى'],
              stack: ['Next.js', 'OpenAI', 'PostgreSQL', 'Vercel'],
              thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=650&fit=crop',
            },
          ]
        : [
            {
              title: 'Advanced E-Commerce Platform',
              sector: 'ELECTRONICS SECTOR',
              client: 'Electronics sector',
              challenge: 'The client needed a platform that could handle 50k concurrent customers.',
              solution: 'We built a microservices architecture on Kubernetes.',
              results: ['99.9% uptime', 'Response time: 200ms', 'Handled 10x traffic increase'],
              stack: ['Next.js', 'Node.js', 'MongoDB', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=650&fit=crop',
            },
            {
              title: 'FinTech Dashboard',
              sector: 'FINTECH SECTOR',
              client: 'FinTech sector',
              challenge: 'Leadership needed live insight across fragmented data sources.',
              solution: 'We shipped a real-time analytics layer with ML anomaly detection.',
              results: ['Decision time cut by 60%', '12 data sources unified', 'Alerts in under 3 seconds'],
              stack: ['Python', 'FastAPI', 'PostgreSQL', 'React'],
              thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=650&fit=crop',
            },
            {
              title: 'HealthCare System',
              sector: 'HEALTHCARE SECTOR',
              client: 'Healthcare sector',
              challenge: 'The hospital needed a unified platform for records and appointments.',
              solution: 'We delivered a HIPAA-compliant system with EHR integration and a patient portal.',
              results: ['40% reduction in wait times', '100% compliance', '50K+ patients served'],
              stack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&h=650&fit=crop',
            },
            {
              title: 'SaaS Analytics',
              sector: 'SAAS SECTOR',
              client: 'SaaS sector',
              challenge: 'A growing SaaS startup needed a scalable growth dashboard.',
              solution: 'We built an analytics pipeline with custom reporting and forecasting.',
              results: ['3x faster onboarding', '95% forecast accuracy', '200+ B2B clients'],
              stack: ['Next.js', 'Python', 'Redis', 'GCP'],
              thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=650&fit=crop',
            },
            {
              title: 'Travel Booking App',
              sector: 'TRAVEL SECTOR',
              client: 'Travel sector',
              challenge: 'A travel agency needed a seamless mobile booking experience.',
              solution: 'We developed a React Native app with instant booking and secure payments.',
              results: ['4.7★ app rating', '500K+ bookings', '35% conversion lift'],
              stack: ['React Native', 'Node.js', 'Stripe', 'AWS'],
              thumb: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=650&fit=crop',
            },
            {
              title: 'AI Content Platform',
              sector: 'AI / SAAS SECTOR',
              client: 'AI / SaaS sector',
              challenge: 'A marketing team needed to scale content production without sacrificing quality.',
              solution: 'We built an AI content platform with customizable workflows and brand guardrails.',
              results: ['10x content velocity', '85% user satisfaction', '1M+ content pieces generated'],
              stack: ['Next.js', 'OpenAI', 'PostgreSQL', 'Vercel'],
              thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=120&h=120&fit=crop',
              preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=650&fit=crop',
            },
          ],
    },
  };
}
