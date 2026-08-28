# PHASE 0 — MASTER REFERENCE DOCUMENT
# AI Hub & Signal Processing Club — Frontend

> **Status:** PERMANENT REFERENCE — Read before starting any phase
> **Created:** August 24, 2026
> **Source:** Phase 0 study of all documentation + existing codebase
> **Rule:** This document is the single source of truth for all 10 build phases.

---

## SECTION 1 — ORGANIZATION IDENTITY

| Field | Value |
|---|---|
| **Organization Name** | AI Hub & Signal Processing Club |
| **University** | Mbeya University of Science and Technology (MUST) |
| **Department** | Electronics and Telecommunication Engineering / Faculty of Computing and IT |
| **Location** | Mbeya, Tanzania |
| **Club Coordinator** | Jofrey Nasson Msengi |
| **Project Contact** | Beatrice Alan Elias — beatriceelias009@gmail.com — 0612772558 |
| **Design Overseer** | Prudence Revelian |
| **Member Count** | 150+ students |
| **Subgroups** | 7 technical subgroups |

### Core Mission Statement
> **"AI for Good"** — applying AI and Signal Processing to real-world problems in Tanzania and East Africa.

Focus areas:
- Health / AMR (Antimicrobial Resistance) surveillance
- Water quality monitoring
- NLP for low-resource languages (Bena, Nyakyusa)
- Education technology
- Signal processing applications

### The Five Questions Every Page Must Help Answer
1. Who are you?
2. What do you research?
3. What are you building?
4. Who is involved?
5. How can I work with you?

> If a visitor cannot answer these within a few minutes, **the design has failed.**

---

## SECTION 2 — TECHNOLOGY STACK (FIXED — DO NOT CHANGE)

### Backend (ALREADY BUILT — DO NOT REWRITE)
| Technology | Purpose |
|---|---|
| Python | Language |
| FastAPI | Web framework |
| PostgreSQL | Database |
| SQLAlchemy ORM | Database access |
| Alembic | Migrations |
| JWT (OAuth2 password flow) | Authentication |
| Pydantic | Schema validation |
| RoleChecker | Authorization |
| Docker + Docker Compose | Infrastructure |

### Frontend (To Be Built)
| Technology | Purpose |
|---|---|
| React + JavaScript | UI framework |
| Vite | Build tool / bundler |
| Tailwind CSS + custom CSS | Styling |
| React Router (react-router-dom) | Client-side routing |
| Custom fetch / axios | API calls to backend |

> **Rule:** Do NOT introduce additional technologies without a clear, documented reason.

---

## SECTION 3 — BRAND IDENTITY (APPROVED & CONFIRMED)

### 3.1 Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| **Primary** | Deep Navy | `#0A2472` | Navigation, headings, hero bg, footer, major backgrounds, brand elements |
| **Secondary** | Golden Amber | `#FFBA08` | Buttons, highlights, icons, statistics, lines, CTAs, hover states |
| **Support** | White | `#FFFFFF` | Clean backgrounds, readable content areas |
| **Support** | Light Gray | `#F5F7FA` | Section backgrounds, cards |
| **Support** | Dark Text | `#111827` | Body text |

**CSS Variables (already in App.css — correct):**
```css
--navy: #0a2472;
--accent: #ffba08;
--accent-hover: #e9a900;
--accent-soft: #fff4cc;
--navy-soft: #173b97;
--navy-deep: #071c52;
--bg: #fafafa;
--text: #1a1a1a;
```

**Dark Mode CSS Variables (already in App.css):**
```css
.app-shell.theme-dark {
  --bg: #071225;
  --text: #edf4ff;
  --surface: #0d1b30;
  --surface-alt: #132741;
  --header-bg: rgba(9, 17, 29, 0.9);
}
```

> **Critical rule:** Supporting colors must NEVER compete with Deep Navy + Golden Amber identity.

### 3.2 Typography System

| Use | Font Options |
|---|---|
| **Primary Headings** | Montserrat / Space Grotesk |
| **Body Text** | Inter / Roboto |

**Typography Hierarchy:**
- Page titles (H1)
- Section headings (H2)
- Subheadings (H3)
- Body content (p)
- Captions
- Buttons
- Navigation

> **Current state:** App.css uses `'Segoe UI', system-ui` — needs update to spec fonts in Phase 1/3.

### 3.3 Visual Design Language

