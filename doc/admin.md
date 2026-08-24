# PHASE 7 — ADMIN DASHBOARD REVIEW, REFACTOR & REQUIREMENTS ALIGNMENT

## Objective

The Admin Dashboard already exists in the repository.

DO NOT rebuild the dashboard from scratch.

Your task is to:

1. Thoroughly inspect the existing Admin Dashboard.
2. Inspect the current backend APIs, models, schemas, RBAC, and application workflow.
3. Compare the existing dashboard behavior with the CURRENT project requirements.
4. Identify outdated, incorrect, missing, duplicated, or insecure functionality.
5. Modify the existing dashboard to correctly work with the current backend.
6. Keep the existing design where it is good, but change UI/UX where the current requirements demand it.
7. Do not invent backend behavior that does not exist.
8. If an API required by the dashboard is missing or inconsistent, document it clearly and make the smallest necessary backend adjustment only when appropriate.

This is a serious production-oriented project. Prioritize correctness, security, maintainability, and consistency over quickly adding features.

---

# 1. CURRENT PROJECT ARCHITECTURE

The platform uses:

- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- React
- Tailwind CSS
- Docker
- JWT Authentication
- OAuth2 Password Flow
- Role-Based Access Control

Current roles:

- `super_admin`
- `editor`
- `member`
- `user`

IMPORTANT:

`Users` and `Members` are different concepts.

### User

A User represents an authenticated account.

### Member

A Member represents someone who has officially joined the Hub.

A person can therefore exist as a User without necessarily being a Member.

---

# 2. ROLE RESPONSIBILITIES

## SUPER ADMIN

`super_admin` is the highest-level administrative role.

The Super Admin has overall control of the platform.

The Super Admin should be able to:

- View users
- View individual users
- Update users
- Delete users
- Change user roles
- Add/remove roles
- Promote a user to `editor`
- Demote an editor
- Manage members
- Approve/reject membership applications
- Manage subgroups
- Assign subgroup leaders
- Manage projects
- Manage research
- Manage blog posts
- Manage categories
- Manage events
- Manage resources
- Manage contact messages
- Manage site configuration where supported
- Manage uploaded media where supported
- View platform statistics
- Moderate platform content
- Access all administrative functionality

The dashboard must treat `super_admin` as the highest authority.

---



# 5. MEMBERSHIP APPLICATION FLOW

The current membership flow is important.

Do NOT design the dashboard around the old assumption that administrators manually create users.

The intended flow is:

### Step 1 — Applicant

A person visits:

`Join Us`

They submit a membership application.

The application contains information such as:

- First name
- Last name
- Registration number
- Programme
- Year
- Email
- Phone
- Motivation

The applicant does NOT select a subgroup during the application.

---

### Step 2 — Application Status

The application starts as:

`pending`

The Super Admin reviews the application.

The Super Admin can:

- Approve
- Reject

---

### Step 3 — Approved Application

If approved:

The system should eventually send the applicant an email/invitation.

The email should contain a secure registration process/link.

The applicant completes account registration.

---

### Step 4 — Account Creation

After completing registration:

The applicant becomes an authenticated `User`.

They should initially receive the appropriate normal-user state according to the current registration design.

---

### Step 5 — Membership

The person then completes the remaining membership setup and chooses a subgroup.

After successfully becoming an official Hub member:

- A `Member` record is created.
- The `Member.user_id` points to the User.
- The `Member.subgroup_id` points to the selected SubGroup.
- The person receives the `member` role.

IMPORTANT:

Do not create a Member record simply because someone created a User account.

User != Member.

---

# 6. CRITICAL ADMIN DASHBOARD CHANGE

The existing dashboard currently allows an administrator to create users.

THIS MUST BE REVIEWED AND REMOVED.

The dashboard should NOT provide:

> Create User

as a normal administrative workflow.

Instead, the dashboard should provide:

### Applications

Admin can:

- View pending applications
- View application details
- Approve application
- Reject application
- View application status
- View reviewer
- View application date
- Search applications
- Filter by status
- Sort applications
- Open individual application details

The membership application workflow is responsible for bringing new people into the platform.

Do not bypass this workflow by allowing admins to arbitrarily create users.

---

# 7. USER MANAGEMENT

Redesign/review the current User Management section.

Super Admin should be able to:

### View Users

Display:

- Name
- Username
- Email
- Account status
- Roles
- Member status
- Created date

Provide:

- Search
- Pagination
- Sorting
- Filtering by role
- Filtering by active/inactive status
- Filtering by member/non-member

---

## Individual User

When opening a user:

Display:

- Personal information
- Email
- Phone
- Username
- Account status
- Roles
- Member information
- Subgroup
- Position
- Joined date
- Profile links where available

---

# 8. ROLE MANAGEMENT

This is one of the most important dashboard features.

Super Admin should be able to manage roles.

Possible actions:

- Add role
- Remove role
- Promote user
- Demote user

For example:

```text
User
 ↓
member
 ↓
editor
```
However, role changes must follow backend authorization rules.

The frontend must NEVER simply assume that a role change is permitted.

The backend must validate:

- Who is making the request
- Which role is being changed
- Whether the requesting user has permission
- Whether the operation is allowed

---
9. EDITOR MANAGEMENT

The dashboard should provide a clear way for Super Admin to manage Editors.

Example:
```
Users
 └── Role Management
       ├── Members
       ├── Editors
       └── Super Admins
 ```
 Super Admin should be able to:

Promote member/user to editor
Remove editor role
View all editors
View editor activity where supported

When an editor becomes responsible for a subgroup, the dashboard should make the relationship clear.

---
10. SUBGROUP MANAGEMENT

Inspect the existing SubGroup implementation.

Current concept:
```
SubGroup
 ├── id
 ├── name
 ├── slug
 ├── description
 ├── icon
 ├── cover_image
 ├── lead_id
 ├── created_at
 └── updated_at

 ```
 The dashboard should allow authorized administrators to:

- Create subgroup
- Update subgroup
- Delete subgroup
- View subgroup
- View subgroup members
- Assign/change subgroup leader
- Remove subgroup leader

IMPORTANT:

Do not confuse:

> Role = editor

with
> SubGroup leader

They are related concepts but should remain separate database responsibilities.

If the project requirement is that Editors act as subgroup leaders, enforce that relationship explicitly instead of assuming every editor automatically leads a subgroup.

---
11. MEMBER MANAGEMENT

The dashboard should provide:

Member List

Display:

- Name
- avatar
- Subgroup
- Position
- GitHub
- LinkedIn
- Portfolio
- Joined date
- Profile visibility

Provide:

- Search
- Pagination
- Sorting
- Subgroup filtering

---
Individual Member

Display the complete member profile.

Admin should be able to:

- View member
- Update member information where permitted
- Change subgroup
- Update position
- Change profile visibility
- Remove membership

IMPORTANT:

Removing membership should NOT automatically mean deleting the User account.

These are separate concepts.

Example:
```
User
  |
  └── Member
```
Removing the Member record means:
```
User remains
Member removed
```
Deleting the User is a separate and much more destructive operation.
> NOTE: DELETING MEMBER IS REMOVING MEMBER FROM SUBGROUP BUT DELETING USER IS REMOVING THE INTER RECORD OF THAT USER INCLUDE ROLES AND DATA AND ADMIN SHOULD HAVE ABLITY OF DELETING USER

---
12. CONTENT MANAGEMENT

Inspect all existing content-management sections and make sure they match the current backend.

The dashboard should provide appropriate management for:

Projects
- Create
- Read
- Update
- Delete
- Search
- Filter
- View project members
- Manage project status
- Manage technologies where supported

Research
- Create
- Read
- Update
- Delete
- Search
- Filter
- Manage authors
- Manage publication information

Blog
- Create
- Read
- Update
- Delete
- Draft/published status
- Categories
- Search
- Filtering
- Sorting

Events
- Create
- Read
- Update
- Delete
- Status management
- Event information
Resources
- Create
- Read
- Update
- Delete
- Search
- Filtering
- Resource type management
- File/external link handling

---
13. CATEGORY MANAGEMENT

Inspect the existing Blog Category implementation.

Categories are not created automatically when creating a blog post.

The dashboard should provide a separate:

>Categories

management section.

Authorized super_admins should be able to:

- View categories
- Create category
- Rename category
- Delete category

When creating a blog post:
```
Create Blog Post
      |
      └── Select existing categories
```
Do not force blog authors to manually type arbitrary category names for every post.
---
14. DASHBOARD OVERVIEW

