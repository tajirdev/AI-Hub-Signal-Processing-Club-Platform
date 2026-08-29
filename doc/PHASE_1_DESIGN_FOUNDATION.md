# PHASE 1 — DESIGN FOUNDATION
# AI Hub & Signal Processing Club — Public Website

> **Status:** PERMANENT REFERENCE — Read before implementing any page or component
> **Phase:** 1 — Frontend Inspection & Design System
> **Created:** August 25, 2026
> **Source:** Full inspection of existing frontend codebase + all backend API routes
> **Supersedes:** Nothing — extends PHASE0_MASTER_REFERENCE.md

---

## PART A — CURRENT FRONTEND ASSESSMENT

### A.1 — What Is Good and Should Be Kept

| Component | Assessment | Keep? |
|---|---|---|
| CSS custom properties system | Excellent. Dual-theme (light + dark). Brand colors are correctly wired. | YES — Keep as-is |
| Dark/light theme toggle | Works well. Persists to localStorage. System preference aware. | YES — Enhance, not replace |
| Navbar structure (grouped dropdown) | Smart grouping for 11 items. Mobile hamburger logic is clean. | YES — Adapt, not replace |
| Terminal3D concept | Directly aligned with spec (pip install AI_Hub concept). Already implemented. | YES — Keep and polish |
| Hero two-column layout | Correct split: content left, terminal right. Responsive swap on mobile. | YES — Keep structure |
| StatsStrip animation | IntersectionObserver trigger is correct. Icon + counter design is professional. | YES — Keep, connect to API |
| Footer card design | NAS.com-style rounded card is clean and professional. Multi-column grid. | YES — Keep, fix URLs |
| App.css shadow/radius system | `--radius`, `--shadow-soft`, `--shadow-medium` are consistent and reusable. | YES — Use everywhere |
| Scroll-blur navbar behavior | `.navbar--scrolled` with backdrop-filter is correct pattern. | YES — Keep |
| Box-sizing and base resets | `*, *::before, *::after` box-sizing is correct. | YES — Keep |
| Mono font for terminal | Cascadia Code/Fira Code for terminal is exactly right. | YES — Keep |

---

### A.2 — What Needs Fixing or Improvement

| Item | Problem | Priority | Fix |
|---|---|---|---|
| Hero headline | "IGNITE YOUR AI JOURNEY" — wrong text per spec | HIGH | Change to correct Hub identity text |
| Hero CTA 1 | "Join Us" — wrong per spec | HIGH | Change to "Explore Research" |
| Hero CTA 2 | "View Work" — wrong per spec | HIGH | Change to "Join the Hub" |
| Hero CTAs are `<a>` with `#` hrefs | These go nowhere — no routing exists | HIGH | Wire to React Router routes in Phase 3 |
| Font system | system-ui / Segoe UI — not spec-compliant | HIGH | Add Montserrat + Inter from Google Fonts |
| No React Router | Zero routing — no pages can exist | CRITICAL | Install react-router-dom before Phase 3 |
| No .env file (frontend) | No API base URL config | HIGH | Create `.env` with VITE_API_BASE_URL |
| No API service layer | No fetch/axios calls to backend | HIGH | Create `src/services/api.js` in Phase 3 |
| No auth context | No JWT state management | HIGH | Create AuthContext in Phase 3 |
| StatsStrip hardcoded data | Numbers are fake and static | MEDIUM | Connect to backend `/member` + `/sub_groups` + `/projects` + `/research` |
| Footer social URLs | All `#` placeholders | MEDIUM | Replace when club provides real URLs |
| Footer contact email | Placeholder | MEDIUM | Replace when club provides real email |
| YouTube icon missing in footer | Referenced in spec, missing in code | LOW | Add YouTube icon to social row |
| logo.png is tiny (3363 bytes) | Almost certainly a placeholder or low quality | MEDIUM | Replace when club provides real logo |
| hero.png asset unused | In assets/ but not referenced in code | LOW | Review and use or remove |
| Navbar uses plain `<a href>` | Not React Router `<Link>` tags | HIGH | Convert to `<Link>` when routing is installed |
| Navbar has no active state | No visual indicator for current page | MEDIUM | Add active route detection in Phase 3 |
| Mobile nav: `.btn-join-nav` is hidden | `display: none` at mobile — "Join Us" CTA disappears on smallest screens | MEDIUM | Rethink: show a compact version or move inside menu |
| No `<meta>` tags anywhere | No SEO, no Open Graph | MEDIUM | Add per-page meta in Phase 3+ |
| Dropdown closes body-click | No click-outside handler in navbar | MEDIUM | Add ref + outside click close in Phase 3 |
| AI chat preview is non-functional | Opens a hardcoded stub, no backend | LOW | Remove stub or add clear "Coming Soon" label |
| Features folders are empty shells | `About/components/`, `Members/components/` are empty | NOTE | Folder architecture exists — good. Fill in Phase 3+ |
| No `vite.config.js` reviewed | Unknown proxy config | NOTE | Check if backend proxy is configured |

