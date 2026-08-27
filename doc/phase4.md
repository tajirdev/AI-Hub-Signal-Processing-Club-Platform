# Phase 4 — Projects & Subgroups

## Objective

Build the public-facing **Projects** and **Subgroups** experience for the AI & Signal Processing Hub website.

This phase should turn the existing frontend into a proper public discovery platform where visitors can:

- Discover projects
- Search and filter projects
- Open detailed project pages
- Understand which subgroup is responsible for a project
- Discover technical subgroups
- View subgroup leaders and members
- See projects and research associated with a subgroup

This phase must build on the architecture, branding, design system, reusable components, and API integration established in the previous phases.

---

# 1. IMPORTANT — Before Coding

Do NOT immediately start creating pages.

First inspect the existing frontend and backend.

Review:

- Existing React project structure
- Routing
- API client/service layer
- Authentication handling
- Existing global components
- Existing Card components
- Existing SectionHeader
- Existing loading/empty/error states
- Existing search components
- Existing pagination
- Existing design tokens
- Existing typography
- Existing colors
- Existing animations
- Existing responsive behavior
- Existing Home/About/Join Us/Contact implementation

Also inspect the backend APIs and schemas for:

- Projects
- Project members
- Technologies
- Subgroups
- Members
- Research
- Users

Do not create duplicate components if an existing reusable component can be extended.

Do not create fake API data if the real API already exists.

If an API response does not provide something required by the design, document it before creating a workaround.

---

# 2. Design Direction

The website should continue the design language established during Phases 1–3.

The design must feel:

- Modern
- Technical
- Professional
- Research-oriented
- Clean
- Confident
- Human
- Spacious
- Institutional but not boring

Continue using the established AI Hub brand colors and typography.

Maintain the principles learned from the reference websites:

- Strong whitespace
- Clear visual hierarchy
- Consistent alignment
- Smooth scrolling
- Subtle animations
- Good typography
- Purposeful motion
- Clean cards
- Avoid excessive gradients
- Avoid unnecessary glassmorphism
- Avoid "AI-generated/vibe-coded" visual clutter

The website should feel like a serious technology and research organization.

---

# 3. Projects Section

Create a dedicated public Projects experience.

Recommended route:

`/projects`

The page should allow visitors to understand the work being done by the Hub without requiring authentication.

---

## 3.1 Projects Hero

Create a strong but simple hero section.

Include:

- Page title
- Short description
- Optional project statistics
- Visual element related to technology/research

Example messaging direction:

"Projects turning research and technology into real-world solutions."

Do not blindly use this exact text if the existing brand copy provides something better.

---

# 4. Projects Listing

Create a project discovery interface.

Each project should be displayed using a reusable `ProjectCard`.

The card should communicate:

- Project title
- Short summary
- Thumbnail/image
- Status
- Related subgroup
- Technologies
- Featured indicator where appropriate
- Optional project members
- View project action

Example structure:

```text
┌──────────────────────────────┐
│                              │
│        Project Image         │
│                              │
├──────────────────────────────┤
│ AI Medical Analysis          │
│                              │
│ Short project description... │
│                              │
│ [Python] [FastAPI] [AI]      │
│                              │
│ AI Research                  │
│                              │
│ View Project →               │
└──────────────────────────────┘
```
>   NOTE: we will use same cards from home page but the view project button will be added
---
5. Project Search

Implement project search.

Users should be able to search projects by relevant information supported by the API.

At minimum consider:

Project title
Summary
Description

Use the backend search API.

Do NOT implement unnecessary frontend-only filtering if the backend already supports search.

Search must be:

Responsive
Debounced where appropriate
Accessible
Clearable
Mobile friendly
---
6. Project Filtering

Implement project filtering based on available backend data.

Possible filters include:

Subgroup
Status
Featured
Technology

Only implement filters that are actually supported by the backend or can be implemented correctly without duplicating business logic.

Do not invent filter parameters that the backend does not support.

The filter UI should be easy to understand.

Desktop:
```
Search Projects       Filters
────────────────────────────────

[ Search.................... ]

[ Subgroup ▼ ] [ Status ▼ ] [ Technology ▼ ]
```
---
7. Project Pagination

Use the existing pagination component created in previous phases.

Pagination should be handled consistently with the backend API.

Display useful information such as:

Current page
Total results
Number of results returned

Do not load the entire project database into the browser the API supports pagination.
---
8. Project States

Every project listing must properly handle:

Loading

Use the existing LoadingState or skeleton system.

Empty

Example:

"No projects found."

If search/filtering is active:

"No projects match the current search or filters."

Error

Display a clear error state.

Do not expose raw backend errors to the public.
---
9. Project Details

Create:

/projects/:slug

Use the project's slug if the backend supports slug-based lookup.

If the backend currently exposes only ID-based lookup, use the existing API contract rather than modifying the architecture unnecessarily.

The project details page should include:

Hero
Project title
Summary
Featured indicator
Project image
Overview
Full description
Project purpose
Problem being addressed
Technologies

Display technologies using reusable technology badges/cards.

Example:
```
Python
FastAPI
React
PostgreSQL
TensorFlow
```
Only display technologies returned by the API.

Links

Where available:

GitHub
Live demo
Documentation

Links should clearly indicate that they are external.

Project member
display member who created the project
>NOTE IF THE ONE HOW POESTED THE PROJECT IS LEADER OF SUB GROUP THEN DISPLAY ALL MEMBER OF THAT PARTICULAR GROUP I ALLOW YOU TO MAKE EVEN SMALL CHANGES IN BACKEND TO SUPPORT THIS ACTION
Display members involved in the project.

Use the existing MemberCard where appropriate.

Show:

Name
Position
Avatar if available
Relevant links if appropriate

Do not expose private information.

Related Projects

If the API supports it, display projects related to the same subgroup or technology.

Do not create unnecessary API calls if the information can already be obtained efficiently.
---