**DO use:**
- Real member/community photos and real project screenshots
- Subtle tech motifs as accents only: signal waveforms, neural-network nodes, data visualization, digital grids, frequency graphs, circuit-trace lines, connected nodes
- Generous white space
- Large confident typography
- Smooth micro-interactions/animations on scroll
- Dark-mode-friendly deep tech palette
- Clean data visualizations in Research/Projects sections

**DO NOT use:**
- Generic robot/glowing-brain/matrix stock imagery
- Excessive AI graphics to "prove" it's an AI org
- Heavy overloaded visuals
- Filler animations that slow performance

### 3.4 Design Quality Standards
- Visual consistency across every single page
- No unfinished pages, placeholder text, broken links, inconsistent fonts, or low-quality images on the public site
- Professionalism is mandatory, not optional

---

## SECTION 4 — USER ROLES & ARCHITECTURE

### 4.1 Four Roles
```
super_admin   → full platform control
editor        → content management (blog, projects, research)
member        → hub membership and participation
user          → platform account identity (floating role, needs support role)
```

### 4.2 Critical Distinction: User ≠ Member
```
User account  = identity (platform login)
Member record = Hub membership

These are SEPARATE database tables.
A user can exist WITHOUT a member record.
Never confuse or merge these concepts.
```

### 4.3 Role Architecture
```
Users  ←many-to-many→  Roles
         (UserRoles junction table)
```
A user can have multiple roles simultaneously.
`super_admin` always bypasses all role checks.

### 4.4 What Each Role Can Do

**Visitor (unauthenticated):**
- View public website
- Read public content
- Submit contact form
- Submit Join Us application

**User (authenticated, no other role):**
- Access their own account
- Cannot do much without additional roles

**Member (user + member role):**
- Access member functionality
- Have a subgroup
- Have a member profile

**Editor (user + editor role):**
- Manage authorized content: blog posts, projects, research

**Super Admin (user + super_admin role):**
- Manage users, roles, applications, members, subgroup leadership
- Manage all platform content
- Administrative operations

### 4.5 Subgroup Leadership (Separate Concept)
```
SubGroup.lead_id = Member.id

This is NOT the same as having editor role.
A subgroup leader also needs editor role (assigned separately by super_admin).
```

---

## SECTION 5 — MEMBERSHIP LIFECYCLE (CRITICAL FLOW)

```
Step 1: Visitor submits application
        Fields: first_name, last_name, registration_number, programme, year, email, phone, motivation
        NO subgroup selection at this stage
        API: POST /applications  (public, no auth)
        Result: Application.status = pending

Step 2: Super Admin reviews
        API: PATCH /applications/{id}
        Result: status → approved OR rejected

Step 3: If approved → system sends invitation email with secure token
        Token properties: expires_at, used_at, token_hash
        Never send passwords in email

Step 4: Applicant clicks link → Complete Registration form
        Fields: username, password, confirm password, profile info, GitHub, LinkedIn, portfolio
        + Choose subgroup (first time this appears)
        Backend verifies: invitation exists, not expired, not used, application approved, subgroup exists
        Result: Users record + UserRoles (member) + Members record

Step 5: Admin optionally promotes
        → Assign editor role via UserRoles
        → Assign SubGroup.lead_id for subgroup leadership
        These are TWO separate actions, not one.
```

---

## SECTION 6 — DATABASE ENTITIES (BACKEND — READ ONLY)

```
Users              → platform accounts
Roles              → role definitions
UserRoles          → user-role junction (many-to-many)
Members            → hub membership records
SubGroups          → technical subgroups (has lead_id)
Projects           → hub projects
ProjectMembers     → project-member junction
Technologies       → tech tags
ProjectTechnologies → project-tech junction
Research           → research publications
ResearchAuthors    → research-member junction (with author_order)
BlogPosts          → blog content
Categories         → blog categories
BlogCategories     → blog-category junction
Events             → events
Resources          → learning resources (PDF, video, external links, datasets)
Applications       → membership applications
ContactMessages    → contact form submissions
Media              → uploaded files
SiteSettings       → platform configuration
ActivityLogs       → audit trail
```

### Key Field Notes
- `Members.show_profile` → if false, member is NOT shown publicly
- `SubGroups.slug` → URL-friendly identifier (e.g., "artificial-intelligence")
- `Projects.featured` → controls homepage featured section
- `BlogPosts.status` → draft | published
- `Applications.status` → pending | approved | rejected
- `Resources.type` → PDF | Presentation | Dataset | Video | External Link

---

## SECTION 7 — FULL SITE ARCHITECTURE