---

### A.3 — What Should Be Removed

| Item | Reason |
|---|---|
| `hero.png` in assets (if unused) | If not referenced anywhere, it is dead weight |
| `react.svg` and `vite.svg` | Default Vite scaffolding assets — not needed |
| AI chat stub (current implementation) | Misleading UX — it is broken. Either remove or label clearly as upcoming feature |
| Hardcoded stat numbers | 250+, 200+, 45+ — must never show hardcoded data to real visitors |

---

### A.4 — What Should Be Redesigned

| Item | Reason |
|---|---|
| Hero headline copy | Doesn't match brand spec |
| Hero CTA labels | Don't match spec |
| Navbar NAV_GROUPS data | Should include "Join Us" as a visible top-level link; "Resources" should be accessible |
| `features/` folder structure | Rename `About-US` → `about`. Add: `home`, `projects`, `research`, `events`, `blog`, `resources`, `members`, `contact`, `auth` |

---

## PART B — BRAND SYSTEM (CANONICAL)

### B.1 — Colors

#### Primary Colors (Brand Identity)
| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| Deep Navy | `#0A2472` | `--navy` | Navigation bg, headings, major backgrounds, hero sections, footer |
| Golden Amber | `#FFBA08` | `--accent` | CTAs, buttons, highlights, icons, statistics, hover states, accent lines |

#### Extended Navy Range
| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| Navy Soft | `#173B97` | `--navy-soft` | Hover states, secondary navy elements (light mode) |
| Navy Deep | `#071C52` | `--navy-deep` | Deepest navy, very dark sections |

#### Neutral Palette (Light Mode)
| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| Background | `#FAFAFA` | `--bg` | Page background |
| Text | `#1A1A1A` | `--text` | Primary body text |
| Text Muted | `#4D5D8A` | `--text-muted` | Captions, metadata, secondary text |
| Surface | `#FFFFFF` | `--surface` | Cards, panels, modals |
| Surface Alt | `#EDF3FF` | `--surface-alt` | Alternate card / section shading |
| Panel Border | `rgba(10,36,114,0.08)` | `--panel-border` | Card borders, dividers |
| Accent Soft | `#FFF4CC` | `--accent-soft` | Very subtle amber tints, tags, badges |
| Accent Hover | `#E9A900` | `--accent-hover` | Button hover, link hover |

#### Neutral Palette (Dark Mode)
| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| Background | `#071225` | `--bg` | Deep dark background |
| Text | `#EDF4FF` | `--text` | Near-white readable text |
| Text Muted | `#B8C9EB` | `--text-muted` | Secondary text |
| Surface | `#0D1B30` | `--surface` | Cards and panels |
| Surface Alt | `#132741` | `--surface-alt` | Alternate panels |
| Header BG | `rgba(9,17,29,0.9)` | `--header-bg` | Blurred nav background |
| Panel Border | `rgba(150,172,255,0.18)` | `--panel-border` | Borders on dark |
| Navy Soft (dark) | `#D5E2FF` | `--navy-soft` | Light accent for dark mode |
| Accent Hover (dark) | `#FFD75A` | `--accent-hover` | Brighter gold on dark |

#### Terminal Specific
| Name | Hex | CSS Variable |
|---|---|---|
| Terminal BG | `#1A1A2E` | `--terminal-bg` |
| Terminal Edge | `#0F0F1A` | `--terminal-edge` |

#### Color Hierarchy Rules
1. **Golden Amber (`#FFBA08`)** on **Deep Navy (`#0A2472`)** = primary brand pairing
2. **White** on **Deep Navy** = maximum legibility on dark backgrounds
3. **Deep Navy** on **Light Gray** = professional text content areas
4. **Never** put Golden Amber on white without sufficient size — contrast fails at small sizes
5. **Never** mix in random reds, greens, purples, or teals without a clear semantic reason

---

### B.2 — Typography

#### Font Stack (TO BE IMPLEMENTED)
```css
/* Import in index.html or App.css */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-heading: 'Montserrat', system-ui, sans-serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'Cascadia Code', 'Fira Code', ui-monospace, monospace;
}
```

#### Font Choice Rationale
- **Montserrat** — Strong, geometric, highly legible. Used by major tech organizations. Bold weights communicate authority and professionalism. Perfect for an AI/research organization.
- **Inter** — Designed specifically for screen readability. Excellent at small sizes. Clean neutral companion to Montserrat. Standard across major SaaS/research platforms.

