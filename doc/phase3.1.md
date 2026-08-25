Phase 3 — Part A & Part B: Home Page + Global Design System
Objective

Before implementing authentication, onboarding, or any other forms, complete the Home Page foundation and establish the global reusable component system for the AI & Signal Processing Hub public website.

This phase is extremely important because everything built after this phase should reuse the components, spacing, typography, interactions, and visual language established here.

Do not start Part C (Forms) yet.

First complete Parts A and B, test them, and make sure the design foundation is stable.
---
Part A — Complete the Home Page

The Home Page should become the main representation of the AI & Signal Processing Hub.

You already inspected and understood the project's:

Brand identity
Existing navbar structure
Approved Phase 1 design
Phase 2 reference websites
Existing frontend repository
Current backend capabilities
AI Hub's purpose and audience

Use those findings as the foundation.

Do not redesign the website randomly.

The final page should feel like a professional technology/research organization rather than a generic AI-generated landing page.
> NOTE: HOME PAGE IS COMPLEX IT HAS ALOT OF CARD SO USING THE WHAT YOU STUDIED OPTIMISE IT ALSO THINGS LIKE SUBGROUPS THEY HAVE THREE IMAGE PLACE ONE FOR COVER ANOTHER FOR ICON AND ANOTHER FOR LEADER SO OPTIMIS THEM IN THE WAY THE WILL LOOK AMIZING 
---
1. Navbar

The navbar structure was already established during the previous phase.

Now implement it properly.

It should include the appropriate navigation for:
```
Home
About
Projects
Research
Resources
Events
Blog
Join Us
Contact
```
Use the navigation structure already approved in Phase 1.

Also account for authentication state where appropriate:
```
Guest
    → Login / Join Us

Authenticated User
    → Profile / Logout

Admin/Editor
    → Appropriate dashboard access
```
Do not expose administrative functionality to users who are not authorized.

Navbar requirements
Responsive desktop navigation
Mobile navigation
Sticky/fixed behavior if consistent with the approved design
Active page indication
Smooth transitions
Accessible keyboard navigation
Mobile menu animation
Proper CTA treatment for Join Us
No unnecessary visual clutter
---
2. Hero Section

Implement the approved Hero design from Phase 1.

The hero should communicate immediately:

Who AI Hub is, what it does, and why it matters.

The current approved direction includes the terminal/code-inspired concept.

The terminal should feel like part of the brand identity rather than a random decorative element.

For example, the concept may communicate:
```
pip install "AI_Hub[standard]"

Installing...

AI_Hub successfully installed.

python run AI_HUB

Empowering the next generation of technologists
to solve real-world challenges in Tanzania
through collaborative excellence in AI
and Signal Processing.
```
Use the exact approved copy/design from Phase 1 where available.
Important

The animation must:

Feel intentional
Be smooth
Not be distracting
Not block page interaction
Work on mobile
Respect reduced-motion preferences
Not continuously consume unnecessary resources

Do not turn the hero into a complicated animation experiment.

The purpose is to create a memorable introduction.
---
3. Quick Statistics

Create a statistics section immediately after the Hero where appropriate.

The statistics should represent real AI Hub information.

Possible concepts include:
```
Projects
Members
Subgroups
Research
```
However:

Do not invent fake numbers.

backend already provides these values, prepare the component so it can consume real API data.

If the API is not yet available, use an appropriate temporary structure and clearly mark the data dependency rather than hardcoding misleading statistics.

The component should support:
```
Loading
Success
Empty
Error
```
---
4. Subgroups Preview

Create a section introducing the technical subgroups.

Use the actual subgroup architecture from the backend.

Examples from the project documentation include:
```
Artificial Intelligence
Signal Processing
Web Development
Embedded Systems
```
Do not assume these are the final production subgroups if the backend contains different data.

The design should support:

Subgroup icon
Name
Short description
Cover image where available
Leader information where appropriate
View subgroup CTA

The section should encourage visitors to explore the different technical areas.
---
5. Featured Projects

Create a visually strong featured project section.

Use the existing Project API/data structure.

Support:

Project image
Project title
Summary
Status
Subgroup
Technologies where available
GitHub link where available
Demo link where available
Featured indicator

Do not create fake project content merely to fill the design.
---
6. Recent Projects

Create a separate section for recent projects.

This should demonstrate that the platform is active and continuously producing work.

