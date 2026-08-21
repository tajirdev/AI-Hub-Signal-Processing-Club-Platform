# AI Hub & Signal Processing Club — Frontend README

**Project:** AI Hub & Signal Processing Club Website (Mbeya University of Science and Technology)
**Scope of this document:** Frontend pages, routes, and features only. For backend/API details, see the backend module issue drafts (Projects, Resources, Blog Posts, Members, Events, Research, File Storage Service).

---

## 1. Overview

The frontend is the public-facing website plus an authenticated admin area for a 150+ member student club with 7 technical sub-groups. It must:

- Present the club as a credible, research-grade organization ("AI for Good" positioning) to students, faculty, and external funders/partners.
- Let prospective members discover sub-groups and apply online.
- Publish dynamic content (blog, events, projects, research) that non-technical student leaders can manage without developer help.
- Surface a site-wide AI Assistant (RAG chatbot) as both a support tool and a proof-of-capability feature.
- Work well on low-end Android phones over 3G/4G, since most traffic is mobile.

## 2. Frontend Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework |  React + javascript | SSR/SSG for SEO and fast first load |
| Styling | Tailwind CSS + css | Themeable to club branding |
| Data source | FastAPI backend via REST | All content is API-driven, no hardcoded page content |
| Admin app | Separate authenticated React/Next.js app (or an admin section of the main frontend), optionally bootstrapped from SQLAdmin/FastAPI-Admin | Talks to FastAPI via REST/GraphQL — not server-rendered templates |
| Hosting | Vercel or Netlify | CDN-delivered, integrates with the separately hosted FastAPI backend |
| Auth (frontend side) | JWT/OAuth2 issued by FastAPI (`fastapi-users`) | Covers admin login and any future member login area |

## 3. Sitemap / Primary Navigation

Top nav (11 primary items):

1. Home
2. About
3. Sub-Groups
4. Research
5. Projects
6. Events
7. Blog / News
8. Resources
9. Members
10. Join Us
11. Contact

Plus a site-wide floating **AI Assistant** launcher present on every page (not a nav item).

## 4. Page-by-Page Breakdown

### 4.1 Home Page
- **Hero:** club name, "AI for Good" tagline, hero image/short video/animation, primary CTAs — "Join the Club", "View Projects".
- Hero includes a prompt nudging visitors to the AI Assistant (e.g. "Ask our AI Assistant about the club").
- **Quick stats strip:** member count, sub-group count, completed project count, publication count, founding year.
- **Sub-groups preview grid:** icon + short description per sub-group, links to sub-group detail pages.
- **Featured/recent projects carousel or grid:** 3–6 items.
- **Upcoming events list:** next 3 events, pulled dynamically from the Events module.
- **Latest blog posts:** 3 most recent, pulled dynamically.
- **Partner/affiliate logos strip:** MUST logo + sponsors/partners.
- **Newsletter signup:** email capture.
- **Footer:** quick links, social icons (LinkedIn, X, Instagram, GitHub), contact email, copyright.

### 4.2 About Page
- Mission & vision statement.
- Club history/timeline (founding + milestones).
- Leadership team section: Coordinator, sub-group leads, Research Team lead/PI, faculty advisor — each with photo, name, role, short bio, optional LinkedIn link.
- Affiliation statement: MUST, Dept. of Electronics & Telecommunication Engineering / Faculty of Computing and Information Technology.

### 4.3 Sub-Groups Pages
- **Overview page:** grid/card layout of all 7 sub-groups (icon, name, 1–2 line description).
- **Sub-group detail page** (template × 7): full description, focus areas, lead(s), member count, related projects (auto-pulled by tag), related blog posts, "Join this group" CTA.