#### Type Scale
| Element | Font | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 — Page hero | Montserrat | 900 | clamp(2.5rem, 6vw, 5rem) | 1.05 | -0.04em |
| H2 — Section title | Montserrat | 800 | clamp(1.8rem, 3.5vw, 3rem) | 1.1 | -0.02em |
| H3 — Card/subsection | Montserrat | 700 | clamp(1.2rem, 2vw, 1.6rem) | 1.2 | -0.01em |
| H4 — Column heading | Montserrat | 600 | 1.1rem | 1.3 | 0 |
| Body Large | Inter | 400 | 1.125rem | 1.7 | 0 |
| Body Default | Inter | 400 | 1rem | 1.65 | 0 |
| Body Small | Inter | 400 | 0.875rem | 1.6 | 0 |
| Caption / Meta | Inter | 400 | 0.8rem | 1.5 | 0.01em |
| Button | Montserrat | 700 | 0.9rem | 1 | 0.04em (uppercase) |
| Navigation link | Inter | 600 | 0.9rem | 1 | 0.01em |
| Tag / Badge | Inter | 600 | 0.75rem | 1 | 0.06em (uppercase) |
| Code / Terminal | Cascadia Code | 400 | 0.9rem | 1.6 | 0 |

#### Typography Rules
1. Headings ALWAYS use Montserrat. Body ALWAYS uses Inter. Never mix heading font into body.
2. Hero H1 uses Montserrat 900 weight minimum.
3. Section headers (H2) are consistently Montserrat 800 with deep navy color.
4. Body text line-height never below 1.6 — critical for mobile readability.
5. Navigation uses Inter 600 — readable and distinct.
6. Buttons use Montserrat 700 with uppercase letter-spacing for CTAs.
7. Code blocks and terminal ALWAYS use monospace.
8. No more than 3 font weights visible on a single screen at once.

---

### B.3 — Spacing System

All spacing follows a consistent multiplied scale to maintain rhythm across the page.

```css
/* Spacing tokens */
--space-1:  0.25rem;   /* 4px  — tight gap between icon and label */
--space-2:  0.5rem;    /* 8px  — small internal padding */
--space-3:  0.75rem;   /* 12px — compact item gap */
--space-4:  1rem;      /* 16px — base unit */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px — card padding */
--space-8:  2rem;      /* 32px — section internal padding */
--space-10: 2.5rem;    /* 40px — component separation */
--space-12: 3rem;      /* 48px — section gap */
--space-16: 4rem;      /* 64px — section vertical padding */
--space-24: 6rem;      /* 96px — large section padding */
```

#### Section Spacing Rules
- Vertical padding for major sections: `--space-16` (64px) minimum on desktop
- On mobile, reduce to `--space-10` (40px)
- Consistent `--space-12` (48px) between sections
- Cards: `--space-6` (24px) internal padding
- White space is intentional — do not compress sections to fit more content

---

### B.4 — Border Radius System (Already Exists — Standardize)

```css
--radius-sm:   6px;   /* small elements: tags, badges, inputs */
--radius:      12px;  /* standard: cards, buttons, modals */
--radius-lg:   18px;  /* large: section cards, featured items */
--radius-xl:   28px;  /* footer card, hero terminal */
--radius-pill: 999px; /* pills, round buttons */
--radius-full: 50%;   /* avatar circles, stat icons */
```

---

### B.5 — Shadow System (Already Exists — Standardize)

```css
--shadow-soft:     0 4px 24px rgba(10,36,114,0.12);   /* subtle card lift */
--shadow-medium:   0 12px 40px rgba(10,36,114,0.18);  /* hover, modal */
--shadow-terminal: 0 30px 60px rgba(26,26,46,0.35);   /* terminal 3D depth */
--shadow-amber:    0 4px 20px rgba(255,186,8,0.25);   /* CTA/button glow */
```

---

### B.6 — Visual Style Guide

#### Buttons
```
PRIMARY BUTTON:
  Background: --accent (#FFBA08)
  Text: #1A1A1A (dark, not white — amber background)
  Font: Montserrat 700
  Case: UPPERCASE with 0.04em letter-spacing
  Padding: 0.85rem 1.75rem
  Radius: --radius-pill
  Hover: --accent-hover (#E9A900), translateY(-2px), shadow-amber

SECONDARY BUTTON:
  Background: transparent
  Border: 2px solid --navy (#0A2472)
  Text: --navy
  Font: Montserrat 700
  Padding: 0.85rem 1.75rem
  Radius: --radius-pill
  Hover: background --navy, text white

GHOST BUTTON (dark surfaces):
  Background: rgba(255,255,255,0.1)
  Border: 1px solid rgba(255,255,255,0.2)
  Text: white
  Hover: rgba(255,255,255,0.2)
```