### 7.1 Primary Navigation (11 items)
```
1.  /               → Home
2.  /about          → About
3.  /sub-groups     → Sub-Groups (overview)
4.  /research       → Research
5.  /projects       → Projects
6.  /events         → Events
7.  /blog           → Blog / News
8.  /resources      → Resources
9.  /members        → Members Directory
10. /join           → Join Us
11. /contact        → Contact
```

### 7.2 Detail / Template Routes
```
/sub-groups/:slug      → Sub-Group detail (×7)
/research/:slug        → Research detail
/projects/:slug        → Project detail
/events/:slug          → Event detail
/blog/:slug            → Blog post detail
/members/:id           → Member profile (public, only if show_profile=true)
/profile               → Editor profile (authenticated)
```

### 7.3 Auth Routes (Not in Main Nav)
```
/login                 → Login
/onboard/:token        → Registration via invitation link
/forgot-password       → OTP/password reset request
/reset-password        → New password entry
```

### 7.4 Utility Pages
```
/privacy               → Privacy Policy
/terms                 → Terms of Service
/404                   → Not Found
```

### 7.5 Admin (Separate Protected Area)
```
/admin                 → Dashboard overview
/admin/users           → User management
/admin/applications    → Application review
/admin/members         → Member management
/admin/content/projects
/admin/content/research
/admin/content/blog
/admin/content/events
/admin/content/resources
/admin/contact         → Contact messages
```

---

## SECTION 8 — PAGE-BY-PAGE SPECIFICATIONS

### Home Page Sections (in order)
```
01: Hero
    Tagline: "AI & Signal Processing Hub — Incubator for AI Minds.
              Pioneering research, innovation and technology for real-world impact."
    CTAs: "Explore Research" (primary) | "Join the Hub" (secondary)
    AI Assistant nudge
    Background: subtle tech motifs

02: Quick Stats Strip
    Member count | Subgroup count | Project count | Publication count | Founding year
    (Connect to real API — no hardcoding)

03: About — Who We Are (brief)

04: Research — What we investigate (preview)

05: Subgroups Preview Grid
    Icon + name + 1-2 line description per subgroup
    Links to subgroup detail pages

06: Featured / Recent Projects (3-6 items, carousel or grid)

07: Impact — What difference we are making

08: Team — Who is behind the work

09: Events & News
    Upcoming events: next 3
    Latest blog posts: 3 most recent

10: Partners / Affiliates Strip
    MUST logo + sponsors/partners

11: Newsletter Signup (email capture)

12: Call to Action — Join the Hub / Collaborate With Us

13: Footer
```

### About Page Sections
```
- About Hero
- Who We Are (concise explanation)
- Mission (official statement)
- Vision (official statement)
- Our Values: Innovation, Excellence, Collaboration, Integrity, Creativity, Continuous Learning, Impact
- Our Story / Timeline: Foundation → Growth → Projects → Achievements → Future
  (Use authentic Hub photographs)
- Leadership Team: Coordinator, subgroup leads, Research lead/PI, faculty advisor
  (photo + name + role + bio + LinkedIn)
- MUST Affiliation statement
- Call to Action
```

### Join Us Page Sections
```
- Join Us Hero
- Why Join
- Who Can Join
- Benefits
- How Membership Works
- Application Form (connects to POST /applications):
    Fields: first_name, last_name, registration_number, programme, year, email, phone, motivation
    NO subgroup selection here — subgroup chosen after approval
- FAQ: eligibility, meeting schedule, costs, expectations
- CTA
```

### Contact Page Sections
```
- Contact Hero
- Contact Form: name, email, subject, message
  + Spam protection: reCAPTCHA or honeypot
- Direct email
- Social links
- Embedded Google Maps (MUST campus, Mbeya)
- Physical location / address
- QR code
- Official email CTA
- Success state
- Error state
```

### Research Page Sections
```
- Research Team mission
- Active research lines (preview cards)
  Categories: AI, Machine Learning, Signal Processing, DSP, Image Processing,
              Audio/Speech Processing, Computer Vision, Data Science, Robotics, IoT,
              Embedded Systems, AI Applications
- Publications list (title, authors, venue/date, abstract, link DOI/PDF/GitHub)
- Active grants / collaborations section
- Call-to-collaborate section
- Research detail template: abstract, methodology, team/authors, related projects,
  downloadable PDF, citation block
```

### Projects Page
```
- Grid/list view: thumbnail, title, subgroup tag, tech tags, status
- Filter by subgroup and technology tag
- Search
- Status labels: Proposed | Researching | Development | Testing | Completed
- Project detail: description, problem, technologies, team, images, GitHub/demo/paper, outcomes
- Project card structure: Title + Problem + Technology + Solution + Impact + Team
```