Use the existing backend API.

Provide an appropriate:

>View All Projects

CTA.
---

7. Upcoming Events

Create an upcoming events section using the Events module.

Display useful information such as:
```
Event title
Date
Location
Short description
```
Use the actual event API.

Handle:
```
Loading
No upcoming events
API error
```
Do not leave an empty section when there are no events.
---
8. Latest Blog Posts

Build a blog preview section using the existing Blog API.

Display:

Featured image
Title
Excerpt
Category
Publication date
Author where appropriate
Read more CTA

Only display appropriate published content to public visitors.

Respect the backend's visibility rules.
---
9. Research Preview

Introduce the Research module.

The section should communicate that AI Hub is not only a development community but also a research-oriented organization.

Display appropriate research information such as:
```
Research title
Abstract/excerpt
Publication date
Authors
```
---
10. Resources Preview
TO REDUCE SIZE OF OUR HOME PAGE DON'T INCLUDE THIS
---
11. Partners / Collaborators

Create a professional section for:

Partners
Collaborators
Institutions
Supporting organizations

Use the branding approach established in Phase 1.

 invent partner logos for now because we have not get yet from club admin and I love how nas.com displead there sponsor .

If the backend/site configuration does not currently contain partner information, create the component structure and clearly identify the required data source.
---
12. Join Us CTA

Create a strong final CTA encouraging visitors to become part of AI Hub.

The CTA should communicate:
```

Learn
Collaborate
Build
Research
Innovate
```

and lead naturally to:

>Join Us

Avoid generic marketing language.

It should feel consistent with the organization's actual mission.
---
13. Footer

Build the final global footer.

It should contain appropriate:

Navigation
```
About
Projects
Research
Resources
Events
Blog
Join Us
Contact
```
Contact

Use actual configured contact information where available.

Social Media

Use actual AI Hub social links.

Do not invent links.

Legal / Copyright

Include appropriate copyright information.

Branding

Maintain the same visual language as the rest of the site.
---
Part B — Global Component System

After building the Home Page sections, identify repeated UI patterns and convert them into reusable components.

The objective is:

Build once, reuse everywhere.

Do not create separate versions of the same component for every page.
---
Core Components

Create or improve:
```
Navbar
Footer
Button
SectionHeader
Card
```
---
Content Components

Create reusable components for:
```
ProjectCard
BlogCard
ResearchCard
EventCard
MemberCard
SubgroupCard
ResourceCard
```
Each component should receive data through props rather than containing hardcoded content.

Example concept:
```javascript
<ProjectCard project={project} />
```
rather than creating:
```
ProjectCard1
ProjectCard2
ProjectCard3
```
---
State Components

Create consistent reusable states:
```
LoadingState
EmptyState
ErrorState
```
Every API-driven section should be able to use these.

For example
```
Loading
   ↓
Data
   ↓
Empty
   ↓
Error
```
The design of these states should be consistent throughout the website.
---

Navigation Components

Create reusable:
```
Breadcrumb
Pagination
SearchBar
```
These will be used heavily in later phases.

Do not implement unnecessarily complicated functionality if it is not yet required.

Build them so they can be extended later.
---
Modal

Create a reusable Modal component.

It should support:

Open/close
Escape key
Click outside behavior where appropriate
Mobile responsiveness
Accessibility
Focus management where appropriate

It should not contain feature-specific logic.
---
Design System

During this phase, establish consistent:

Typography

Use the typography established in Phase 1.

Define consistent:
```
Heading
Subheading
Body
Caption
Button text
```
Spacing

Create a predictable spacing system.

Avoid random margins such as:
```
mt-7
mt-13
mt-19
```
unless there is a real design reason.

Colors

Use the approved AI Hub brand colors from Phase 1.

Do not introduce random colors.

Border Radius

Keep cards, buttons, inputs and containers visually consistent.

Shadows

Use shadows carefully.

The website should maintain the clean/modern visual style learned from the Phase 2 references.
---
Responsive Design

Everything built in Parts A and B must work across:

```
Mobile
Tablet
Laptop
Desktop
Large screens
```
Do not treat mobile as an afterthought.

Pay particular attention to:

Navbar
Hero terminal
Statistics
Cards
Grids
Project sections
Research sections
Footer

The mobile design should be intentionally designed, not simply a collapsed desktop layout.