#### Cards
```
STANDARD CARD:
  Background: --surface
  Border: 1px solid --panel-border
  Radius: --radius-lg (18px)
  Shadow: --shadow-soft
  Padding: --space-6 (24px)
  Hover: shadow-medium, translateY(-4px)
  Transition: 0.25s ease all

FEATURED CARD:
  Same as standard but with amber accent-left border:
  border-left: 4px solid --accent

DARK SURFACE CARD:
  Background: --surface (dark mode resolved)
  Border: 1px solid --panel-border (dark mode resolved)
```

#### Section Headers
```
SECTION LABEL (above H2):
  Text: "WHO WE ARE" / "OUR RESEARCH" etc.
  Font: Inter 700
  Size: 0.75rem
  Color: --accent
  Uppercase, letter-spacing: 0.12em
  Display: inline-block with amber underline or left-border accent

SECTION TITLE (H2):
  Font: Montserrat 800
  Color: --navy (light) / white (dark)
  Size: clamp(1.8rem, 3.5vw, 3rem)

SECTION SUBTITLE (body):
  Font: Inter 400
  Color: --text-muted
  Max-width: 65ch (65 characters)
  Line-height: 1.7
```

#### Animations (Principles)
1. **Subtle by default** — animations should be barely noticeable on purpose
2. **Purposeful** — every animation communicates something (loading, arrival, emphasis)
3. **Fast** — 200ms–400ms for micro-interactions; 600ms–900ms for entrance animations
4. **Staggered entrances** — cards animate in sequence, not all at once
5. **Non-distracting** — animations stop after completing; no infinite loops on content
6. **Respect `prefers-reduced-motion`** — all animations must be wrapped:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
   ```
7. **Performance** — use `transform` and `opacity` ONLY. Never animate `height`, `width`, `margin`, or `padding`.

#### Icon Style
- Use inline SVG or a single icon library (suggest: Lucide Icons or Heroicons)
- Stroke-based icons at 1.5px–2px strokeWidth
- Size: 20px default, 24px for emphasis, 16px for compact
- Color: inherit from parent (never hardcode icon color)
- `aria-hidden="true"` on decorative icons

---

## PART C — ARCHITECTURE

### C.1 — Current Architecture (Reality)

```
frontend/
├── src/
│   ├── App.jsx              ← Single-page shell (NO ROUTING)
│   ├── App.css              ← All styles monolithic (needs refactoring)
│   ├── index.css            ← Base resets
│   ├── main.jsx             ← Vite entry
│   ├── assets/
│   │   ├── logo.png         ← Placeholder logo (3KB)
│   │   ├── hero.png         ← Unused asset
│   │   ├── react.svg        ← Default scaffold (remove)
│   │   └── vite.svg         ← Default scaffold (remove)
│   ├── components/
│   │   ├── navbar.jsx       ← Global nav (uses plain <a> tags)
│   │   ├── hero.jsx         ← Home hero (wrong copy)
│   │   ├── StatsStrip.jsx   ← Animated stats (hardcoded)
│   │   ├── Terminal3D.jsx   ← Terminal animation (good)
│   │   ├── footer.jsx       ← Global footer (placeholder URLs)
│   │   ├── footer.css       ← Footer-specific styles
│   │   └── StatsStrip.css   ← Stats-specific styles
│   └── features/
│       ├── About-US/        ← Misnamed; empty component folders
│       │   ├── About/components/    ← EMPTY
│       │   ├── Members/components/  ← EMPTY
│       │   └── contacts/            ← EMPTY
│       └── Community/       ← EMPTY
```

---

### C.2 — Recommended Architecture (Target for All Phases)

```
frontend/
├── .env                         ← VITE_API_BASE_URL=http://localhost:8000
├── index.html                   ← Meta tags, Google Fonts import
├── vite.config.js               ← Proxy config for /api → backend
├── src/
│   ├── main.jsx                 ← Entry + StrictMode + BrowserRouter
│   ├── App.jsx                  ← Routes only (no layout logic)
│   ├── index.css                ← Base reset only
│   │
│   ├── styles/
│   │   ├── variables.css        ← ALL CSS custom properties (extracted from App.css)
│   │   ├── typography.css       ← Font imports + type scale
│   │   ├── animations.css       ← Keyframes + animation utilities
│   │   ├── utilities.css        ← Shared utility classes
│   │   └── components.css       ← Shared component base styles
│   │
│   ├── layouts/
│   │   └── PublicLayout.jsx     ← Navbar + <Outlet /> + Footer wrapper
│   │
│   ├── components/              ← GLOBAL reusable UI components only
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.css
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── PageHero.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   └── Modal.jsx
│   │   └── cards/
│   │       ├── ProjectCard.jsx
│   │       ├── BlogCard.jsx
│   │       ├── ResearchCard.jsx
│   │       ├── EventCard.jsx
│   │       ├── MemberCard.jsx
│   │       ├── SubgroupCard.jsx
│   │       └── ResourceCard.jsx
│   │
│   ├── services/                ← API communication layer
│   │   ├── api.js               ← Base fetch/axios config + base URL
│   │   ├── projects.js          ← GET /projects, GET /projects/:id
│   │   ├── research.js          ← GET /research, GET /research/:id
│   │   ├── blog.js              ← GET /blog-posts, GET /blog-posts/:id
│   │   ├── events.js            ← GET /events, GET /events/:id
│   │   ├── resources.js         ← GET /resources
│   │   ├── members.js           ← GET /member
│   │   ├── subgroups.js         ← GET /sub_groups, GET /sub_groups/:id
│   │   ├── applications.js      ← POST /application
│   │   ├── contact.js           ← POST /News (contact messages)
│   │   └── auth.js              ← POST /login, GET /users/me
│   │
│   ├── context/                 ← React Context providers
│   │   ├── AuthContext.jsx      ← JWT token, user state, roles
│   │   └── ThemeContext.jsx     ← Dark/light (extract from App.jsx)
│   │
│   └── features/                ← Feature folders (one per page area)
│       ├── home/
│       │   ├── HomePage.jsx
│       │   └── components/
│       │       ├── HeroSection.jsx    (refactored from hero.jsx)
│       │       ├── Terminal3D.jsx     (moved from global components)
│       │       ├── StatsStrip.jsx     (moved, API-connected)
│       │       ├── SubgroupsPreview.jsx
│       │       ├── ProjectsPreview.jsx
│       │       ├── ResearchPreview.jsx
│       │       ├── EventsPreview.jsx
│       │       ├── BlogPreview.jsx
│       │       └── HomeCallToAction.jsx
│       ├── about/
│       │   ├── AboutPage.jsx
│       │   └── components/
│       │       ├── MissionSection.jsx
│       │       ├── Timeline.jsx
│       │       └── LeadershipGrid.jsx
│       ├── projects/
│       │   ├── ProjectsPage.jsx
│       │   ├── ProjectDetailPage.jsx
│       │   └── components/
│       ├── research/
│       │   ├── ResearchPage.jsx
│       │   ├── ResearchDetailPage.jsx
│       │   └── components/
│       ├── blog/
│       │   ├── BlogPage.jsx
│       │   ├── BlogPostPage.jsx
│       │   └── components/
│       ├── events/
│       │   ├── EventsPage.jsx
│       │   ├── EventDetailPage.jsx
│       │   └── components/
│       ├── resources/
│       │   ├── ResourcesPage.jsx
│       │   └── components/
│       ├── subgroups/
│       │   ├── SubgroupsPage.jsx
│       │   ├── SubgroupDetailPage.jsx
│       │   └── components/
│       ├── members/
│       │   ├── MembersPage.jsx
│       │   ├── MemberProfilePage.jsx
│       │   └── components/
│       ├── join/
│       │   ├── JoinPage.jsx
│       │   └── components/
│       │       └── ApplicationForm.jsx
│       ├── contact/
│       │   ├── ContactPage.jsx
│       │   └── components/
│       │       └── ContactForm.jsx
│       └── auth/
│           ├── LoginPage.jsx
│           ├── OnboardingPage.jsx
│           ├── ForgotPasswordPage.jsx
│           └── ResetPasswordPage.jsx
```

---

### C.3 — Routing Architecture

**Install:** `npm install react-router-dom`

**Router setup in main.jsx:**
```jsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

