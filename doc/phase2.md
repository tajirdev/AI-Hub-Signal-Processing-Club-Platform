# Phase 2 — External Design Reference Study & UI Direction
## Objective

This phase is research and design analysis only.

Do not start implementing new pages or redesigning the entire website yet.

The goal is to study the following websites, understand why their interfaces work, identify the design principles that are relevant to our AI & Signal Processing Hub, and then create a clear UI/UX direction that will be used during implementation in the following phases.

Our website is a serious university/technology organization platform. We are not trying to copy or clone any of these websites.

We want to learn from their design decisions and adapt the relevant principles to our own brand, content, users, and existing architecture.
---
1. Websites to Study

Study each website carefully:

Reference 1 — NAS

https://nas.com/

Pay particular attention to:

White-space usage
Section spacing
Content alignment
Grid systems
Typography hierarchy
Navigation structure
How large sections are visually separated
How content remains clean without feeling empty
Desktop responsiveness
Mobile responsiveness
How visual hierarchy is created without excessive animations

Key principle:
Use whitespace intentionally and maintain strong alignment.
---
Reference 2 — Prismic

https://prismic.io/

Study:

Modern SaaS/technology design
Hero composition
Typography
CTA placement
Cards
Content hierarchy
Section transitions
Use of illustrations/visual elements
Navigation
Responsive behavior

Do not copy the visual identity.

Extract the design concepts that could work for AI Hub.
---
Reference 3 — Ant Design

https://ant.design/

Study:

UI consistency
Spacing system
Typography
Buttons
Forms
Cards
Navigation
Tables
Component behavior
Accessibility considerations
Responsive design
Design-system thinking

This reference is especially important for establishing consistent reusable components throughout the public website.

We want the final website to feel like one coherent product rather than a collection of independently designed pages.
---
Reference 4 — Snappify

https://snappify.com/

Study this website carefully.

Pay particular attention to:

Terminal/code visual design
Smooth scrolling
Scroll progression
Directional arrows
Micro-interactions
Animation timing
Section transitions
Visual storytelling
How the website encourages the user to continue scrolling
How technical content is presented in an attractive way
How animations enhance the experience without becoming distracting

Our AI Hub website has a technology-focused identity, so the terminal/code presentation concept is especially relevant.

However:

>Do NOT turn the entire website into a developer portfolio or terminal-themed website.

The terminal aesthetic should be used strategically.
---
Reference 5 — Nas Daily

https://nasdaily.com/

Study:

White-space principles
Modern editorial layout
Typography
Content density
Visual storytelling
Section hierarchy
Image/content relationships
Scrolling experience
How the site avoids looking artificially generated
How professional websites establish personality without excessive decoration

The goal is to learn how to make AI Hub feel human, modern, intentional and professionally designed.
---
Reference 6 — Current AI Signal Processing Hub

https://aisignalprocessinghub.com/

Study our existing website critically.

This is not a design reference to copy.

Use it as a baseline to identify:

What already works
What should be preserved
What should be redesigned
Poor spacing
Weak hierarchy
Inconsistent components
Excessive decoration
Sections that feel "AI-generated"
Weak typography
Poor responsive behavior
Repeated UI patterns
Navigation problems
Unnecessary animations
Poor content presentation

The goal is to improve the existing platform rather than blindly replace everything.
---
2. Important Design Philosophy

The final AI Hub website must not look vibe-coded.

Avoid:

Random gradients
Excessive glassmorphism
Excessive rounded cards
Too many floating elements
Unnecessary animations
Generic AI illustrations
Excessive shadows
Random icon usage 
don't use imojes at any case
Huge text everywhere
Components that have no purpose
Different design styles on different pages
Animation simply because "AI websites have animations"

Every visual decision should have a reason.

The website should communicate:

>Technology + Research + Education + Collaboration + Tanzania + Professionalism and story telling website user should want to come back
---
3. Establish a Design Language

After studying the references, create a proposed design language for AI Hub.

Document:

Typography

Define:

Primary font
Secondary font if necessary
Heading hierarchy
Body text
Small text
Button typography
Code/terminal typography

Explain why each choice is appropriate.
>NOTE: THIS md ALSO WILL BE STORED TO YOUR MEMORY AND BE USED IN FUTURE
---
Color

Use the brand colors already established in Phase 1.

Do not introduce a completely new color palette simply because a reference website uses one.

Define:

Primary color
Secondary color
Background
Surface
Text
Muted text
Border
Success
Warning
Error

Explain where each should be used.
---
Spacing

Establish a consistent spacing system.

For example:
```
4px
8px
12px
16px
24px
32px
48px
64px
80px
96px
120px
```
Do not necessarily use these exact values if your research suggests a better system.

The important thing is consistency.
---
4. Layout System

Determine how the public website should handle:

Maximum content width
Page margins
Section spacing
Grid columns
Cards
Text widths
Image widths
Hero layouts
Desktop layouts
Tablet layouts
Mobile layouts

Pay particular attention to alignment.

A professional website should feel like its content belongs to the same invisible grid.
---
5. Animation Philosophy

Based on Snappify and the other references, determine:

What should animate?

Examples:

Hero terminal
Section entrances
Navigation
Buttons
Cards
Statistics
Scroll indicators
Page transitions
What should NOT animate?