### 4.4 Research Page
- Positions the club as an academic/research body, distinct from Sub-Groups and Projects.
- **Overview:** Research Team mission, current research lines (e.g. AI for health surveillance, AMR surveillance, NLP for low-resource languages like Bena and Nyakyusa, signal processing applications), lead researchers/PI.
- **Publications & outputs list:** title, authors, venue/date, abstract, link (DOI/PDF/GitHub) per entry.
- **Active grants/collaborations section:** partner institutions, funding bodies (public-safe/high-level), research focus areas.
- **Call-to-collaborate section:** how external researchers/students propose collaboration or join the team.
- **Research detail page template:** full abstract, methodology summary, team/authors, related projects, downloadable PDF, citation block.

### 4.5 Projects Page
- Grid/list view: thumbnail, title, sub-group tag, technology tags, status (ongoing/completed).
- Filter/search by sub-group and technology tag.
- **Project detail page:** description, problem statement, technologies used, team members, images/screenshots, links (GitHub, demo, paper/report), outcomes/results.
- Content types it must support: IEEE Myron Zucker water-quality monitoring entry, GSoC/DIPY contributions, hackathon projects.

### 4.6 Events Page
- Upcoming events list: date, time, location (physical/online), short description, registration link/button (can point to a Google Form initially).
- Past events archive: recap text, photo gallery, outcomes.
- Optional month-grid calendar view alongside the list view.
- **Event detail page template:** full description, agenda, speakers, photo gallery, downloadable resources.

### 4.7 Blog / News
- List view: featured image, title, excerpt, author, date, category/tag.
- Categories: News, Tutorials, Research, Event Recaps, Member Spotlights.
- **Post detail page:** rich text content, images, embedded code blocks (for tutorials), author bio box, related posts, share buttons (incl. LinkedIn).
- Comments: optional simple moderated box, can be disabled in v1.

### 4.8 Resources
- Categorized list: course links, datasets, tools, recommended reading, slide decks/PDFs.
- Supports both uploaded files (PDF/PPTX) and external links.

### 4.9 Members Directory
- Opt-in public profile grid: photo, name, sub-group, role, optional links (GitHub, LinkedIn).
- Filter by sub-group.
- Opt-in consent required at signup (personal student data).

### 4.10 Join Us
- Online application form fields: name, registration/student number, programme of study, year of study, email, phone, preferred sub-group, motivation statement, how they heard about the club.
- Submissions go to the admin dashboard and auto-email the coordinator.
- FAQ section: eligibility, meeting schedule, costs, expectations.

### 4.11 Contact
- Contact form: name, email, subject, message — with spam protection (reCAPTCHA/honeypot).
- Direct email + social links.
- Embedded map of MUST campus, Mbeya.

## 5. Secondary / Utility Pages

- Sub-group detail pages (×7, reused template).
- Research line / publication detail page (template).
- Project detail page (template).
- Blog post detail page (template).
- Event detail page (template, with RSVP where applicable).
- Site-wide AI Assistant widget (floating launcher, every page — not a standalone route).
- 404 / Not Found page.
- Privacy Policy & Terms (required since Join Us and Contact collect personal data).
- Admin login (not in public nav).

**Explicitly not built in v1:** real-time chat/community platform (Slack/Discord/WhatsApp links used instead), full UI localization beyond English (Swahili content can exist as blog posts only).

## 6. AI Assistant (Chatbot) Widget — Frontend Responsibilities

- Floating launcher, bottom-right, on every page; expands into a chat panel.
- Must be fully usable on mobile.
- Loads asynchronously and must never block core page rendering/performance.
- Always displays a disclaimer that responses are AI-generated.
- Always offers an escalation path ("Still need help? Contact us") linking to the Contact page/email.
- Guided Q&A mode to help prospective members pick a sub-group.
- Answers grounded in site content only (About, Sub-Groups, Research, Projects, Events, Resources, FAQ) via a backend RAG pipeline — frontend just renders the conversation and surfaces any content links returned (projects, posts, publications, resources).

## 7. Content Management (Frontend-Facing Admin)