**Routes in App.jsx:**
```jsx
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'

// Feature pages (lazy loaded)
const Home = lazy(() => import('./features/home/HomePage'))
// ... etc

function App() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sub-groups" element={<SubGroups />} />
        <Route path="/sub-groups/:slug" element={<SubGroupDetail />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:slug" element={<ResearchDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberProfile />} />
        <Route path="/join" element={<Join />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Auth routes (no public layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/onboard/:token" element={<Onboarding />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

**All navbar `<a href>` tags must become `<Link to>` from react-router-dom.**

---

### C.4 — API Integration Strategy

**Backend base:** `http://localhost:8000` (development)
**Production base:** environment variable `VITE_API_BASE_URL`

#### Confirmed Public API Endpoints (No Authentication Required)

| Module | Endpoint | Method | Public? |
|---|---|---|---|
| Sub-Groups | `GET /sub_groups/` | GET | YES — no auth |
| Sub-Groups | `GET /sub_groups/{id}` | GET | YES — no auth |
| Sub-Groups | `GET /sub_groups/{id}/cover_page` | GET | YES — no auth |
| Sub-Groups | `GET /sub_groups/{id}/icon_page` | GET | YES — no auth |
| Members | `GET /member/` | GET | YES — no auth |
| Projects | `GET /projects/` | GET | YES — no auth (pagination, search, sort) |
| Projects | `GET /projects/{id}` | GET | YES — no auth |
| Projects | `GET /projects/{id}/cover` | GET | YES — no auth |
| Research | `GET /research/` | GET | YES — `get_optional_current_user` |
| Research | `GET /research/{id}` | GET | YES — `get_optional_current_user` |
| Blog Posts | `GET /blog-posts/` | GET | YES — `get_optional_current_user` |
| Blog Posts | `GET /blog-posts/{id}` | GET | YES — `get_optional_current_user` |
| Blog Posts | `GET /blog-posts/{id}/cover` | GET | YES — no auth |
| Events | `GET /events/` | GET | YES — `get_optional_current_user` |
| Events | `GET /events/{id}` | GET | YES — no auth |
| Events | `GET /events/{id}/cover` | GET | YES — no auth |
| Resources | `GET /resources/` | GET | YES — `get_optional_current_user` |
| Resources | `GET /resources/{id}` | GET | YES — `get_optional_current_user` |
| News | `GET /News/` | GET | YES — `get_optional_current_user` |
| News | `GET /News/{id}` | GET | YES — `get_optional_current_user` |
| Categories | `GET /categories/` | GET | YES — check (likely public) |
| Application | `POST /application/` | POST | YES — no auth (public submission) |
| Application | `POST /application/onboarding` | POST | YES — no auth (token verified internally) |
| Auth | `POST /login` | POST | YES — no auth |
| Auth | `POST /password-reset/request` | POST | YES — no auth |
| Auth | `POST /password-reset/confirm` | POST | YES — no auth |