### Sub-Groups Pages
```
- Overview page: grid of all 7 subgroups
- Detail page (×7 template):
    Full description
    Focus areas
    Lead member (name + photo)
    Member count
    Related projects (auto-pulled by tag)
    Related blog posts
    "Join this group" CTA
```

### Blog / News
```
- List view: featured image, title, excerpt, author, date, category/tag
- Categories: News | Tutorials | Research | Event Recaps | Member Spotlights
- Post detail: rich text, images, embedded code blocks, author bio box, related posts,
  share buttons (especially LinkedIn)
- Comments: optional moderated (can be disabled in v1)
```

### Events Page
```
- Upcoming events: date, time, location (physical/online), description, registration link
- Past events archive: recap text, photo gallery, outcomes
- Optional calendar view alongside list view
- Event detail: full description, agenda, speakers, photo gallery, downloads
```

### Resources
```
- Categorized list: course links, datasets, tools, recommended reading, slide decks/PDFs
- Supports: uploaded files (PDF/PPTX) + external links
- Search and filter
```

### Members Directory
```
- Opt-in public profile grid: photo, name, subgroup, role, GitHub/LinkedIn
- Filter by subgroup
- show_profile=false members → NOT shown publicly beyond intentional minimum
- Never expose private user information through public API
```

### Editor Profile Page
```
- Profile image
- Name
- Editor | AI Hub
- Biography
- Subgroup
- GitHub | LinkedIn | Website
- Projects authored
- Research authored
- Articles / Blog posts
- All data from backend (no hardcoding)
```

### Member Profile Page (Public)
```
- Profile picture
- Name
- Position
- Subgroup
- Biography
- GitHub, LinkedIn, Portfolio (if provided)
- Projects
- Research
- Joined date
- Only visible if show_profile = true
```

---

## SECTION 9 — FORMS REQUIRED

| Form | API Endpoint | Auth Required |
|---|---|---|
| Application form | POST /applications | None (public) |
| Contact form | POST /contact | None (public) |
| Login | POST /auth/login | None |
| Onboarding registration | POST /auth/register + token | Invitation token |
| OTP/forgot password request | POST /auth/forgot-password | None |
| Change password | POST /auth/change-password | Authenticated |
| Newsletter signup | POST /newsletter or similar | None |

---

## SECTION 10 — GLOBAL COMPONENT LIBRARY

These must be built in Phase 3 and reused everywhere:

```
Layout:
  Navbar              (dropdown, hamburger, dark/light toggle, "Join Us" CTA)
  Footer              (newsletter, quick links, resources, social, legal, copyright)
  PageHero            (reusable hero banner for inner pages)
  SectionHeader       (title + subtitle + optional CTA)
  Container           (max-width wrapper)

Cards:
  ProjectCard         (thumbnail, title, subgroup tag, tech tags, status)
  BlogCard            (image, title, excerpt, author, date, categories)
  ResearchCard        (title, authors, publication date, abstract excerpt)
  EventCard           (date, title, location, status, registration link)
  MemberCard          (photo, name, subgroup, role, social links)
  SubgroupCard        (icon, name, description, member count, CTA)
  ResourceCard        (type icon, title, description, download/link)

Interactive:
  Button              (primary, secondary, ghost, pill, icon variants)
  SearchBar           (with filter trigger)
  FilterBar           (checkbox/tag-based filtering)
  Pagination          (page-based navigation)
  Modal               (generic overlay)
  Dropdown            (generic select)

States:
  LoadingState        (spinner or skeleton)
  EmptyState          (icon + message + optional CTA)
  ErrorState          (error icon + message + retry)

Navigation:
  Breadcrumb          (path navigation)
  TabBar              (tab switching)

Statistics:
  StatsStrip          (already exists — animated counters)
  StatCard            (single metric card)

Content:
  Timeline            (for About page history)
  Testimonial         (where applicable)
  PartnerLogoStrip    (affiliate logos)
  AIAssistantWidget   (floating, site-wide — deferred to MVP 2)
```

---

## SECTION 11 — NON-FUNCTIONAL REQUIREMENTS

### Performance
- Pages load under 3 seconds on 3G/4G (Tanzania mobile context)
- Images optimized and lazy-loaded
- No unnecessarily heavy assets
- Minimize bundle size

