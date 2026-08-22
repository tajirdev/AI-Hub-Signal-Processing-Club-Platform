# AI & Signal Processing Hub — Complete Project Context

You are working on an existing professional web platform for an **AI & Signal Processing Hub**.

This is NOT a toy project. The backend has already been substantially implemented, so your job is to understand the existing architecture and extend/stabilize it without unnecessarily rewriting working code.

The project is being developed with:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- React
- Tailwind CSS
- Docker

- JWT Authentication
- Role-Based Access Control (RBAC)

The frontend and backend are separate applications.

---

# 1. PROJECT PURPOSE

The platform represents an AI & Signal Processing Hub/club.

The platform should allow the Hub to:

- Introduce the organization
- Showcase projects
- Showcase research
- Publish blog/news content
- Display technical subgroups
- Display Hub members
- Organize events
- Provide resources
- Allow people to apply to join the Hub
- Allow administrators to manage applications and members
- Allow authorized users to manage content
- Eventually support AI-powered functionality

The website should feel like a professional technology/research organization rather than a simple student CRUD application.

---

# 2. TECHNOLOGY STACK

## Backend

- Python
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Alembic
- JWT authentication
- OAuth2 password flow
- Password hashing
- Pydantic schemas

## Frontend

- React
- Tailwind CSS
- javascript
- css

## Infrastructure

- Docker
- Docker Compose

## Future/Reserved

- Redis
- RAG
- Notifications
- Advanced analytics

Do NOT introduce additional technologies unless there is a clear technical reason.

---

# 3. IMPORTANT DEVELOPMENT PRINCIPLE

The backend already contains working functionality.

Before changing anything:

1. Inspect the existing implementation.
2. Understand the current models.
3. Understand the existing relationships.
4. Understand the authentication system.
5. Understand the role system.
6. Reuse existing services and utilities.
7. Do not duplicate functionality.
8. Do not rewrite working modules unnecessarily.
9. Preserve existing API behavior unless there is a clear bug.
10. Use database migrations for schema changes.
11. Never directly modify the production database schema manually.
12. Maintain backward compatibility where practical.
13. Validate changes before declaring them complete.

The goal is:

> Stabilize and extend the existing system, not rebuild it.

---

# 4. USER TYPES AND ROLES

The platform has FOUR roles:

```text
user
member
editor
super_admin
```

These roles have different responsibilities.

# 5. USER ROLE

user represents a registered platform account that is NOT yet an official Hub member.

A user may exist because:

- They completed account registration.
- They were invited after an approved membership application.
- The system created an account during onboarding.

A user does NOT automatically become a Hub member.

This distinction is important:

A User account represents identity.
A Member represents membership in the Hub.

Therefore:
> User != Member

A user can exist without having a Member record
---
6. MEMBER ROLE

A member is an officially accepted Hub member.

A member has:

- A User account
- A Member record
- A selected subgroup
- A position
- Optional GitHub
- Optional LinkedIn
- Optional portfolio
- Profile visibility settings

The relationship is:

```
Users
   |
   | user_id
   ↓
Members
   |
   | subgroup_id
   ↓
SubGroups
```
A member normally has:

> position = "member"

when initially joining.
---

7. EDITOR ROLE

An editor is a trusted Hub user with elevated content-management permissions.

Editors may be allowed to manage content such as:

Blog posts
Projects
Research
Other content depending on endpoint permissions

The current authorization pattern is based on RoleChecker.

Example:
```python
editor_required = RoleChecker([
    "editor",
    "super_admin"
])
```
An editor is NOT automatically the leader of a subgroup.

These concepts must remain separate.

---

8. SUBGROUP LEADERSHIP

Subgroup leadership is represented separately from the role system.

The SubGroup model contains:

> lead_id

This identifies the member leading that subgroup.
For example:

```
Artificial Intelligence
    lead_id = 15

Signal Processing
    lead_id = 23
 ```
 Do NOT use

 > position = "leader"
as the primary authorization mechanism.

> as the primary authorization mechanism.

Instead:
> Role = editor

