# Phase 3 — Part C: Authentication & Onboarding Forms
Objective

Build and integrate the core authentication and onboarding forms for the AI & Signal Processing Hub public website.

These forms are critical infrastructure because they establish the user's journey from a visitor → applicant → approved member → authenticated platform user.

Do not treat these as simple frontend forms. They must be implemented according to the existing backend authentication, application, JWT, OTP, and membership architecture.

Before writing code, inspect the existing backend API, schemas, authentication flow, endpoints, request/response models, validation rules, and current frontend structure.

Important Rule

Do not modify backend behavior just to make the frontend easier to implement.

The frontend must adapt to the existing backend API.

If you discover that an API is incomplete or inconsistent with the current project architecture, document it first and only make changes if they are necessary and clearly justified.
---
1. Existing Authentication Architecture

The project uses:

FastAPI
PostgreSQL
SQLAlchemy
JWT authentication
OAuth2 Password Flow
Role-Based Access Control
OTP/email-based onboarding
Users
Roles
User Roles
Members
Applications

The important distinction is:
```
User
   │
   ├── Roles
   │      ├── user
   │      ├── member
   │      ├── editor
   │      └── super_admin
   │
   └── Member profile
          │
          └── Subgroup
```
The public website must respect this architecture.

A visitor should not automatically become a member simply because they register.

The expected onboarding flow is:
```

Visitor
   │
   ▼
Join Us
   │
   ▼
Submit Application
   │
   ▼
Application = Pending
   │
   ▼
Super Admin Reviews
   │
   ├── Rejected
   │      └── Applicant notified
   │
   └── Approved
          │
          ▼
       Email / OTP
          │
          ▼
       Registration
          │
          ▼
       Account created
          │
          ▼
       Member role assigned
          │
          ▼
       Complete Member Profile
          │
          ▼
       Select Subgroup
          │
          ▼
       Member account ready
```
Do not redesign this flow 
---
2. Form 1 — Join / Onboarding Application

The Join Us page already contains the application form.

Build the frontend form according to the existing Application schema.

Expected information includes:
```  
First Name
Last Name
Registration Number
Programme
Year
Email
Phone
Motivation
```
Important

The applicant should not select a subgroup during the initial application.

Subgroup selection happens later during member onboarding after the application has been approved.

UX Requirements

Implement:

Clear field labels
Required/optional indicators
Inline validation
Proper input types
Email validation
Phone validation
Registration number validation
Year validation
Motivation character guidance
Loading state
Disabled submit button while submitting
Success state
Error state
API validation error display
Prevent duplicate submissions

Example flow:
```
Fill Form
    ↓
Submit
    ↓
Loading
    ↓
API request
    ↓
Success
    ↓
"Application submitted successfully"
```
----  
3. Form 2 — Login

Build the login form according to the existing backend login endpoint.

The form should support the project's existing authentication mechanism.

Fields:
```
Email they cannot user user name to login
Password
```
Depending on the existing API contract, use the exact expected field names.
```
User enters credentials
        ↓
POST /login
        ↓
Backend validates credentials
        ↓
JWT returned
        ↓
Frontend stores authentication state
        ↓
User authenticated
        ↓
Redirect appropriately
```
UX Requirements

Include:

Password visibility toggle
Validation
Loading state
Disabled submit button
Invalid credentials error
Network error handling
Successful login state
Forgot password link
Appropriate redirect after login

Do not expose:

JWT contents
Secret keys
Backend stack traces
Database errors
---
4. Form 3 — Forgot Password / OTP Request

Build the first step of password recovery.

The user should provide the information required by the existing backend password recovery API.

Typically:
>emil
flow
```
Forgot Password
       ↓
Enter Email
       ↓
Request OTP
       ↓
Backend sends OTP
       ↓
Show OTP verification interface
```
UX Requirements

Include:
Email validation
Loading state
Success state
Error state
Resend OTP option
Resend cooldown timer
Prevent excessive requests
Clear user feedback

example
```
Didn't receive the code?

Resend code in 45s
```
After the cooldown:
>Resend OTP

Do not allow unlimited OTP requests.

Follow the backend's actual OTP policy if one already exists.
---
5. Form 4 — Change / Reset Password

Build the password reset/change interface according to the backend API.

Expected flow:
```
Email
   ↓
OTP
   ↓
Verify OTP
   ↓
New Password
   ↓
Confirm Password
   ↓
Password Reset
```
Password Requirements

Display the actual password requirements enforced it

For example:
```
Password must contain:
✓ Minimum length
✓ Uppercase letter
✓ Lowercase letter
✓ Number
✓ Special character
```

UX

Include:
Password visibility toggle
Confirm password matching
Password strength feedback where appropriate
Validation
Loading state
Error state
Success state
Redirect to login after successful reset
---
6. Registration After Application Approval

This is especially important.

The registration form must follow the project's approved application → OTP → account registration architecture.

The frontend must not provide an unrestricted public registration experience if the backend requires an approved application.

Expected flow:
```
Application Approved
        ↓
Applicant receives email
        ↓
Applicant opens registration link
        ↓
OTP / invitation verification
        ↓
Registration form
        ↓
Account created
        ↓
Member role assigned
        ↓
Complete member profile
```
Inspect the backend carefully and implement the actual flow.

If the backend currently has a security gap where registration can happen without validating the approval/OTP process, do not hide that problem in the frontend.

Document it clearly.
> NOTE WHAT I WANT AFTER USER TO BE APPROVED HE SHOULD RECEIVE THE LINK WHICH WHEN CLICKS IT SHOULD FIND THIS FORM THE OTP AND EMAIL SHOULD BE ALREADY AUTO FILL AND USER SHOULD NOT SEE THOSE FILLED SHOULD ONLY SEE OTHER FILLED FOR ONBOARD APPLICATION
---
7. Authentication State