The main dashboard should provide useful statistics.

At minimum inspect whether we can display:

```
Total Users
Total Members
Total Editors
Pending Applications
Total Subgroups
Total Projects
Total Research
Total Blog Posts
Total Events
Total Resources
```
Do not create fake statistics.

Only display information that can be retrieved from the backend.

If an API is missing, document it and determine whether it should be added.

---
15. APPLICATION DASHBOARD

Create a dedicated application-management interface.

Example:
```
Applications

Pending       12
Approved      45
Rejected       8
```
Provide:

- Search
- Status filter
- Date sorting
- Application detail page
- Approve action
- Reject action

Approval/rejection should require confirmation.

Example:
```
Approve Application?

This will allow the applicant to continue registration.

[Cancel] [Approve]
```
For rejection:
```
Reject Application?

[Cancel] [Reject]
```
If rejection reasons are supported by the backend, display/collect them.

Do not invent a rejection field if the backend does not currently support it.
---
16. SECURITY REQUIREMENTS

This dashboard handles sensitive administrative operations.

Follow these rules:

- Never trust frontend authorization.

The frontend should hide unavailable actions for UX, but backend RBAC must enforce permissions.

- Never store passwords in frontend state unnecessarily.
- Never expose JWT secrets.
- Never expose database credentials.
- Do not allow role manipulation through arbitrary request payloads without backend validation.

Confirm destructive operations.

Examples:

- Delete user
- Delete member
- Delete project
- Delete research
- Delete blog
- Delete event
- Delete resource
- Remove role
---
17. UI/UX REQUIREMENTS

Keep the existing dashboard design where it is good.

Do not redesign everything unnecessarily.

Improve:
- Navigation
- Sidebar organization
- Tables
- Search
- Filters
- Pagination
- Loading states
- Empty states
- Error states
- Confirmation dialogs
- Form validation
- Responsive behavior
- Mobile usability

Use consistent components.
Avoid duplicating UI logic for every module.

For example, create reusable:
```
DataTable
Pagination
SearchBar
Filter
ConfirmDialog
LoadingState
EmptyState
ErrorState
Modal
Form
```
---
18. API INTEGRATION

Inspect every API call currently used by the Admin Dashboard.

Verify:

- HTTP method
- URL
- Request body
- Query parameters
- Authentication
- Authorization
- Response format
- Error handling

Do not assume the frontend API contract is correct.

Compare it directly against the FastAPI backend.

Fix mismatches.
---
19. ERROR HANDLING

The dashboard must correctly handle:
```
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```
For example:

401

Redirect to login or refresh authentication appropriately.

403

Display:
You do not have permission to perform this action.

422

Display validation errors next to the relevant form fields.

Do not simply display raw backend errors everywhere.

---
20. BASED UI

super admin
```
Dashboard
Applications
Users
Members
Subgroups
Projects
Research
Blog
Categories
Events
Resources
Settings
Activity
```
---
21. DO NOT BREAK EXISTING FUNCTIONALITY

Before modifying anything:

Inspect current implementation.
Understand existing API contracts.
Identify dependencies.
Identify current working functionality.
Make changes incrementally.

Do not rewrite working modules without a reason.

After modifications:

Run frontend build
Run backend tests
Test authentication
Test authorization
Test every changed API
Test CRUD operations
Test role restrictions
Test application approval/rejection
Test user/member separation

---
22. REQUIRED FINAL REPORT

After completing Phase 4, provide a report containing:

A. Existing Dashboard

What already existed.

B. Problems Found

List every issue discovered.

C. Changes Made

List every modification.

D. Backend Changes

Clearly list any backend changes required for dashboard functionality.

E. Remaining Issues

List anything that cannot safely be completed because the backend/API is missing functionality.

F. Verification

Report:

Build status
API integration status
Authentication status
RBAC status
CRUD status
Application workflow status
Responsive UI status

---
MOST IMPORTANT RULE

Do not treat the old Admin Dashboard as the source of truth.

The CURRENT backend architecture, role system, membership workflow, and project requirements are the source of truth.

The existing dashboard is only an implementation that must be inspected and brought into alignment.

Do not create shortcuts just to make the UI appear functional.

The final dashboard must represent the actual system architecture.

>THE ONE TO CONTROL DASHBOARD IS SUPER ADMIN AND NOT ANY OTHER ROLE