# AI & Signal Processing Hub — Public Website Development Plan
## Overall Goal

Build the complete public-facing AI & Signal Processing Hub website using the already-stabilized backend and the approved brand/design direction.

### Frontend Stack
- React
- Vite
- Tailwind CSS
- React Router
- Existing backend APIs
- Responsive design
- Reusable components
- Mobile-first implementation
### Development Rule

> Do not redesign the backend unless a genuine frontend integration requirement exposes a backend problem.

The public website should consume the existing APIs.
---
## Phase 1 — Website Study & Brand Foundation
### Objective

Understand the existing website structure and establish the official visual identity before implementing additional pages.

### Tasks
1. Study Existing Home Page

Inspect the currently implemented:

- Navbar
- Navigation structure
- Hero section
- Existing sections
- Typography
- Spacing
- Responsive behavior
- Desktop layout
- Mobile layout

>Do not immediately rewrite the existing design.

>First understand what has already been established.

2. Establish Brand Guidelines

Document and consistently use:

- Primary colors
- Secondary colors
- Background colors
- Text colors
- Accent colors
- Font family
- Font weights
- Border radius
- Shadows
- Button styles
- Card styles
- Icon style
- Section spacing
- Container widths
- Heading hierarchy
- Animation principles
3. Define Design Language

The website should communicate:

- Technology
- Artificial Intelligence
- Signal Processing
- Innovation
- Collaboration
- Education
- Research
- African/Tanzanian context
- Professionalism
4. Responsive Rules

Define behavior for:

- Mobile
- Tablet
- Desktop
- Large screens

Deliverable

A Brand & UI Foundation document that becomes the reference for all remaining frontend phases.
---

## Phase 2 — Reference Website Research
### Objective

Study the external websites provided by the project owner and extract useful design patterns.

The developer will receive the reference website links separately.

Important Rule

The references are inspiration and implementation references, not websites to copy blindly.

Study:

- Navbar behavior
- Hero layouts
- Typography
- Section organization
- Cards
- Animations
- Micro-interactions
- Footer
- Responsive behavior
- Navigation patterns
- Content presentation
- Research/project presentation
- Profile presentation
Deliverable

Create a short reference analysis:
```
Reference Website 1
- What we like
- What we can adapt
- What we should avoid

Reference Website 2
- What we like
- What we can adapt
- What we should avoid
```
Then combine the useful ideas with the AI Hub brand established in Phase 1.
---

## Phase 3 — Home Page Completion & Global Components

This is the major foundation phase.

### Part A — Complete Home Page

Build/refine:

- Navbar
- Hero
- Quick statistics
- Subgroups preview
- Featured projects
- Recent projects
- Upcoming events
- Latest blog posts
- Research preview
- Resources preview
- Partners/collaborators
- Join Us CTA
- Footer

The exact sections should follow the approved design from Phase 1.
---
### Part B — Global Components

Create reusable components such as:
```
Navbar
Footer
Button
SectionHeader
Card
ProjectCard
BlogCard
ResearchCard
EventCard
MemberCard
SubgroupCard
LoadingState
EmptyState
ErrorState
Modal
Pagination
SearchBar
Breadcrumb
```
The goal is to avoid creating the same UI repeatedly.
---
### Part C - forms
in this sub phase you going to build all forms and connect them with APIs

form which are going to built here are:
```
onboard reg form
login form
forgot password otp request form
change password form
```
these form are very important to have them before doing other features

---
### Part d — About Page

Build:

- About Hero
- Who We Are
- Mission
- Vision
- What We Do
- AI & Signal Processing focus
- Research
- Innovation
- Collaboration
- Subgroups
- Call to Action
---
### Part E — Join Us Page

Build:

- Join Us Hero
- Why Join
- Who Can Join
- Benefits
- How Membership Works
- Application form

- FAQ
- CTA

The page must connect to the existing application API.
---
### Part F — Contact Page

Build:

- Contact Hero
- Contact information
- Email
- Social links
- Location/institution information
- Contact form
- Success state
- Error state
- FAQ/quick information where appropriate
#### Phase 3 Deliverable

A complete:

- Home
- About
- Join Us
- Contact
- forms

plus the reusable global component system.
---
### Phase 4 — Projects & Subgroups

Build at least two major areas.

#### Projects
- Projects listing
- Project cards
- Project filtering
- Project search
- Project details
- Technologies
- GitHub/demo links
- Related subgroup
- Project members
#### Subgroups
- Subgroup listing
- Subgroup cards
- Subgroup details
- Description
- Leader
- Members
- Projects
- Research associated with subgroup
- Deliverable