means the user has editor-level permissions.
While:
> SubGroup.lead_id

means that member leads that particular subgroup.
A Super Admin may assign both.

---
9. SUPER ADMIN

super_admin is the highest-level role.

The Super Admin is responsible for:

- Managing users
- Managing roles
- Promoting users
- Managing editors
- Reviewing membership applications
- Approving applications
- Rejecting applications
- Managing subgroups
- Assigning subgroup leaders
- Moderating content
- Managing important platform configuration
- Performing administrative operations

Super Admin has the highest authorization level.

Existing authorization logic treats:
> "super_admin"

as an administrative bypass for protected role checks.
Do not weaken this permission model.

---

10. ROLE HIERARCHY

Conceptually:
```
super_admin
     |
     ├── manages editors
     ├── manages members
     ├── manages users
     └── manages platform
     
editor
     |
     └── manages authorized content

member
     |
     └── participates in Hub

user
     |
     └── normal authenticated account

```
Important:

This is NOT inheritance in the database.

A user having the member role does not automatically mean they have the editor role.

Roles should be explicitly assigned through the UserRoles relationship.

---
11. USER ↔ ROLE ARCHITECTURE

The project uses:
```
Users
Roles
UserRoles
```
This is a many-to-many relationship.

Conceptually:
```
Users
   |
   | UserRoles
   |
Roles

```
A user can have multiple roles.
For example:
```
User #10
   |
   ├── member
   └── editor

```
A Super Admin can assign/remove roles.

Do NOT reintroduce a single:
> user.role

field if the existing architecture uses:
> user.roles

with the UserRoles junction table.

---

12. MEMBERSHIP APPLICATION FLOW

The membership process is intentionally separate from normal user authentication.

The flow is:
```
Visitor
   |
   ↓
Join Us
   |
   ↓
Submit Application
   |
   ↓
Application = pending
   |
   ↓
Super Admin reviews
   |
   ├───────────────┐
   ↓               ↓
Approved         Rejected
   |
   ↓
Invitation / Registration
   |
   ↓
Complete Registration
   |
   ↓
Choose Subgroup
   |
   ↓
Create Member
   |
   ↓
Assign member role

```
---

13. APPLICATION TABLE

The Application table stores membership applications.

Current important fields include:
```
id
first_name
last_name
registration_number
programme
year
email
phone
motivation
status
reviewed_by
created_at
```
Application status should be:

```
pending
approved
rejected
```
The application does NOT currently contain:
> subgroup_id

This is intentional.

---

14. WHY APPLICATION DOES NOT CHOOSE SUBGROUP

The current design intentionally separates:

Application

"Should this person be accepted into the Hub?"

from:

Registration

"Which subgroup does this accepted member want to join?"

Therefore the applicant submits:

```
Name
Registration number
Programme
Year
Email
Phone
Motivation
```
The applicant does NOT select a subgroup at this stage.

After approval, during registration/onboarding, the person chooses their subgroup.

---
15. APPLICATION CREATION

The application endpoint is public.

A visitor should be able to submit:

```http
POST /applications
```
without authentication.

The backend creates:
> Application.status = pending

The person is NOT yet:

a member
an editor
a super admin

They are simply an applicant.

---
16. APPLICATION REVIEW

Only authorized administrators should access application management.

The Super Admin can:
``` http
GET /applications
GET /applications/{id}
PATCH /applications/{id}
DELETE /applications/{id}
```
When reviewing:
> pending → approved

or
> pending → rejected

An already reviewed application should not normally be reviewed again.

Do not allow arbitrary status values.

---
17. APPROVAL FLOW

When the Super Admin approves an application:
```
Application.status = approved
Application.reviewed_by = super_admin.id
```
Approval does NOT immediately create the final Member record if the user still needs to complete registration.

Instead, the next stage is onboarding.

---
18. EMAIL / INVITATION FLOW

After approval, the applicant should receive an email.

The email should tell them that their application was approved and provide a secure registration link.

Example:

```
Your application to AI & Signal Processing Hub has been approved.

Complete your registration here:
[Complete Registration]
```
The registration link should use a secure, expiring, single-use token.

Do NOT send passwords through email.

Do NOT put sensitive information inside the URL.

The invitation should eventually support:
```
expires_at
used_at
token_hash
```
or an equivalent secure design.
---

19. COMPLETE REGISTRATION

After clicking the invitation:

The applicant completes their account:
```
username
password
confirm password
profile information
GitHub
LinkedIn
portfolio
etc.
```
They also choose their subgroup.

Example:
```
Artificial Intelligence
Signal Processing
Web Development
Embedded Systems
```
The backend must verify:

- Invitation exists.
- Invitation has not expired.
- Invitation has not already been used.
- Application is approved.
- Selected subgroup exists.
- Email matches the approved application where applicable.

Only after validation should the system finalize onboarding.
> NOTE IN  COMPLETE REGISTRATION APROVED APPLICANT SHOULD FILL THE FORM WHICH MIX BOTH USER AND MEMBER INFORMATION MAINING OTHER INFOMATION WILL BE STORED AT USER TABLE AND OTHER AT MEMBER TABLE
---

20. MEMBER CREATION

After successful registration:
```
Users
   ↓
UserRoles
   ↓
member
```
and:
```
Members
   ├── user_id
   ├── subgroup_id
   ├── position = "member"
   ├── github
   ├── linkedin
   ├── portfolio
   └── show_profile
```
The person is now officially a Hub member.

---
21. PROMOTING MEMBER TO EDITOR

A normal member does NOT promote themselves.

Only the Super Admin can promote someone.

Flow:
```
Member
   ↓
Super Admin reviews member
   ↓
Super Admin assigns editor role
   ↓
User now has editor permissions
```
The system should add:
```
UserRoles
user_id = X
role_id = editor
```
Do not change the Member record to make someone an editor.

Role and membership data represent different concepts.

---

22. ASSIGNING SUBGROUP LEADER

A Super Admin can assign an existing member as a subgroup leader.

For example:
```
AI Subgroup
lead_id = Member #15
```
also organization's policy requires subgroup leaders to have editor permissions, so the Super Admin should:

Assign editor role.
Assign the member as subgroup lead_id.

Do not combine these two database concepts.

---

23. AUTHENTICATION

Authentication uses:

OAuth2 password flow
JWT access tokens
Password hashing

Login returns:
```json
{
    "access_token": "...",
    "token_type": "bearer"
}
```
The JWT should contain enough information to identify the authenticated user.

Do not rely on a nonexistent:
```
user.role
```
field.

should use:
> current_user.roles

through the UserRoles relationship.

---

24. ROLE CHECKER

The project uses a role checker similar to:

```python
class RoleChecker:

    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = set(allowed_roles)

    def __call__(
        self,
        current_user: Users = Depends(get_current_user)
    ) -> Users:

        user_roles = {
            role.name
            for role in current_user.roles
        }

        if "super_admin" in user_roles:
            return current_user

        if not user_roles.intersection(
            self.allowed_roles
        ):
            raise HTTPException(
                status_code=403,
                detail="You do not have permission."
            )

        return current_user
```
Typical dependencies:

```python
admin_required = RoleChecker([
    "super_admin"
])

editor_required = RoleChecker([
    "editor",
    "super_admin"
])

member_required = RoleChecker([
    "member",
    "editor",
    "super_admin"
])
```
Use these consistently.

Do not duplicate role-checking logic inside every service unless there is a specific business rule that requires it.

---
25. MEMBER DIRECTORY

Members are stored separately from Users because a platform account and Hub membership are different concepts.

Member fields include:

```
id
user_id
subgroup_id
position
github
linkedin
portfolio
show_profile
joined_at
updated_at
```
The member directory can display:
```
Name
Subgroup
Position
GitHub
LinkedIn
Portfolio
Joined date
```
---
26. SUBGROUPS

Subgroups represent the Hub's technical areas.

