# PHASE 1 — PUBLIC WEBSITE FOUNDATION & DESIGN SYSTEM INSPECTION

## Objective

This is Phase 1 of the AI & Signal Processing Hub public website implementation.

Phase 0 has already introduced you to the overall project, its purpose, users, roles, backend architecture, and the public/admin separation.

Your responsibility in this phase is NOT to start building pages.

Your responsibility is to deeply inspect and understand the current public frontend and establish the design foundation that every future phase will follow.

This is a serious production-oriented project. Do not make random design decisions, replace existing work unnecessarily, or introduce components that conflict with the existing architecture.

---

# 1. Understand the Existing Public Frontend

Start by thoroughly inspecting the current public frontend repository.

Study:

- Project structure
- React architecture
- Routing
- Existing components
- Existing pages
- Navbar
- Hero section
- Footer, if already implemented
- Tailwind configuration
- Global CSS
- Fonts
- Images/assets
- Icons
- Responsive behavior
- Reusable UI components
- API/service structure
- Environment configuration
- Existing dependencies

Do not modify code yet unless a small change is absolutely necessary for inspection or preparation.

Your first responsibility is to understand what already exists.

---

# 2. Existing Navbar Is a Starting Point

The navbar structure has already been designed.

Treat the existing navbar as an intentional design decision.

Do NOT replace it simply because you prefer another navigation style.

Inspect:

- Desktop navigation
- Mobile navigation
- Logo/brand placement
- Navigation links
- CTA buttons
- Mobile menu behavior
- Spacing
- Typography
- Hover states
- Active states

Determine how the navbar should connect to the future public pages.

The expected public website will eventually contain areas such as:

- Home
- About
- Projects
- Research
- Events
- Resources
- Blog/News
- Members
- Join Us
- Contact

Do not assume all links must be displayed directly in the navbar. Determine a clean navigation hierarchy based on the existing design.

---

# 3. Brand Identity

The website represents the AI & Signal Processing Hub.

The brand must communicate:

- Artificial Intelligence
- Signal Processing
- Technology
- Research
- Innovation
- Collaboration
- Student development
- Real-world problem solving
- Tanzanian technological development
- Professionalism
- Community

The website should feel like a serious technology/research organization rather than a generic student website.

The design should balance:

- Modern technology
- Academic/research credibility
- Youthful innovation
- Professional presentation
- African/Tanzanian identity

Avoid excessive visual effects that make the website look like a gaming website or generic AI landing page.

---

# 4. Existing Brand Colors

Inspect the current project and preserve the established brand colors.

The primary colors currently associated with the project are:

- Golden Amber: `#FFBA08`
- Deep Navy: `#0A2472`

Use these as the foundation of the visual system.

Do not introduce a completely different color palette.

You may introduce supporting neutral colors where necessary, such as:

- White
- Off-white
- Light gray
- Dark gray
- Black
- Appropriate navy/amber shades

However, all additional colors must support the existing brand rather than competing with it.

---

# 5. Typography

Inspect the current typography and determine whether it is appropriate for a professional technology/research platform.

Establish:

- Primary font
- Heading font treatment
- Body font treatment
- Font weights
- Heading hierarchy
- Button typography
- Navigation typography
- Mobile typography

Typography must remain consistent across all future pages.

Do not randomly change fonts between pages.

---

# 6. Hero Section Direction

The current website has already explored a terminal-inspired hero concept.

The intended concept is based around an AI Hub installation/initialization experience.

Example concept:

```text
pip install "AI_Hub[standard]"

Installing AI_Hub...
████████████████████ 100%

AI_HUB installed successfully.

python run AI_HUB
```
The terminal concept may then introduce the Hub's message:

>Empowering the next generation of technologiststo solve real-world challenges in Tanzania throughcollaborative excellence in AI and Signal Processing.
### IMPORTANT:

Do not blindly implement this concept yet.

First inspect the current hero implementation and determine how this concept can fit naturally into the existing design.

The hero must remain:

Professional
Fast
Responsive
Accessible
Visually understandable
Appropriate on both desktop and mobile

Avoid excessive animations that negatively affect performance.
---

### 7. Public Website Architecture

Determine the page/component architecture that should support the entire public website.

We will eventually build multiple pages.

The architecture should allow reusable components such as:
```
components/
├── Navbar
├── Footer
├── Button
├── SectionHeader
├── Hero
├── ProjectCard
├── ResearchCard
├── EventCard
├── BlogCard
├── MemberCard
├── SubgroupCard
├── LoadingState
├── EmptyState
└── ...
```
Do not create all these components blindly.

Only establish the architecture and identify which components should become global/reusable.

Avoid creating duplicate components for visually identical functionality.
---
8. Backend Awareness

The public frontend must be designed around the backend that already exists.

Review the available backend APIs and understand what data the public website can consume.

> NOTE: ALL BACKEND APIs with no authentivation and which have get_optional_current_user are public anyone can see them

Important modules include:

- Projects
- Research
- Blog/News
- Events
- Resources
- Members
- Subgroups
- Join Applications
- Contact Messages

Understand:

- Available endpoints
- Response structures
- Authentication requirements
- Public vs protected endpoints
- Pagination
- Search
- Filtering
- Sorting
- Media/file URLs

Do NOT rewrite backend functionality during this phase.

The frontend should adapt to the existing backend unless a genuine API deficiency is discovered.

>NOTE RIGTH NOW WERE USING LOCALHOST TO GET BACKEND APIs figure out how youwill create frontend which in future can be easy to navigate from localhost 
---
9. Public vs Admin Separation

This is critical.

The public website and admin dashboard are separate applications.

The public website should NOT expose administrative functionality.

Public users should be able to:

- Browse information
- View projects
- Read research
- Read blog/news
- View events
- Browse resources
- Browse member profiles where permitted
- View subgroup information
- Submit a Join Us application
- Submit Contact messages

Administrative operations remain inside the Admin Dashboard.

Do not accidentally expose:

- User management
- Role management
- Application approval
- Member deletion
- Content administration
- Subgroup administration
- Other administrative controls

>NOTE ALL FRONTEND PROSSES SHOULD NOTE TOUCH ADMIN DASHBOARD UNLESS YOU WANT TO ADD DUMB DATA FOR TESTING PURPOSE BUT NEVER MODIFY ADMIN

---
10. Join Us Awareness

Understand the existing membership architecture before designing the Join Us page.

The current intended flow is:
```
Visitor
   ↓
Join Us
   ↓
Submit Application
   ↓
Super Admin Reviews
   ↓
Approved / Rejected
   ↓
Approved applicant receives onboarding instructions
   ↓
Applicant completes registration
   ↓
Applicant becomes a member
   ↓
Applicant chooses/joins a subgroup
   ↓
Member profile is created
```
The public website should communicate the process clearly without exposing internal administrative details.

Do not implement the entire membership system in Phase 1.

Simply understand it so future Join Us UX is consistent with the backend.
---
11. Responsive Design

The website must be designed mobile-first.

Inspect the current implementation on:

Desktop
Tablet
Mobile

Pay particular attention to:

Navbar
Hero
Typography
Buttons
Cards
Section spacing
Images
Terminal animation
Grids
Footer

Do not treat mobile as a smaller desktop layout.

Mobile layouts should be intentionally designed.
> NOTE: JUST INCASE THE CURRENT ONE IS NOT GOOD IN MOBILE PHONE NAV-BAR ARE BAD, WHOLE PAGE NOT STABLE AND FOOTER BECOME LONG
---
12. Accessibility

The public website should follow basic professional accessibility practices.

Consider:

Semantic HTML
Keyboard navigation
Visible focus states
Appropriate color contrast
Alt text
Accessible buttons
Accessible links
Form labels
Reduced-motion preferences
Screen-reader-friendly structure

Do not sacrifice accessibility for visual effects.
---
13. Performance