Create a clean frontend authentication mechanism.

Avoid scattering authentication logic across components.

Create reusable functionality for:
```
login
logout
isAuthenticated
currentUser
token handling
protected routes
role checks
```
For example:
```
AuthContext
AuthProvider
useAuth()
ProtectedRoute
```

---
8.Role-Aware Frontend Behavior
The frontend should understand the user's role without replacing backend authorization.

Example:
```
   user
    ↓
basic authenticated features

member
    ↓
member features

editor
    ↓
editor/content management features

super_admin
    ↓
administrative features
```
Critical Security Rule

Frontend role checks are UX controls only.

Never rely on:
```
if (user.role === "super_admin")
```
as the actual security mechanism.

The backend remains responsible for authorization.
---
API Integration Rules

Before implementing every form:

Step 1

Inspect the backend route.

Step 2

Inspect the request schema.

Step 3

Inspect the response schema.

Step 4

Inspect authentication requirements.

Step 5

Inspect expected error responses.

Step 6

Implement the frontend against the real API.

Do not invent:
```
endpoint URLs
field names
response structures
authentication headers
OTP formats
```
---
11. Error Handling

Create a consistent error handling system.

Handle:
```
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
429 Too Many Requests
500 Server Error
Network failure
```
Users should receive human-readable messages.

For example:

Instead of:
>422 Unprocessable Entity
SHOW
>Please check the information you entered.

For authentication:
>Incorrect email or password.

For application:
> We couldn't submit your application. Please check your information and try again.

Do not expose internal exception messages unless they are intentionally user-safe.
---
12. Loading, Empty and Error States

Every API-driven form must have:

Loading
```
Submitting...
Verifying...
Sending code...
Resetting password...
```
Success

Provide a clear confirmation.

Error

Explain what went wrong and what the user should do.

Network failure

Example:
```
Unable to connect to the server.
Please check your connection and try again.
```
13. Accessibility

All forms must support:

Proper <label> elements
Keyboard navigation
Visible focus states
Accessible error messages
Appropriate input types
Required field indicators
Screen-reader-friendly validation
Sufficient contrast
Buttons with meaningful labels

Do not sacrifice accessibility for visual design.
---
14. Responsive Design

Every form must work correctly on:
```
Mobile
Tablet
Laptop
Desktop
Large screens
```
Pay particular attention to:

OTP inputs
Password fields
Long application forms
Error messages
Buttons
Form spacing

Mobile users should not need to zoom.
---
15. Visual Design

Follow the design system established during Phase 1.

Use:

AI Hub brand colors
Existing typography
Existing spacing system
Existing buttons
Existing input styles
Existing card styles
Existing border radius
Existing shadows

Do not introduce a completely different visual language.

The forms should feel like they belong to the same website.

Use the design references studied in Phase 2 where appropriate, particularly:

clean whitespace
strong hierarchy
restrained animation
smooth transitions
professional rather than "AI-generated" styling
---
16. Reusable Form Components

Do not duplicate form logic.

Create reusable components where appropriate:
```
FormField
Input
PasswordInput
EmailInput
PhoneInput
Select
Textarea
Checkbox
SubmitButton
FormError
SuccessMessage
OTPInput
PasswordStrength
```
Use the existing component architecture if these already exist.
---
17. Form Security

The frontend must never contain:
```
JWT secret
database credentials
SMTP credentials
OTP secret
API private keys
```

Do not hardcode sensitive configuration.

Use environment configuration for public API URLs where appropriate.
---
18. Testing

Test every form manually and through the existing development environment.

Application

Test:
```
Valid application
Missing fields
Invalid email
Invalid phone
Invalid year
Duplicate application
Server error
```
Login

Test:
```
Correct credentials
Wrong password
Unknown email
Empty fields
Expired/invalid authentication
```
OTP

Test:
```
Correct OTP
Wrong OTP
Expired OTP
Resend OTP
Cooldown
Invalid email
```
Password

Test:
```
Valid password
Weak password
Password mismatch
Invalid OTP
Expired OTP
Successful reset
```
Registration

Test:
```
Approved applicant
Unapproved applicant
Invalid OTP
Expired OTP
Duplicate email
Successful registration
```
---
19. Definition of Done

This sub-phase is complete only when:

 Join Us application form works
 Application API is connected
 Login form works
 JWT authentication works
 Forgot password flow works
 OTP request works
 OTP verification works
 Password reset works
 Approved-user registration works
 Member profile completion works
 Subgroup selection works
 Validation works
 Loading states work
 Success states work
 Error states work
 Mobile responsive
 Accessibility checked
 No secrets exposed
 No fake/mock API responses remain
 No duplicated form logic
 Existing backend API contracts are respected
 Authentication state is centralized
 Protected routes work correctly
 Role-based UI behavior works
 Backend remains the source of truth for authorization
--- 
Final Instruction

Do not rush into writing the forms.

First inspect the existing:
```
frontend/
backend/routes/
backend/services/
backend/schemas/
backend/models/
backend/core/auth/
backend/core/jwt/
backend/core/RoleAuth/
```
nderstand the actual authentication and onboarding implementation.

Then produce a short implementation plan identifying:

Existing APIs that can be used directly
APIs that are incomplete
APIs that have inconsistencies
Forms that can be implemented immediately
Backend changes that are genuinely required
Potential security problems

Only after this inspection should implementation begin.

The goal is not merely to make the forms look correct.

The goal is to make the entire:

Application → Approval →  Registration → Login → Member Profile → Subgroup

journey work correctly against the real AI Hub backend.