Examples:
```
Artificial Intelligence
Signal Processing
Web Development
Embedded Systems
```
Important fields:
```
id
name
slug
description
icon_id
cover_image_id
lead_id
created_at
updated_at
```
slug is a URL-friendly unique identifier.

Example:
> Artificial Intelligence
could become:

> artificial-intelligence

lead_id identifies the subgroup leader.

---
27. PROJECT MODULE

Projects represent work created by the Hub.

Project fields include:
```
id
title
slug
summary
description
status
thumbnail_id
github_url
demo_url
featured
subgroup_id
created_by
created_at
updated_at
```

Projects can have many members.

This is represented using:
> ProjectMembers
Projects can also use many technologies.

```
Projects
   |
   └── ProjectTechnologies
             |
             └── Technologies
```
Examples:
```
Python
React
Docker
Arduino
TensorFlow
```
---
28. RESEARCH MODULE

Research stores research outputs.

Fields include:
```
id
title
slug
abstract
content
publication_date
pdf_url_id
created_by
featured
created_at
updated_at
```
Multiple members can be authors.

Relationship:
```
Research
   |
   └── ResearchAuthors
            |
            └── Members
```
author_order determines author ordering.

---
29. BLOG MODULE

The blog system contains:
```
BlogPosts
Categories
BlogCategories
```
Blog posts include:
```
title
slug
excerpt
content
featured_image_id
status
published_at
author_id
created_at
updated_at
```

Blog status:
```
draft
published
```
Categories can include:

```
News
Tutorials
Research
Events
Member Spotlight
```
A blog post can belong to multiple categories.

Therefore:
```
BlogPosts
      |
      └── BlogCategories
                |
                └── Categories
```
Editors and Super Admins can manage blog content according to authorization rules.

Members can access published content.
---
30. EVENTS MODULE

Events contain:
```
id
title
description
location
event_date
registration_link
cover_image_id
status
created_by
created_at
updated_at
```
The system should allow the frontend to display upcoming events and relevant event information.

Event registration functionality is reserved for future expansion if not already implemented.

---
31. RESOURCES MODULE

Resources can include

```
PDF
Presentation
Dataset
Video
External Link
```
Resource fields include:
```
id
title
description
type
file_url_id
external_url
subgroup_id
uploaded_by
created_at
```
Resources should be searchable/filterable where appropriate.

---
32. CONTACT MODULE

Visitors should be able to contact the Hub.

Contact messages contain:
```
id
name
email
subject
message
status
created_at
```
The contact endpoint should be publicly accessible.
 only super_admin can create,edeite and delete
Administrative access should be protected.
---
33. WEBSITE PAGES

The public frontend should contain at minimum:
```
Home
About
Projects
Research
Blog / News
Events
Resources
Members
Subgroups
Contact
Join Us
```
The exact navigation can evolve with the frontend design, but these are core platform areas.

---
34. HOME PAGE

The Home page should communicate the identity of the Hub.

Important sections can include:

- Hero section
- Hub introduction
- Mission/impact
- Featured projects
- Research highlights
- Latest news
- Subgroups
- Events
- Call to action
- Join Us

The visual identity should communicate:

- AI
- Signal Processing
- Technology
- Research
- Collaboration
- Innovation
- African/Tanzanian impact

The design should not look like a generic blog.
---
35. JOIN US PAGE

Join Us should contain the membership application form.

The form collects:

```
First name
Last name
Registration number
Programme
Year
Email
Phone
Motivation
```
Do NOT ask for subgroup during this initial application.

Subgroup selection happens after approval during registration.

---
36. ADMINISTRATION

The admin interface should allow the Super Admin to manage:

### Users
- View users
- Activate/deactivate accounts
- Assign roles
- Remove roles where appropriate
### Applications
- View applications
- Review applications
- Approve
- Reject
### Members
- View members
- Manage membership
- Assign subgroup
- Assign subgroup leader
### Content
should have full crontol:

- Projects
- Research
- Blog
- Events
- Resources
and all other content found in application

> NOTE WHEN ADMIN DEACTIVATE USER OR DELETE USER THEN USER SHOULD DELETED WITH ALL RELATIONSHIP AND ROLE OWNS
---