The public website should be optimized from the beginning.

Pay attention to:

Large images
Unnecessary animations
Bundle size
Re-rendering
API requests
Lazy loading
Component duplication
Fonts
Asset loading

Do not introduce heavy libraries just for small visual effects.
> NOTE: CONSIDER WHITE SPACE APPROACH
---
14. External Design References

After inspecting the current repository, I will provide external website references in next phase.

These websites are references for:

Layout ideas
Typography
Navigation
Section composition
Animation ideas
Content presentation
Professional visual hierarchy

They are NOT templates to copy.

Do not clone another website.

Extract useful design principles and adapt them to the AI & Signal Processing Hub brand.
---
15. Design System Deliverable

At the end of Phase 1, create a short document:

PHASE_1_DESIGN_FOUNDATION.md

It should document:

Brand
Organization identity
Design personality
Primary colors
Supporting colors
Typography
Font family
Heading hierarchy
Body typography
Button typography
UI
Button style
Card style
Border radius
Shadows
Spacing system
Section spacing
Icon style
Layout
Maximum content width
Grid behavior
Desktop layout
Tablet layout
Mobile layout
Animation

Document the animation principles.

For example:

Subtle
Purposeful
Fast
Non-distracting
Respect reduced-motion preferences
Components

List the global components that should eventually be created.

Pages

Document the planned public pages and their purpose.
>NOTE: THIS PHASE_1_DESIGN_FOUNDATION.md YOU WILL ALSO STORE IT IN YOUR MEMORY FOR FUTURE REFERRENCE
---
16. Do Not Start Full Implementation

This phase is primarily an inspection and foundation phase.

DO NOT:

Rewrite the entire frontend
Replace the existing navbar
Replace working components unnecessarily
Build every page
Change backend architecture
Introduce unnecessary dependencies
Copy external websites
Create random designs without understanding the brand

The goal is to make sure that when implementation begins in later phases, every page looks like it belongs to the SAME website.
---
17. Phase 1 Final Report

At the end of the phase, provide:

A. Current Frontend Assessment

Explain:

What is already good
What should remain
What needs improvement
What should be removed
What should be redesigned
B. Brand System

Document:

Colors
Typography
Spacing
Components
Visual style
C. Architecture

Explain:

Current frontend architecture
Recommended component architecture
Recommended page structure
API integration approach
D. UX Strategy

Explain how users should experience:

Home
About
Projects
Research
Events
Resources
Blog
Members
Join Us
Contact
E. Problems Found

List every issue discovered.

Use:
```
Issue
Severity
Location
Problem
Recommended solution
```
F. Phase 1 Verdict

Return one of:

READY FOR PHASE 2

or

NOT READY FOR PHASE 2

If NOT READY, clearly explain what must be fixed first.
---
IMPORTANT RULE

Do not optimize for simply "finishing the phase."

Optimize for creating a strong foundation for the remaining public website phases.

Every future page must feel like it was designed by the same product/design team.

The final website should feel like a professional AI and Signal Processing technology hub based in Tanzania — not a collection of unrelated React pages.
```

### One important adjustment to your 10-phase plan

I would make **Phase 1 purely foundation/inspection**, as above. Then Phase 2 can be where you give him the **external reference websites** and make him extract their design principles.

That gives you a clean progression:
```

| Phase | Focus |
|---|---|
| **0** | Project awareness |
| **1** | Existing frontend + brand/design-system inspection |
| **2** | External reference analysis + design direction |
| **3** | Home page + global components + About/Join Us/Contact sub-phases |
| **4** | Projects + Research |
| **5** | Events + Resources |
| **6** | Blog/News + Subgroups |
| **7** | Members directory + supporting public pages |
| **8** | **Editor profile pages** |
| **9** | **Member profile pages** |
| **10** | Full public-site testing, responsive QA, API testing, performance, accessibility, SEO and final tuning |

This is a much safer structure because **Phase 1 and 2 establish the visual language before the AI starts generating a large amount of frontend code**.
```