#### Contact / News Gap Discovered
> **⚠️ IMPORTANT:** The backend has NO dedicated `/contact` endpoint. Contact form submissions go to `POST /News/` — this is the "News" router used for contact messages. This naming is misleading. The frontend `contact.js` service should post to `/News/` but label it semantically as a contact message.

#### Static File Serving
- Uploaded files are served from: `http://localhost:8000/uploads/...`
- This path is referenced in Media records returned by the API
- Frontend must prepend the base URL to construct image URLs

#### API Service Pattern (to implement in Phase 3)
```js
// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('auth_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
```

---

### C.5 — Navbar Architecture Decision

**Current:** 6 nav groups (some with dropdowns) using plain `<a>` tags
**Target:** Same grouped structure but with React Router `<Link>` tags and active detection

**KEEP the grouped approach** — 11 flat links is too much visual noise on desktop. The current grouping is:
```
Home | About ▾ | Members | Contact | Initiatives ▾ | Community ▾ | [Join Us] [Theme]
```

**Recommended refined grouping:**
```
Home | About ▾ | Initiatives ▾ | Community ▾ | Members | Join Us (as link, not just CTA button)
Contact is moved to footer — less prominent navigation
```

Or alternatively (cleaner):
```
Home | About ▾ | Research | Projects | Community ▾ | Members | [Join Us] [Theme ☀️]

About dropdown: Mission, Leadership, Sub-Groups, Contact
Community dropdown: Events, Blog, Resources
```

> **Decision Note:** The current nav structure is reasonable. Do NOT redesign it completely. The refinement of grouping will happen as React Router links are added in Phase 3.

---

## PART D — UX STRATEGY (PAGE-BY-PAGE)

### Home
Impression: Landing for first-time visitors. Must answer "Who are you?" in 5 seconds.
Flow: Hero → Stats → Brief Who We Are → Research preview → Subgroups → Projects → Events/Blog → CTA
Key UX: Animation should guide eye downward. Stats counter triggers on scroll. Cards animate in from below.

### About
Impression: Trust and legitimacy. This is where funders and faculty check credentials.
Flow: Hero → Mission → Vision → Values → Timeline (our story) → Leadership team → MUST affiliation → CTA
Key UX: Leadership photos must be real. Timeline must feel genuine. Avoid over-designed.

### Sub-Groups
Impression: "Here is where the work happens." Entry point for prospective members.
Flow: Hero → Grid of 7 subgroup cards → Detail page for each
Key UX: Subgroup cards must be scannable in 2 seconds each. Icon + name + 2-line description. Click through.