A complete public project discovery experience.
---
### Phase 5 — Research & Resources
Research

Build:

- Research listing
- Research search
- Research filtering
- Research details
- Abstract
- Authors
- Publication date
- PDF/external resource
- Related projects/subgroups
### Resources

Build:

- Resource listing
- Search
- Filtering
- Resource categories/types
- Resource details
- Download/external link
- Related subgroup
Deliverable

A complete knowledge/research section.
---
### Phase 6 — Blog & Events
Blog

Build:

- Blog listing
- Category filtering
- Search
- Featured article
- Blog details
- Related posts
- Author information
- Published date
Events

Build:

- Events listing
- Upcoming events
- Past events
- Event details
- Location
- Date/time
- Registration link
- Event status
- Deliverable

Complete content and event discovery experience.
---
### Phase 7 — Community & Membership Experience

Focus on the public community experience.

Build:

- Members directory
- Subgroup members
- Public member cards
- Community statistics
- Membership information
- Join CTA
- Public-facing community pages
- Search/filter where appropriate

Also ensure:

Members who have **show_profile=false** are not publicly exposed beyond what is intentionally allowed.
Public data does not expose private account information.
User/member distinction is respected.
---
Phase 8 — Editor Profile & Content Identity

This phase focuses specifically on Editor profiles.

Build:

Editor profile page
Editor biography
Profile image
Subgroup
Position
Research
Projects
Blog posts
Social links
Professional links

Example:
```
Editor Profile

┌──────────────────────────────┐
│        Profile Image         │
│                              │
│     Editor Name              │
│     Editor • AI Hub          │
│                              │
│     Biography                │
│                              │
│     Subgroup                 │
│                              │
│ GitHub | LinkedIn | Website │
└──────────────────────────────┘

Projects
Research
Articles
```
important

The profile should be generated from actual backend data rather than hardcoded content.
---
### Phase 9 — Member Profiles

Build the public member profile experience.

Member Profile

Include where available:

- Profile picture
- Name
- Position
- Subgroup
- Biography
- GitHub
- LinkedIn
- Portfolio
- Projects
- Research
- Joined date
- Privacy

Respect:
>show_profile = true
Only members who have chosen to expose their profile should receive a full public profile.

Also ensure that sensitive/private user information is never exposed through the public API.
---
### Phase 10 — Final Testing, Integration & Tuning

This is not just another development phase.

The goal is to make the entire public website production-ready.

1. Functional Testing

Test:

- Navigation
- Forms
- Authentication integration
- Join Us
- Contact
- Projects
- Research
- Resources
- Blog
- Events
- Members
- Profiles
- Search
- Filtering
- Pagination
- External links
---
## 2. Responsive Testing

Test:

Mobile
- 320px
- 375px
- 390px
- 430px
Tablet
- 768px
- 1024px
Desktop
- 1280px
- 1440px
- 1920px

---
3. API Integration Testing

Verify:
```
Frontend
   ↓
API
   ↓
Authentication
   ↓
Authorization
   ↓
Database
```

No page should depend on fake/mock data when the corresponding backend endpoint already exists.
---
4. UI Consistency Audit

Check:

Colors
Typography
Buttons
Cards
Spacing
Icons
Borders
Shadows
Animations
Loading states
Empty states
Error states
---
5. Performance

Inspect:

Image sizes
Lazy loading
API requests
Duplicate requests
Component rendering
Bundle size
Unnecessary dependencies
---
6. Security

Check that the public website does not expose:

Passwords
Password hashes
JWT secrets
Private user information
Administrative information
Internal database IDs where unnecessary
Unauthorized content
---
7. Final UX Review

Ask:

Can someone who has never heard of AI Hub understand what this organization does within 10–20 seconds?

Then check:

Can they easily find Projects, Research, Events, Resources, Members, and Join Us?
---
Final Architecture

The development progression becomes:
```
PHASE 1
Brand + Existing Website Study
        ↓
PHASE 2
Reference Website Research
        ↓
PHASE 3
Home + Global Components
+ About
+ Join Us
+ Contact
        ↓
PHASE 4
Projects + Subgroups
        ↓
PHASE 5
Research + Resources
        ↓
PHASE 6
Blog + Events
        ↓
PHASE 7
Community + Membership
        ↓
PHASE 8
Editor Profiles
        ↓
PHASE 9
Member Profiles
        ↓
PHASE 10
Testing + Integration + Final Tuning
```