### Mobile-First
- Design and test mobile-first
- Most traffic is mobile (low-end Android phones)
- All UI must work on mobile Chrome/Safari
- Hamburger nav on mobile

### Responsive Breakpoints
| Device | Widths |
|---|---|
| Mobile (small) | 320px, 375px |
| Mobile (standard) | 390px, 430px |
| Tablet | 768px, 1024px |
| Desktop | 1280px, 1440px |
| Large desktop | 1920px |

### Accessibility (WCAG 2.1 AA)
- Alt text on all images
- Sufficient color contrast
- Keyboard navigation
- ARIA labels where needed
- Readable button labels

### SEO
- Clean URLs
- Meta tags on every page
- Open Graph tags (especially for LinkedIn sharing)
- sitemap.xml
- robots.txt
- Content crawlable (not pure client-side rendered)

### Security (Frontend)
- HTTPS by default
- Validated form inputs
- Spam protection on public forms (reCAPTCHA / honeypot)
- Never expose: passwords, password hashes, JWT secrets, private user info, admin info

### Lighthouse Targets
- Mobile performance: 80+
- Accessibility: 90+
- SEO: 90+
- Best practices: 90+

### Browser Support
- Latest 2 versions: Chrome, Safari, Firefox, Edge
- Mobile Chrome, Mobile Safari

---

## SECTION 12 — INTEGRATIONS REQUIRED

| Integration | Purpose | Phase |
|---|---|---|
| FastAPI Backend REST | All content and data | All phases |
| Google Maps | Embedded campus on Contact page | Phase 3 |
| LinkedIn | Cross-links + share buttons | Phase 6+ |
| Google Analytics / Plausible | Traffic tracking | Phase 10 |
| GitHub | Links to club/member repos | Ongoing |
| reCAPTCHA / hCaptcha | Spam protection on public forms | Phase 3 |
| Email (SMTP) | Form notifications (backend handles) | Backend |
| AI Chatbot Engine (RAG) | Floating chat widget | MVP 2 — DEFERRED |

---

## SECTION 13 — EXISTING FRONTEND CODE (WHAT EXISTS)

### File Structure
```
frontend/src/
├── App.jsx              <- Shell with dark/light theme toggle
├── App.css              <- All CSS variables + navbar + hero + terminal + responsive
├── index.css            <- Base styles
├── main.jsx             <- Vite entry
└── components/
    ├── navbar.jsx       <- GOOD — dropdown, hamburger, theme toggle
    ├── hero.jsx         <- PARTIAL — good animation, wrong text
    ├── StatsStrip.jsx   <- GOOD — animated counter, hardcoded data
    ├── Terminal3D.jsx   <- GOOD — 3D terminal visual
    ├── footer.jsx       <- GOOD — multi-column, newsletter, social icons
    ├── footer.css       <- GOOD — NAS-style rounded card
    └── StatsStrip.css   <- GOOD — strip styles
```

### What Must Be Fixed in Phase 1/3
| Issue | Fix |
|---|---|
| Hero tagline: "IGNITE YOUR AI JOURNEY" | Change to: "AI & Signal Processing Hub — Incubator for AI Minds" |
| Hero CTA 1: "Join Us" | Change to: "Explore Research" |
| Hero CTA 2: "View Work" | Change to: "Join the Hub" |
| Font: system-ui | Add: Montserrat/Space Grotesk + Inter from Google Fonts |
| Stats: hardcoded | Connect to backend API |
| Social URLs: placeholder | Replace with real club URLs when provided |
| Contact email: placeholder | Replace with real email when provided |
| Missing: YouTube icon in footer | Add YouTube to social icons |

### What Must Be Installed in Phase 3
```bash
npm install react-router-dom
# Tailwind CSS decision: keep custom CSS approach OR add Tailwind
# If adding Tailwind: npm install -D tailwindcss postcss autoprefixer
```

---

## SECTION 14 — THE 10-PHASE PLAN

| Phase | Name | Key Deliverables |
|---|---|---|
| **Phase 0** | Project Study (DONE) | This reference document |
| **Phase 1** | Brand & Study | Brand guidelines doc, design system, typography setup |
| **Phase 2** | Reference Research | Analysis of reference websites |
| **Phase 3** | Foundation | Home (complete), global components, auth forms, About, Join Us, Contact |
| **Phase 4** | Projects & Subgroups | Project listing + detail, subgroup listing + detail |
| **Phase 5** | Research & Resources | Research listing + detail, Resources |
| **Phase 6** | Blog & Events | Blog listing + post, Events listing + detail |
| **Phase 7** | Community & Membership | Members directory, community pages, privacy-aware profiles |
| **Phase 8** | Editor Profiles | Editor identity pages |
| **Phase 9** | Member Profiles | Public member profile experience |
| **Phase 10** | Testing & Tuning | Functional, responsive, API, UI, performance, security, UX review |