### Research
Impression: Academic credibility. Speaks to faculty, funders, external researchers.
Flow: Hero → Research mission → Active lines → Publications list → Collaboration CTA
Key UX: Must look like a real research group page. Citations, authors, dates matter. Dense but organized.

### Projects
Impression: "We build real things." Best portfolio entry point for external orgs.
Flow: Hero → Filter bar (subgroup + tech + status) → Project grid → Project detail
Key UX: Filter is essential. Status labels (ongoing vs completed) are important. GitHub links prominent.

### Events
Impression: Active, vibrant community. Not stagnant.
Flow: Upcoming → Past archive. Optional calendar toggle.
Key UX: Upcoming events above fold. Past events collapsed by default. Photo galleries in detail pages.

### Blog / News
Impression: Thought leadership. Real member voices.
Flow: Featured post → Grid of posts → Category filters → Post detail with author box
Key UX: Author attribution is important — makes members feel valued. Categories easy to switch.

### Resources
Impression: Generosity. The Hub shares knowledge freely.
Flow: Category tabs (Courses | Datasets | Tools | Reading | Slides) → Cards with type + download
Key UX: Quick scan + download. Search is important here.

### Members
Impression: Real people behind the work.
Flow: Search/filter by subgroup → Member card grid → Profile page (if show_profile=true)
Key UX: Privacy respected. No private email shown. LinkedIn/GitHub prominent.

### Join Us
Impression: Clear, welcoming, no friction.
Flow: Why join → Who can join → How it works (numbered steps) → Form → FAQ
Key UX: Form must be simple and reassuring. Progress through numbered steps. No jargon.

### Contact
Impression: Accessible, responsive, professional.
Flow: Two columns: form on left, info on right. Map below.
Key UX: Form with validation and success state. Clear email. No "we'll get back to you in 2-4 business days" copy.

---

## PART E — ISSUES REGISTRY

| # | Issue | Severity | Location | Problem | Recommended Solution |
|---|---|---|---|---|---|
| 1 | Hero headline wrong | HIGH | `hero.jsx` line 4 | "IGNITE YOUR AI JOURNEY" is not the brand tagline | Change WORDS array to Hub identity phrase |
| 2 | Hero CTA labels wrong | HIGH | `hero.jsx` lines 48–52 | "Join Us" / "View Work" don't match spec | Change to "Explore Research" / "Join the Hub" |
| 3 | No react-router-dom | CRITICAL | `package.json` | No routing means no pages can exist | `npm install react-router-dom` before Phase 3 |
| 4 | No .env file (frontend) | HIGH | `frontend/` root | API base URL is not configurable | Create `frontend/.env` with `VITE_API_BASE_URL` |
| 5 | Wrong fonts | HIGH | `App.css` line 20 | Segoe UI / system-ui — not spec fonts | Import Montserrat + Inter, update `--font-sans` → split into `--font-heading` + `--font-body` |
| 6 | Navbar uses `<a href>` | HIGH | `navbar.jsx` | Native anchor tags cause full page reloads | Replace with `<Link to>` from react-router-dom |
| 7 | No active nav state | MEDIUM | `navbar.jsx` | No visual indicator for current page | Use `useLocation()` and compare to current path |
| 8 | Dropdown: no close-on-outside-click | MEDIUM | `navbar.jsx` | Clicking elsewhere doesn't close dropdown | Add `useRef` + `useEffect` click-outside handler |
| 9 | Hardcoded stats | HIGH | `StatsStrip.jsx` | 250+, 7+, 200+, 45+ — fake data | Connect to `GET /member`, `/sub_groups`, `/projects`, `/research` |
| 10 | Footer social links broken | MEDIUM | `footer.jsx` | All href="#" — broken | Replace when club supplies URLs; for now add `rel="noopener"` and `target="_blank"` |
| 11 | No contact endpoint in backend | MEDIUM | Backend analysis | `/contact` route doesn't exist — contact goes to `/News/` | Frontend contact service must `POST /News/` — document this clearly |
| 12 | Empty features folders | MEDIUM | `features/` | `About/components/` etc are empty | Fill in Phase 3 with actual components |
| 13 | Features folder misnamed | LOW | `features/About-US/` | Inconsistent naming convention | Rename to lowercase kebab in Phase 3 refactor |
| 14 | CSS is monolithic | MEDIUM | `App.css` (931 lines) | All styles in one file — hard to maintain | Refactor into `styles/` subdirectory in Phase 3 |
| 15 | No `<Suspense>` / lazy loading | MEDIUM | `App.jsx` | All components loaded at once | Add `React.lazy()` + `<Suspense>` when routing is added |
| 16 | logo.png is 3KB | MEDIUM | `assets/logo.png` | Tiny — likely a placeholder | Request real logo from club; use as-is until then |
| 17 | hero.png unused | LOW | `assets/hero.png` | Asset exists but not referenced | Review — use in hero background or remove |
| 18 | react.svg / vite.svg | LOW | `assets/` | Default Vite scaffold files | Remove in cleanup pass |
| 19 | Mobile nav "Join Us" hidden | MEDIUM | `App.css` line 900 | `.btn-join-nav { display: none }` at mobile | Either show compact version or embed in hamburger menu |
| 20 | AI chat preview is broken | LOW | `hero.jsx` line 84–94 | Input does nothing; hardcoded bot message | Remove non-functional stub or add "Coming Soon" badge; never ship broken UI |
| 21 | ThemeContext not extracted | LOW | `App.jsx` | Dark/light state lives in App.jsx — not scalable | Extract to `ThemeContext.jsx` before pages need it |
| 22 | No CORS proxy in vite.config.js | MEDIUM | `vite.config.js` | Unclear if proxy is set for /api | Review vite.config.js; add proxy to avoid CORS in dev |
| 23 | Member `GET /member/{id}` requires admin | MEDIUM | Backend `MemberRouter.py` line 78 | `ReturnSingle` requires `admin_required` — member profile pages cannot show individual members by ID without auth | Need backend check: should public member profile lookup work? |
| 24 | No contact-specific backend route | MEDIUM | Backend analysis | Contact form has no dedicated `/contact` endpoint | Use `/News/` as workaround and document clearly |