- Role-based accounts: **Super Admin** (coordinator), **Editor** (sub-group leads), **Contributor** (members drafting posts for approval).
- Admin UI needs CRUD screens for: Blog posts, Events, Projects, Research publications/lines, Sub-groups, Members directory entries, Resources, Home page featured content, and Join Us/Contact submissions.
- Rich text editor with image upload, embedded links, code-block support.
- Media library for images/files.
- Draft / Publish / Schedule workflow for posts and events.
- Analytics view (can embed Google Analytics rather than building custom).
- Permissions are enforced at the API level, but the admin UI should also hide actions a role can't perform.

## 8. Design & Branding Direction

**Theme: "AI for Good"** — real impact in Tanzania/East Africa (health/AMR surveillance, water quality, low-resource-language NLP, education), not abstract sci-fi AI imagery.

- Use real member/community photos and real project screenshots — avoid generic robot/glowing-brain/matrix stock imagery.
- Subtle tech motifs allowed as background texture: signal waveforms, neural-network node patterns, circuit-trace lines — accents only, not dominant.
- Dark-mode-friendly, high-contrast "deep tech" palette: deep navy/charcoal base + one vivid accent (electric blue, teal, or amber), incorporating MUST's institutional colors.
- Generous white space, large confident typography, tasteful scroll micro-interactions/animations.
- Research and Projects sections get extra visual weight (clean data visualizations, publication-style layouts) — these are the strongest credibility signals for funders/partners.
- A style guide (colors, fonts, logo usage, button styles, iconography) is a required deliverable so future content stays consistent.
- Brand assets (logo, LinkedIn banner/branding) are supplied by the club before design begins.

## 9. Non-Functional Requirements (Frontend-Relevant)

- **Performance:** pages load under 3 seconds on typical 3G/4G in Tanzania; images optimized and lazy-loaded.
- **Mobile-first:** majority of traffic is mobile — design and test mobile-first.
- **Accessibility:** WCAG 2.1 AA effort — alt text, color contrast, keyboard navigation.
- **SEO:** clean URLs, meta tags, `sitemap.xml`, `robots.txt`, Open Graph tags (especially for LinkedIn sharing); use SSR/SSG, not pure client-side rendering, so content is crawlable.
- **Security (frontend-facing):** HTTPS by default, validated form inputs, spam protection on public forms.
- **Low-bandwidth resilience:** avoid unnecessarily heavy assets; keep a lightweight experience for limited data plans.
- **Browser support:** latest 2 versions of Chrome, Safari, Firefox, Edge, plus mobile Chrome/Safari.

## 10. Frontend-Relevant Integrations

| Integration | Purpose |
|---|---|
| LinkedIn | Cross-links + "share to LinkedIn" buttons on blog/event posts |
| Google Analytics / Plausible | Traffic and engagement tracking |
| Google Forms (fallback) | Join Us / RSVP if native forms are deprioritized in v1 |
| GitHub | Links to club/member open-source repos and project code |
| AI Chatbot Engine | RAG-grounded chat widget (see Section 6) |
| Google Maps | Embedded campus location on Contact page |
| reCAPTCHA / hCaptcha | Spam protection on public forms |

## 11. Acceptance Criteria (Frontend Scope)

- All pages in Section 3 exist and are reachable from primary navigation.
- Join Us, Contact, and Newsletter forms submit successfully and notify the coordinator by email.
- Google PageSpeed/Lighthouse: 80+ mobile performance, 90+ accessibility/SEO/best practices (some flexibility for image-heavy pages).
- Admin can independently create/edit/delete a blog post, event, project, and research entry — verified via live walkthrough.
- AI Assistant is live site-wide and answers the core FAQ set (joining process, sub-groups, events, contact) without fabricating information.
- Site is fully usable on a mid-range Android phone over 4G.

---

*Source: AI Hub & Signal Processing Club — MUST Website Development Brief, v1.0, June 2026. Document owner: Beatrice Alan Elias (beatriceelias009@gmail.com).*