---

## SECTION 15 — CONTENT AWAITING FROM CLUB (BLOCKERS)

These must come from the club before certain pages can be finalized:

```
[ ] Final logo — SVG (preferred), PNG, white/reversed version
[ ] Brand guidelines (if any existing)
[ ] Final confirmed names and descriptions for all 7 subgroups
[ ] Leadership bios and headshots (Coordinator, subgroup leads, Research PI, faculty advisor)
[ ] Mission statement (confirmed final text)
[ ] Vision statement (confirmed final text)
[ ] Club history / founding date / milestone timeline
[ ] Past and current project writeups with images
[ ] Research Team content: active research lines, publications, collaborator/partner info, PI bio
[ ] Initial blog articles (3-5 for launch)
[ ] Event history (past events with photos) + upcoming calendar
[ ] Official contact email address
[ ] Official social media links: LinkedIn, Instagram, YouTube, X/Twitter, GitHub
[ ] Physical address (MUST campus, Mbeya) for Google Maps
[ ] Partner / affiliate logos (MUST + sponsors)
[ ] Member data (for directory seeding)
```

---

## SECTION 16 — ABSOLUTE RULES (NEVER VIOLATE)

```
1.  NEVER rewrite the backend unless a genuine frontend integration issue exposes a bug.

2.  NEVER trust frontend authorization alone.
    Backend ALWAYS enforces permissions.
    Hiding a button is NOT security.

3.  NEVER ask for subgroup during application.
    Subgroup is chosen during post-approval registration ONLY.

4.  NEVER confuse User and Member.
    User = account identity
    Member = Hub membership
    Separate tables, separate concepts.

5.  NEVER show a member publicly if show_profile = false.

6.  NEVER hardcode content that should come from the API.
    Stats, projects, blog posts, events — all from backend.

7.  NEVER expose passwords, hashes, JWT secrets, or private user data.

8.  NEVER introduce libraries or dependencies without a clear reason.
    Keep the stack lean: React + Vite + CSS + React Router.

9.  ALWAYS design and test mobile-first.
    Most users are on mobile in Tanzania.

10. NEVER put placeholder text, broken links, or unfinished pages
    on the public-facing website. Professionalism is mandatory.

11. NEVER add AI chatbot functionality in MVP 1.
    AI Assistant is deferred to MVP 2.

12. NEVER add Redis, background workers, or newsletter automation in MVP 1.
    These are MVP 2 features.

13. NEVER combine editor role with subgroup leader concept.
    SubGroup.lead_id is separate from the editor role assignment.

14. NEVER send plaintext passwords in email.
    Use secure expiring tokens only.

15. NEVER make the website about abstract AI aesthetics.
    Make it about REAL work: Research + Projects + People + Results + Innovation + Impact.
```

---

## SECTION 17 — AI ASSISTANT WIDGET (DEFERRED)

The floating AI Assistant chatbot is a future MVP 2 feature. When eventually built:

- Floating launcher, bottom-right, every page
- Expands into a chat panel
- Must be fully usable on mobile
- Loads asynchronously — must never block page rendering
- Always shows AI-generated response disclaimer
- Always offers escalation: "Still need help? Contact us"
- Guided Q&A mode to help prospective members pick a subgroup
- Answers grounded in site content only (RAG backend pipeline)
- Frontend renders conversation and surfaces content links returned

**Do NOT build this in MVP 1.**

---

## SECTION 18 — ADMIN CAPABILITIES (REFERENCE FOR ADMIN PHASE)

Super Admin can manage:
- Users: view, activate/deactivate, assign/remove roles
- Applications: view, review, approve, reject
- Members: view, manage, assign subgroup, assign subgroup leader
- Content: full CRUD on Projects, Research, Blog, Events, Resources
- Contact messages: view and manage
- Site settings: manage important platform configuration

Editor can manage:
- Blog posts (create, edit, delete — their own + authorized content)
- Projects (authorized content)
- Research (authorized content)

> NOTE: When admin deactivates or deletes a user, all relationships and roles owned by that user must be deleted too.

---

*This document is the master reference for the entire 10-phase frontend build.*
*Read it before starting each new phase.*
*Update it if architectural decisions change during development.*