---

## PART F — GLOBAL COMPONENT LIST (WHAT TO BUILD)

### Phase 3 — Foundation Components (Must Build First)
```
LAYOUT:
□ PublicLayout.jsx      — Navbar + <Outlet> + Footer wrapper
□ Navbar.jsx            — Refactored with <Link>, active states, click-outside
□ Footer.jsx            — Existing footer wired with real URLs
□ Button.jsx            — Primary, secondary, ghost, pill, loading variants
□ SectionHeader.jsx     — Label + Title + Subtitle + optional CTA
□ PageHero.jsx          — Reusable hero banner for inner pages (NOT home hero)

STATES:
□ LoadingState.jsx      — Spinner + message
□ EmptyState.jsx        — Icon + heading + message + optional CTA
□ ErrorState.jsx        — Error icon + message + retry button

FORMS:
□ ApplicationForm.jsx   — Join Us application → POST /application/
□ ContactForm.jsx       — Contact → POST /News/

AUTH:
□ LoginPage.jsx         — Form → POST /login
□ OnboardingPage.jsx    — Invitation token registration
□ ForgotPasswordPage.jsx
□ ResetPasswordPage.jsx
```

### Phase 4 — Content Cards
```
□ ProjectCard.jsx       — thumbnail, title, subgroup, tags, status
□ SubgroupCard.jsx      — icon, name, description, count, CTA
```

### Phase 5 — Research Cards
```
□ ResearchCard.jsx      — title, authors, date, abstract excerpt, PDF link
□ ResourceCard.jsx      — type icon, title, description, download/link
```

### Phase 6 — Community Cards
```
□ BlogCard.jsx          — image, title, excerpt, author, date, categories
□ EventCard.jsx         — date, title, location, status, registration
```

### Phase 7 — Member Cards
```
□ MemberCard.jsx        — photo, name, subgroup, role, social links
□ Pagination.jsx        — page navigation with prev/next + page numbers
□ SearchBar.jsx         — input + clear + search icon
□ FilterBar.jsx         — tag/chip based filtering
□ Breadcrumb.jsx        — path navigation
```

### Phase 8–9 — Profile Components
```
□ EditorProfileCard.jsx
□ MemberProfileCard.jsx
□ Timeline.jsx          — For About page story
```

---

## PART G — PHASE 1 VERDICT

### ✅ READY FOR PHASE 2

The existing frontend is a solid starting point, not a mess. The Terminal3D concept is on-brand and already works. The color system is already aligned with the approved brand palette. The dark/light theme system works. The footer and navbar are structurally sound.

**However, before Phase 3 implementation begins, the following MUST be done:**

1. Install `react-router-dom`
2. Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:8000`
3. Import Montserrat + Inter fonts
4. Update `--font-sans` → `--font-heading` + `--font-body` in CSS variables

These are preparation steps, not Phase 3 implementation. They are foundational for all pages.

**Phase 2 goal:** Study external reference websites and extract design principles that complement the existing visual language. Then we begin building in Phase 3 with a fully established design system.

---

*This document defines the design system, architecture, and standards for all 10 build phases.*
*Every component, page, and decision in Phases 3–10 must comply with this document.*
*If a conflict arises between this document and Phase 0, this document takes precedence (it is more specific).*
