# Nexus Landing Page

A premium, cinematic software company landing page built with **Next.js 14 App Router**, featuring a live **3D scroll experience**, full **EN/AR internationalization**, dark/light mode, and a working contact form with PostgreSQL backend.

---

## ✨ Features

- **6-State 3D Globe** — A living constellation globe that transforms across 6 cinematic scroll states using Three.js + React Three Fiber
- **16 Sections** — Hero, About, Services, Features, Process, Tech Stack, Portfolio, Case Studies, Testimonials, Team, Stats, Pricing, FAQ, CTA, Contact, Footer
- **Bilingual (EN/AR)** — Full RTL support for Arabic with `next-intl`
- **Dark / Light Mode** — System-aware with `localStorage` persistence
- **Contact Form** — Real-time validation, honeypot spam protection, rate limiting, PostgreSQL storage
- **SEO Ready** — Open Graph, Twitter Cards, JSON-LD structured data, sitemap, robots.txt
- **Performance** — `frameloop="demand"`, dynamic imports, font optimization, lazy loading

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> nexus-landing
cd nexus-landing
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Set Up Database (Optional)

The contact form gracefully degrades without a database. To enable it:

```bash
# Connect to your PostgreSQL instance and run:
psql -U postgres

CREATE DATABASE nexus_landing;
\c nexus_landing

CREATE TABLE contact_submissions (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  company     VARCHAR(100),
  service     VARCHAR(20),
  budget      VARCHAR(20),
  message     TEXT          NOT NULL,
  ip_address  INET,
  user_agent  TEXT,
  locale      VARCHAR(10)   DEFAULT 'en',
  status      VARCHAR(20)   DEFAULT 'new',
  created_at  TIMESTAMPTZ   DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX idx_contact_email       ON contact_submissions(email);
CREATE INDEX idx_contact_status      ON contact_submissions(status);
CREATE INDEX idx_contact_created_at  ON contact_submissions(created_at DESC);
```

Then update `DATABASE_URL` in `.env.local`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nexus_landing
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/en`.

Visit [http://localhost:3000/ar](http://localhost:3000/ar) for the Arabic RTL version.

---

## 📁 Project Structure

```
nexus-landing/
├── app/
│   ├── [locale]/
│   │   ├── layout.js        ← HTML lang/dir, fonts, metadata
│   │   ├── page.js          ← All sections assembled
│   │   └── api/contact/
│   │       └── route.js     ← POST /api/contact
│   ├── globals.css
│   └── sitemap.js
│
├── components/
│   ├── 3d/                  ← Three.js components (SSR disabled)
│   │   ├── SceneManager.jsx
│   │   ├── GlobeState1.jsx  ← State 1: Living Globe (0–22%)
│   │   ├── GlobeState2.jsx  ← State 2: Architecture Split (22–48%)
│   │   ├── FeatureOrbs.jsx  ← State 3: Feature Orbs (48–62%)
│   │   ├── CircuitBoard.jsx ← State 4: Performance (62–78%)
│   │   ├── IntegrationHub.jsx ← State 5: Integrations (78–90%)
│   │   └── GlobeReassemble.jsx ← State 6: CTA Globe (90–100%)
│   ├── sections/            ← 16 page sections
│   ├── layout/              ← Navbar, MobileMenu
│   └── ui/                  ← Button, Card, Badge, Accordion, etc.
│
├── lib/
│   ├── db.js                ← PostgreSQL pool
│   ├── validate.js          ← Form validation
│   └── rateLimit.js         ← In-memory rate limiter (3 req/hr/IP)
│
├── messages/
│   ├── en.json              ← English translations
│   └── ar.json              ← Arabic translations
│
├── i18n.js                  ← next-intl config
├── middleware.js            ← Locale routing
└── tailwind.config.js
```

---

## 🌍 Internationalization

URL structure:
- `/en` — English (LTR)
- `/ar` — Arabic (RTL)

Switch languages via the toggle in the Navbar or Footer. The locale is preserved across navigation.

---

## 🎨 Design Tokens

Colors are defined as CSS variables in `app/globals.css`. The theme switches instantly via the `dark` class on `<html>`.

| Token | Light | Dark |
|-------|-------|------|
| Background | `#F0F4F5` | `#0C1416` |
| Primary | `#2E6B74` | `#4DC9D8` |
| Accent | `#4A9E7A` | `#5DBF96` |

---

## 🏗️ 3D Scroll Experience

The `<Canvas>` is fixed (`position: fixed, inset: 0, z-index: 0`) and the page content scrolls on top. Scroll progress (0→1) drives all 3D state transitions via `useScroll` from `@react-three/drei`.

| Scroll Range | Scene |
|-------------|-------|
| 0% – 22% | Living constellation globe with breathing nodes |
| 22% – 48% | Globe splits, architecture slabs rise |
| 48% – 62% | Feature orbs emerge from slabs |
| 62% – 78% | PCB circuit board with animated traces |
| 78% – 90% | Integration hub with orbiting cubes |
| 90% – 100% | Globe reassembles with particle burst |

---

## 📬 Contact Form API

**Endpoint:** `POST /api/contact`

**Rate limit:** 3 requests per IP per hour

**Validation:**
- `name`: 2–100 chars
- `email`: valid RFC format
- `company`: optional, max 100 chars
- `service`: one of `web | mobile | cloud | ai | devops | other`
- `budget`: one of `<10k | 10-50k | 50-100k | 100k+`
- `message`: 20–2000 chars
- `_honeypot`: must be empty

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Add environment variables in the Vercel dashboard.

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-hosted

```bash
npm run build
npm start
```

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |

---

## 📋 Requirements

- Node.js 18.17+ 
- PostgreSQL 14+ (optional — form works without it)
- npm 9+

---

## 🎯 Performance Tips

- On low-end devices, the 3D canvas auto-reduces quality (pixelRatio capped at 2)
- `prefers-reduced-motion` disables scroll-driven 3D transitions
- Mobile: node count reduced to 200, bloom disabled
- All 3D components use `dynamic()` with `ssr: false`

---

Built with ❤️ by the Nexus team.