37. DATABASE ARCHITECTURE

The database uses:
```
PostgreSQL
SQLAlchemy
Alembic
```
Major entities:
```
Users
Roles
UserRoles

SubGroups
Members

Projects
ProjectMembers
Technologies
ProjectTechnologies

Research
ResearchAuthors

BlogPosts
Categories
BlogCategories

Events

Resources

Applications

ContactMessages

Media
SiteSettings
ActivityLogs
```
---
38. FUTURE FEATURES

Some functionality is intentionally reserved for later.

Do NOT implement these unless explicitly requested:

AI Assistant
RAG
Redis-powered functionality
Advanced analytics
Notifications
Newsletter system
Real-time chat
Event registration
Blog comments
Advanced recommendation/matching systems

The MVP should remain stable and focused.
---
9. EMAIL AND OTP

The next stabilization work includes:

- Registration emails
- Membership invitation emails
- membership rejected emails
- OTP functionality where required
- Password reset emails
- Email verification

Security requirements:

- Never send plaintext passwords.
- OTPs must expire.
- OTPs must be single-use.
- Limit OTP attempts.
- Rate-limit OTP requests.
- Store OTPs securely.
- Do not expose OTPs in API responses.
- Do not log sensitive tokens or passwords.
- Invalidate used tokens.

Use environment variables for email credentials.

Never hardcode:
```
EMAIL_PASSWORD
SECRET_KEY
DATABASE_PASSWORD
```
inside source code.

---
40. SECURITY REQUIREMENTS

This is a professional project.

Always follow:

Authentication
- Password hashing
- JWT expiration
- Secure token handling
- Proper authentication dependencies
Authorization
- Use RoleChecker
- Follow least privilege
- Never trust frontend role information
- Always enforce permissions on the backend
Database
- Use SQLAlchemy
- Use Alembic migrations
- Use foreign keys
- Use constraints where appropriate
- Avoid duplicated data
API
- Validate input with Pydantic
- Return appropriate HTTP status codes
- Do not expose sensitive information
- Avoid leaking internal errors
Secrets

Use .env:
```
DATABASE_URL
SECRET_KEY
ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
EMAIL_HOST
EMAIL_PORT
EMAIL_USERNAME
EMAIL_PASSWORD
```

Never commit secrets to Git.

---
41. ERROR HANDLING

Use appropriate status codes.

Examples:
```
400 → Bad request
401 → Unauthenticated
403 → Authenticated but not authorized
404 → Resource not found
409 → Conflict
422 → Validation error
500 → Internal server error
```
Do not return generic success responses when an operation actually failed.
---
42. DATABASE MIGRATIONS

Any model change must use Alembic.

Example:
```bash
alembic revision --autogenerate -m "add application status"
```
Then inspect the migration before applying it.

Apply:
```
alembic upgrade head
```
Do not blindly trust autogenerated migrations.

Review:

- Foreign keys
- Constraints
- Nullable changes
- Enum changes
- Indexes
- Cascades

---
43. SERVICE / ROUTER ARCHITECTURE

The project currently uses a:
```
Router
   ↓
Service
   ↓
Model / Database
```
architecture.

Routers should handle:

- HTTP requests
- Dependencies
- Authentication/authorization
- Request/response schemas

Services should handle:

- Business logic
- Database operations
- Validation related to business rules

Models should handle:

- Database structure
- Relationships
- Constraints

Do not put large business logic blocks inside routers.

---
44. ASYNC / SYNC
The project may use both synchronous and asynchronous functions.
the existing database session is synchronous:
>  DO NOT CHANGE IT

Use the existing pattern consistently within each module.

Async is particularly useful for:

- External APIs
- Email services


But do not introduce async simply because it looks modern.

---
45. REDIS

Redis is part of the planned technology stack but is intentionally reserved for later functionality.

Potential future uses:

OTP storage
Rate limiting
Caching
Sessions
Background task coordination
AI assistant state

Do not add Redis dependency to simple CRUD operations unless there is a real requirement.