Avoid animation where it adds no value.

Define:

Animation duration
Easing
Hover behavior
Scroll-triggered animation
Reduced-motion behavior

The goal is:

> Smooth, purposeful motion — not animation everywhere.
---
6. Terminal Concept

Our website has already adopted the idea of using a terminal/code interface as part of the AI Hub identity.

Study Snappify's approach and determine how we can adapt this concept.

The terminal should communicate:
```bash
pip install "AI_Hub[standard]"
```
followed by an installation sequence and then:
```
python run AI_HUB
```
which can transition into our message:
```
Empowering the next generation of technologists to solve real-world challenges in Tanzania through collaborative excellence in AI and Signal Processing.
```
Determine:

Terminal layout
Typography
Animation
Cursor behavior
Loading/install animation
Transition between commands
Desktop behavior
Mobile behavior
Accessibility
Whether the terminal should appear in the hero or a later section

Do not implement it yet.
>NOTE THE ALREADY MADE TERMINAL WORKS BUT NOT AS WHAT I WANTED

---
7. Navigation

Study all references and propose the final navigation behavior.

Our navigation should support the existing AI Hub structure.

Consider:
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
And authentication-related actions where appropriate.

Determine:

Desktop navigation
Mobile navigation
Sticky behavior
Active page indicator
CTA
Scroll behavior
Dropdowns if needed
Mobile menu behavior

Keep it simple.
> NOTE: OUR WEBSITE HAS ALOT OF PAGES SO ADOPT MY NAVGATION HOW i GROUP MULTIPLE RELATED TAB TOGETHER IN DROP DOWN
---
8. Component Strategy

Before implementation, identify the global components that should be reused across pages.

Examples:
```
Navbar
Footer
Button
SectionHeader
Container
Card
Badge
Modal
LoadingState
EmptyState
ErrorState
Pagination
SearchBar
Filter
Terminal
ProjectCard
ResearchCard
BlogCard
EventCard
MemberCard
SubgroupCard
```

Do not create components merely because something appears once.

Components should be reusable where appropriate.
---
9. Public Website Architecture

The public website must eventually support:
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
Later phases will introduce:
```
Editor Profile
Member Profiles
```
---
10. Responsive Design

Study how the reference websites adapt to:

Desktop
Large screens
Standard laptop
Navigation
Multi-column layouts
Large typography
Large visual sections
Tablet
Reduced columns
Adjusted spacing
Navigation adaptation
Mobile
Small screen
Touch-friendly controls
Mobile navigation
Stacked layouts
Readable typography
Appropriate animation
Terminal adaptation
No horizontal overflow

Do not design desktop first and simply "shrink everything".

Mobile should be considered a first-class experience.
---
11. Accessibility

The design must consider:

Semantic HTML
Keyboard navigation
Focus states
Color contrast
Alt text
Form labels
Button accessibility
Reduced motion
Screen-reader-friendly navigation
Proper heading hierarchy

Do not sacrifice accessibility for visual effects.
---
12. Performance

The final design should also consider:

Image optimization
Lazy loading
Animation performance
Avoiding unnecessary JavaScript
Avoiding huge video assets
Efficient fonts
Avoiding excessive DOM complexity

A beautiful website that loads slowly is not a successful implementation.
---
13. Do Not Modify the Existing Application Yet

During Phase 2:

DO
Study the references
Inspect the current frontend
Analyze existing components
Identify reusable components
Identify design problems
Define the design system
Define layout rules
Define animation principles
Define responsive rules
Define component strategy
Produce recommendations
DO NOT
Rewrite the frontend
Delete existing pages
Replace the navigation
Implement the new homepage
Install random UI libraries
Change the backend
Change API contracts
Change database models
Introduce unnecessary dependencies

Implementation begins in the next phase.
---
14. Deliverable

At the end of Phase 2, produce:

PHASE_2_DESIGN_REFERENCE_REPORT.md

The report must contain:
```
1. Executive Summary

2. Reference Website Analysis
   ├── NAS
   ├── Prismic
   ├── Ant Design
   ├── Snappify
   ├── Nas Daily
   └── Current AI Hub

3. What We Should Borrow

4. What We Should NOT Borrow

5. AI Hub Design Philosophy

6. Typography System

7. Color System

8. Spacing System

9. Layout/Grid System

10. Component Strategy

11. Navigation Strategy

12. Animation/Motion Strategy

13. Terminal Experience

14. Responsive Design Strategy

15. Accessibility Strategy

16. Performance Strategy

17. Public Website Design Architecture

18. Proposed Global Components

19. Design Risks / Things to Avoid

20. Phase 3 Implementation Plan
```
>NOTE THIS.md will be used in all future implementions
---
15. Most Important Rule

Do not blindly copy the reference websites.

We are extracting principles, not cloning designs.

The final website should make someone say:

"This feels like a serious technology and research organization."

not:

"This looks like a copy of NAS."

and not:

"This looks like another AI-generated website."

The final design should feel intentional, clean, technical, human, modern, African/Tanzanian in context, and credible enough to represent a university technology hub.

Phase 2 ends when the design direction is documented and agreed upon. Implementation begins in Phase 3.
---