>NOTE BECAUSE OF HAVING MANY CARDS MAKE OTHER CARDS TO BE SCROLLED FROM LETF TO RIGHT 
---
Animation & Interaction

Use animation selectively.

The Phase 2 research emphasized:

Smooth scrolling
Good whitespace
Clean alignment
Directional interaction
Professional transitions
Modern visual hierarchy

Use those principles.

Avoid:

Excessive bouncing
Random floating elements
Constant motion
Too many gradients
Excessive glassmorphism
Animation for the sake of animation

The website should feel engineered and intentional, not "vibe coded."
---
API Integration

For Home Page sections that depend on backend data:
```
Projects
Research
Events
Blog
Subgroups
Statistics
```
inspect the existing API before implementing the data fetching.

Do not invent endpoints.

If an endpoint does not exist, document it.

Do not modify the backend simply because the frontend developer prefers a different response format.
>CRITICAL RULE: Do NOT modify, rewrite, or suggest changes to my .env, docker-compose.yml, Dockerfiles, or database.py files. My database connection is currently working perfectly, and those configurations must remain exactly as they are. JUST USE THEM TO TEST CONNECTION
---
Performance

The Home Page is the most important public page, so pay attention to:

Image optimization
Lazy loading
API request efficiency
Avoiding unnecessary requests
Avoiding unnecessary re-renders
Animation performance
Mobile performance

Do not load every piece of platform data at once if it is not required.
---
Accessibility

The Home Page and global components must support:

Keyboard navigation
Semantic HTML
Accessible buttons
Accessible links
Image alt text
Focus states
Sufficient contrast
Reduced motion
Mobile accessibility
---
Code Quality

Follow the existing frontend architecture.

Do not create:

>huge Home.js

containing the entire website.

Break the page into logical components.

For example:
```
Home
 ├── Navbar
 ├── Hero
 ├── Stats
 ├── SubgroupsPreview
 ├── FeaturedProjects
 ├── RecentProjects
 ├── UpcomingEvents
 ├── LatestBlogPosts
 ├── ResearchPreview
 ├── ResourcesPreview
 ├── Partners
 ├── JoinCTA
 └── Footer
```
Keep components focused.
---
Important: Do Not Start Part C

Do NOT implement the authentication/forms in this task.

Part C will begin only after Parts A and B have been completed and reviewed.

The forms will reuse:
```
Button
Input
Card
Modal
LoadingState
ErrorState
SuccessState
SectionHeader
```
and the rest of the global design system established here.
---
Testing Before Completion

Before declaring this phase complete, test:

Desktop
Navbar
Hero
Every Home section
Footer
Navigation
Animations
Mobile
Navbar
Hero
Terminal
Cards
Grids
Footer
Scrolling
API

Test:
```
Success
Loading
Empty
Error
```
for every API-driven section.

Accessibility

Check:
```
Keyboard navigation
Focus states
Alt text
Semantic HTML
Reduced motion
```
>NOTE CURRENT WERE USING NORMAL CSS REPLACE IT ALL WITH TAILWIND
---
Phase 3 — Part A & B Deliverables

At the end of this task, the project should have:
```

✓ Completed Home Page
✓ Responsive Navbar
✓ Hero
✓ Statistics
✓ Subgroups Preview
✓ Featured Projects
✓ Recent Projects
✓ Upcoming Events
✓ Latest Blog Posts
✓ Research Preview
✓ Resources Preview
✓ Partners
✓ Join Us CTA
✓ Footer

✓ Reusable Button
✓ SectionHeader
✓ Card system
✓ ProjectCard
✓ BlogCard
✓ ResearchCard
✓ EventCard
✓ MemberCard
✓ SubgroupCard
✓ ResourceCard
✓ LoadingState
✓ EmptyState
✓ ErrorState
✓ Modal
✓ Pagination
✓ SearchBar
✓ Breadcrumb
```
And most importantly:

The public website should now have a stable visual and component foundation that all subsequent pages can build upon.

After completing this phase, stop and provide a report containing:

What was implemented
Components created
APIs integrated
Components reused
Responsive testing results
Accessibility checks
Performance concerns
Any missing backend APIs
Any design decisions made
Any issues that must be resolved before starting Part C

Do not move to Part C until this report has been reviewed.

> REMBER THIS PAGE IS MAIN STORT TELLING ALSO REFER TO ALL PAST PHASES INORDER TO WORK AS WE PLANED