for these mvp we wont use it

---
46. DOCKER

The application runs using Docker.

Services may include:
```
backend
frontend
postgres
redis
```
Redis may remain unused during early MVP development.

Environment-specific configuration should be handled using environment variables.

---
47. FRONTEND PRINCIPLES

React + Tailwind CSS&&CSS.

Frontend should:

Be responsive
Have reusable components
Handle loading states
Handle errors
Validate forms
Prevent duplicate submissions
Display useful feedback
Respect authenticated state
Hide UI controls the user cannot use

However:

Hiding a button is NOT authorization.

The backend must still enforce permissions.

---
48. IMPORTANT ROLE EXAMPLES
Visitor
```
Can:
- View public website
- Read public content
- Submit contact form
- Submit Join Us application
```
Member
```
Can:
- Access member functionality
- Participate in Hub activities
- Have a subgroup
- Have a member profile
```
Editor
```
Can:
- Perform authorized content management
- Manage content such as blog/projects/research
```

Super Admin(to his dashboard)
```
Can:
- Manage users
- Manage roles
- Review applications
- Manage members
- Manage editors
- Manage subgroup leadership
- Manage important platform resources

```
Always enforce the exact permission at the backend endpoint.
---
49. CRITICAL DATA DISTINCTIONS

Do NOT confuse these:
```
User
Member
Role
Position
Subgroup Leader

```

They mean different things.

User

this is flotting role can not do anything on it own it need another supportive role **example user and member,userand editor and user and superadmin

Member

Who belongs to the Hub.

Role

What system permissions they have.

Position

Their position/title inside the member structure.

Subgroup Leader

Who leads a specific subgroup.

---
50. EXAMPLE COMPLETE LIFECYCLE

Example:
```
John visits the website.
```
He clicks:
> Join us
he submit
```

John Doe
DETE/2026/001
Electronic & Telecommunication Engineering
Year 2
john@example.com
...
```
database
```
Application
status = pending
```
Super Admin reviews it.

Admin approves:
```
Application
status = approved
reviewed_by = Admin
```
System sends John an email.

John clicks:
> Complete Registration

he creates
```
username
password
```
He chooses:

>Signal Processing

The system creates:

>Users

Then:
```

UserRoles
role = member
```

Then:
```
Members
user_id = John
subgroup_id = Signal Processing
position = member
```
John is now officially a Hub member.

Later, the Super Admin decides John should become a subgroup leader.

Admin assigns:
> Role = editor

and
> Signal Processing.lead_id = John's Member ID

john is now
```
User
+
Member
+
Editor
+
Signal Processing Leader
```
without mixing these concepts together.

---
51. WHAT YOU MUST NOT DO

Do NOT:

- Reintroduce user.role as a single role field.
- Replace the UserRoles system.
- treat User and Member as the same entity.
- Make subgroup selection part of the initial application.
- Automatically make applicants members before registration.
- Automatically make members editors.
- Treat editor as synonymous with subgroup leader.
- Send plaintext passwords by email.
- Store plaintext passwords.
- Trust frontend authorization.
- Hardcode secrets.
- Delete important reviewed records without considering audit requirements.
- Rewrite working modules unnecessarily.
- Introduce Redis everywhere just because Redis exists in the stack.
- Add AI functionality to the MVP unless explicitly requested.
- Change database models without an Alembic migration.
---
52. CURRENT PRIORITY

The backend has already completed a substantial portion of the core CRUD functionality.

The current priority is:

Stabilization

Focus on:

- Authentication stability
- Role-based authorization
- Membership application workflow
- Registration/invitation workflow
- Email verification
- OTP functionality
- Password reset
- Input validation
- Error handling
- Database integrity
- Security
- API consistency
- object storage for routes which have notyet implemented like resources and research
- Testing
- Frontend/backend integration

Do not start large new features until the existing foundation is stable.
---
53. working

will be working in phases and each and of phase return final report

> NOTE ALL SECRET FOR EMAIL HAVE BEEN PROVIDED IN .ENV FILE
