Issue: Configure File Storage Service

Description

Implement a centralized file storage service responsible for handling all uploaded files across the AI Hub Platform.

The system should provide a reusable storage layer that can support different file types and be easily migrated from local storage (development) to cloud object storage (production), such as Amazon S3 or Google Cloud Storage.

This service will be used by multiple modules including:

User profile avatars
Project thumbnails
Blog featured images
Event cover images
Research documents
Resources uploads
Organization logos

Goals

Implement a storage abstraction layer that provides:

File upload
File validation
Unique filename generation
File metadata management
File deletion
File URL generation
Local storage support for development
Future compatibility with cloud storage providers

Current Storage Strategy
Development Environment

Use local filesystem storage:

```
backend/

├── uploads/
│
├── profile_pictures/
│
├── project_thumbnails/
│
├── blog_covers/
│
├── event_images/
│
├── research_files/
│
└── resources/
```

Uploaded files should NOT be tracked by Git

.gitignore

```
uploads/*
```

Only folder structure should be maintained.

Database Integration

Use existing Media Library table:

| Column      | Description       |
| ----------- | ----------------- |
| id          | Primary key       |
| filename    | Stored filename   |
| path        | Storage path      |
| mime_type   | File type         |
| size        | File size         |
| uploaded_by | User who uploaded |
| created_at  | Upload timestamp  |

```
User Upload
      |
      |
      v

FastAPI Endpoint

      |
      |
      v

File Storage Service

      |
      |
      ├── Validate file
      |
      ├── Generate unique filename
      |
      ├── Save file
      |
      └── Return file metadata

      |
      |
      v

Media Table

      |
      |
      v

Associated Entity

(User / Project / Blog / Event)
```
Required Components

1. Storage Service

Create:
```
backend/app/services/storage.py
```
These are exactly the kinds of questions that come up when you're building a real application. Let's tackle them one by one.

1. Should the API return the image or just the URL?

Return the URL.

For example:

{
    "id": 1,
    "username": "Alfred",
    "profile_picture": "/uploads/profile_pictures/2a3e6066-24d6-4220-a503-69b3da7acb34.jpg"
}

or even better:

{
    "id": 1,
    "username": "Alfred",
    "profile_picture": "http://localhost:8000/uploads/profile_pictures/2a3e6066-24d6-4220-a503-69b3da7acb34.jpg"
}

Then the frontend simply does:

<img src="http://localhost:8000/uploads/profile_pictures/2a3e6066-24d6-4220-a503-69b3da7acb34.jpg">

The browser automatically makes another request for that URL. That's exactly how browsers are designed to work.

2. Should all images go into one root folder?

Yes. That's a common approach.

For example:

uploads/
│
├── profile_pictures/
├── project_thumbnails/
├── blog_covers/
├── organization_logos/
├── event_posters/
├── documents/
└── videos/

Everything lives under one uploads/ directory, but each feature has its own subfolder.

This keeps things organized and makes backups and cleanup much easier.

3. Should uploads/ be committed to Git?

No. This is the industry standard.

Your .gitignore should include:

uploads/*
!uploads/.gitkeep

Here's why:

Imagine you and three teammates are testing.

You upload:

profile1.jpg
profile2.jpg

Your friend uploads:

cat.jpg
dog.jpg

Another teammate uploads:

logo.png

If those files are tracked by Git:

git status

modified:
uploads/profile_pictures/...
uploads/project_thumbnails/...
uploads/blog_covers/...

Soon your repository becomes full of random test images.

Every git pull downloads them.

Every merge has unnecessary file changes.

Your Git history grows with files that aren't source code.

That's not what Git is for.

4. But if we ignore uploads/, won't the folder disappear?

Good question.

Git doesn't track empty directories.

The usual solution is:

uploads/

    .gitkeep

    profile_pictures/

        .gitkeep

    project_thumbnails/

        .gitkeep

Then your .gitignore looks like:

uploads/*
!uploads/.gitkeep

uploads/profile_pictures/*
!uploads/profile_pictures/.gitkeep

uploads/project_thumbnails/*
!uploads/project_thumbnails/.gitkeep

The .gitkeep files keep the folder structure in the repository while ignoring the uploaded files.

5. What happens in production?

Your production server has its own uploads/ directory.

When users upload images:

Production Server

uploads/

    profile_pictures/

    blog_covers/

    project_thumbnails/

Those files live on the server, not in GitHub.

When you deploy a new version of the code:

Git updates your application code.
Existing uploaded files remain untouched.

Later, when you move to S3 or another object storage service, you won't even have a local uploads/ folder for production.

This is the exact structure I would use for AI Hub
ai_hub/

├── app/
├── uploads/
│   ├── .gitkeep
│   ├── profile_pictures/
│   │   └── .gitkeep
│   ├── project_thumbnails/
│   │   └── .gitkeep
│   ├── blog_covers/
│   │   └── .gitkeep
│   ├── organization_logos/
│   │   └── .gitkeep
│   ├── documents/
│   │   └── .gitkeep
│   └── videos/
│       └── .gitkeep
├── .gitignore
└── ...

This is clean, scalable, and easy for every team member to understand.

I also want to point out something you've probably noticed yourself. Today we haven't really been learning "image uploads." We've actually been learning a much broader concept: storage abstraction.

Right now your storage implementation is:

FastAPI
        │
        ▼
uploads/

In a few weeks, you'll be able to replace it with:

FastAPI
        │
        ▼
S3

and almost none of your routers or CRUD code will change. Only the storage layer (file_handler.py or whatever we eventually rename it to) will need a different implementation. That's one of the key ideas behind writing maintainable backend systems, and it's exactly why we're separating responsibilities from the beginning.

okay now I want to create issue to configure file storage service for our project

🗄 Database Design

The AI Hub Platform uses PostgreSQL as its primary database with SQLAlchemy 2.0 as the ORM and Alembic for schema migrations.

The database is designed around a modular architecture, allowing new features to be added without requiring major structural changes.

Design Principles

The database follows these principles:

Normalize data where appropriate
Avoid duplicate information
Use junction tables for many-to-many relationships
Keep business logic outside the database
Support future expansion (AI, Notifications, Analytics)
Prefer UUID/BigInt IDs (final decision during implementation)
Use timestamps on all major entities
Authentication Module
Users

Stores all authenticated users.

Column	Description
id	Primary Key
first_name	User first name
last_name	User last name
email	Unique email
password_hash	Hashed password
phone	Phone number
avatar	Profile image
bio	Short biography
is_active	Account status
created_at	Created timestamp
updated_at	Updated timestamp
Roles

Stores system roles.

Examples:

Admin
Editor
member
Column
id
name
description
User Roles

Many-to-Many relationship between users and roles.

Column
user_id
role_id
Club Module
Subgroups

Represents the club's technical groups.

Examples:

Artificial Intelligence
Signal Processing
Web Development
Embedded Systems
Column
id
name
slug
description
icon
cover_image
lead_id
created_at
updated_at
Members

Public member directory.

Column
id
user_id
subgroup_id
position
github
linkedin
portfolio
show_profile
joined_at
Projects Module
Projects

Stores all club projects.

Column
id
title
slug
summary
description
status
thumbnail
github_url
demo_url
featured
subgroup_id
created_by
created_at
updated_at
Project Members

Many members can participate in multiple projects.

Column
project_id
member_id
Technologies

Stores technologies used across projects.

Examples:

Python
React
Docker
Arduino
TensorFlow
Column
id
name
icon
Project Technologies

Many-to-Many relationship.

Column
project_id
technology_id
Research Module
Research

Stores publications and research outputs.

Column
id
title
slug
abstract
content
publication_date
pdf_url
created_by
featured
created_at
updated_at
Research Authors

Many-to-Many relationship.

Column
research_id
member_id
author_order
Blog Module
Blog Posts
Column
id
title
slug
excerpt
content
featured_image
status
published_at
author_id
created_at
updated_at
Categories

Examples:

News
Tutorials
Research
Events
Member Spotlight
Column
id
name
slug
Blog Categories

Many-to-Many relationship.

Column
blog_id
category_id
Events Module
Events
Column
id
title
description
location
event_date
registration_link
cover_image
status
created_by
created_at
updated_at
Resources Module
Resources
Column
id
title
description
type
file_url
external_url
subgroup_id
uploaded_by
created_at

Resource Types:

PDF
Presentation
Dataset
Video
External Link
Join Applications
Applications

Stores membership applications.

Column
id
first_name
last_name
registration_number
programme
year
email
phone
motivation
subgroup_id
status
reviewed_by
created_at

Application Status:

Pending
Approved
Rejected
Contact Module
Contact Messages
Column
id
name
email
subject
message
status
created_at
Website Configuration
Site Settings

Allows administrators to modify website content without changing code.

Examples:

Hero Title
Hero Subtitle
Mission
Vision
Contact Email
Social Media Links
Column
key
value
Media Library
Media

Centralized storage for uploaded files.

Column
id
filename
path
mime_type
size
uploaded_by
created_at
Activity Logs
Activity Logs

Tracks important system actions.

Examples:

User Login
Project Created
Blog Updated
Resource Deleted
Column
id
user_id
action
entity
entity_id
ip_address
created_at
MVP 2 Database Extensions

The following tables are intentionally excluded from MVP 1.

AI Assistant
Chatbot Documents

Stores indexed documents for Retrieval-Augmented Generation (RAG).

id
source
content
embedding
Chat Conversations

Stores conversation history.

id
session_id
question
answer
created_at
Notifications

Stores in-app notifications.

id
user_id
title
message
is_read
created_at
Newsletter Subscribers

Stores newsletter subscriptions.

id
email
subscribed_at
Event Registrations

Stores event attendance.

id
event_id
user_id
status
Comments

Supports blog comments.

id
blog_id
user_id
content
created_at
Entity Relationship Overview
Users
│
├── User Roles
│      └── Roles
│
├── Members
│      └── Subgroups
│
├── Projects
│      ├── Technologies
│      └── Project Members
│
├── Blog Posts
│      └── Categories
│
├── Research
│      └── Research Authors
│
├── Events
│
├── Resources
│
├── Applications
│
├── Contact Messages
│
└── Activity Logs

Migration Strategy

The database will evolve incrementally throughout development.

Instead of creating every table at once, each feature introduces its own migration.

Example progression:

Phase 1
Users
Roles
User Roles
Phase 2
Subgroups
Members
Phase 3
Projects
Technologies
Project Members
Project Technologies
Phase 4
Research
Blog
Categories
Events
Resources
Applications
Contact Messages
Media
Site Settings
Activity Logs

This migration strategy keeps the project maintainable, minimizes migration conflicts, and allows the database to grow alongside the application.

db plan and

AI Hub & Signal Processing Club Platform

Empowering innovation through Artificial Intelligence, Research, and Technology at Mbeya University of Science and Technology (MUST).

Overview

The AI Hub & Signal Processing Club Platform is the official web platform for the AI Hub & Signal Processing Club at Mbeya University of Science and Technology (MUST).

The platform is designed to provide a modern digital experience for students, researchers, industry partners, and the public by showcasing the club's activities, research, projects, events, learning resources, and community.

Beyond being a website, this project serves as a complete web application featuring a custom administration system, authentication, and an AI-powered assistant capable of answering questions using the club's own knowledge base.

Key Features
Public Website
Modern responsive design
Home page with club highlights
About the club
Technical sub-groups
Research showcase
Projects portfolio
Events
Blog & News
Learning resources
Members directory
Join Us application
Contact page
Authentication
Secure login
JWT Authentication
Role-based authorization
Protected routes
Session management
Admin Dashboard

Authorized administrators can manage:

Blog posts
Events
Projects
Research
Members
Resources
Applications
Contact messages
Homepage content
AI Assistant

The platform includes an AI-powered assistant capable of:

Answering club-related questions
Guiding new members
Searching club resources
Recommending projects
Explaining research activities
Providing quick access to information using Retrieval-Augmented Generation (RAG)
Architecture

The application follows a modern full-stack architecture.

                React Frontend
                       │
                 REST API
                       │
                FastAPI Backend
                       │
      ┌───────────────┴───────────────┐
      │                               │
 PostgreSQL                     Redis Cache
      │                               │
 Alembic Migrations          Background Tasks

Technology Stack
Frontend
React
Tailwind CSS
React Router
Axios
TanStack Query
React Hook Form
Zod
Framer Motion
Backend
FastAPI
SQLAlchemy 2.0
PostgreSQL
Alembic
Pydantic
JWT Authentication
Redis
DevOps
Docker
Docker Compose
Git
GitHub
AI
Retrieval-Augmented Generation (RAG)
Vector Search
Large Language Model Integration
Project Structure
aihub-platform/

├── frontend/
│
├── backend/
│
├── docker/
│
├── docs/
│
├── scripts/
│
├── .github/
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md

Project Goals

The platform aims to:

Showcase club achievements
Promote research activities
Encourage student participation
Support collaboration with external partners
Provide a centralized knowledge hub
Demonstrate modern AI technologies
Deliver an intuitive experience across desktop and mobile devices
Security

The platform is designed with security in mind.

JWT Authentication
Password hashing
Input validation
Role-based access control
Secure API endpoints
Environment-based configuration
HTTPS-ready deployment
Responsive Design

The application is designed using a mobile-first approach to ensure an excellent experience on:

Mobile devices
Tablets
Laptops
Desktop computers
Performance

Performance considerations include:

Optimized API responses
Lazy loading
Efficient database queries
Image optimization
Redis caching
Dockerized deployment
Contributing

Contributions are welcome.

Please open an issue before submitting major changes so discussions can take place before implementation.

License

This project is licensed under the MIT License.

Development Team

Developed for the AI Hub & Signal Processing Club
Mbeya University of Science and Technology (MUST)

Building technology that creates impact through Artificial Intelligence and Signal Processing.

Good. Since you already have the database design with a Media Library, the issue should not just be "add image upload". We should create it as a proper File Storage Service because many modules will depend on it.

For GitHub issue, I would write it like this:

Issue: Configure File Storage Service
Description

Implement a centralized file storage service responsible for handling all uploaded files across the AI Hub Platform.

The system should provide a reusable storage layer that can support different file types and be easily migrated from local storage (development) to cloud object storage (production), such as Amazon S3 or Google Cloud Storage.

This service will be used by multiple modules including:

User profile avatars
Project thumbnails
Blog featured images
Event cover images
Research documents
Resources uploads
Organization logos
Goals

Implement a storage abstraction layer that provides:

File upload
File validation
Unique filename generation
File metadata management
File deletion
File URL generation
Local storage support for development
Future compatibility with cloud storage providers
Current Storage Strategy
Development Environment

Use local filesystem storage:

backend/

├── uploads/
│
├── profile_pictures/
│
├── project_thumbnails/
│
├── blog_covers/
│
├── event_images/
│
├── research_files/
│
└── resources/

Uploaded files should NOT be tracked by Git.

.gitignore

uploads/*

Only folder structure should be maintained.

Database Integration

Use existing Media Library table:

Media
Column	Description
id	Primary key
filename	Stored filename
path	Storage path
mime_type	File type
size	File size
uploaded_by	User who uploaded
created_at	Upload timestamp
File Storage Flow
User Upload
      |
      |
      v

FastAPI Endpoint

      |
      |
      v

File Storage Service

      |
      |
      ├── Validate file
      |
      ├── Generate unique filename
      |
      ├── Save file
      |
      └── Return file metadata

      |
      |
      v

Media Table

      |
      |
      v

Associated Entity

(User / Project / Blog / Event)
Required Components
1. Storage Service

Create:

backend/app/services/storage.py

Responsibilities:

Save files
Delete files
Generate URLs
Handle storage paths

Example:

```
save_file(
    file,
    folder="project_thumbnails"
)
```
Returns:
```
{
    "filename": "uuid-image.png",
    "path": "uploads/project_thumbnails/uuid-image.png",
    "size": 204800,
    "mime_type": "image/png"
}
```
2. File Validation

Support:

Images
```
image/jpeg
image/png
image/webp

```
Documents
```
application/pdf
application/msword
```
Videos
```
video/mp4
video/webm
```

Validation should include:

Allowed MIME types
Maximum file size
Empty file checking

3. Unique Filename Generation

Prevent filename conflicts.

Example:

Original:
```
profile.jpg
```
Stored:
```
8f72c9d4-2b1a-43d2.jpg
```
Use UUID generation.

4. Media Model

Create SQLAlchemy model:

```
Media

id
filename
path
mime_type
size
uploaded_by
created_at
```
5. API Endpoints
Upload File
```
POST /media/upload
```
Request:
```
multipart/form-data
file=image.png
```

Response:

```
{
 "id":1,
 "filename":"abc123.png",
 "url":"/uploads/project_thumbnails/abc123.png"
}
```
Delete File
```
DELETE /media/{media_id}
```
Should:

Remove file from storage.
Remove database record.

Get Media
```
GET /media/{media_id}
```
reteurn
```
{
"id":1,
"url":"/uploads/profile/avatar.png"
}
```
Integration Examples
User Avatar
Users table:
```
avatar -> media.id
```
Project Thumbnail

Projects table:
```
thumbnail -> media.id
```
Blog Image

Blog Posts:
```
featured_image -> media.id
```
Future Improvements

Not part of MVP:

AWS S3 integration
Google Cloud Storage integration
Image compression
Automatic resizing
Thumbnail generation
CDN support
Virus scanning
Background processing

Acceptance Criteria
 Files can be uploaded successfully
 Files receive unique names
 Invalid file types are rejected
 Maximum file size is enforced
 Media records are stored in PostgreSQL
 Files can be retrieved through URLs
 Files can be deleted safely
 Upload folder is ignored by Git
 Storage logic is separated from business logic

 Priority

High

Labels
```

backend
storage
feature
database
```
current DB plan has columns like
```
Users.avatar
Projects.thumbnail
Blog.featured_image
Events.cover_image
```
When  implement this, consider changing those later into:
```
avatar_id
thumbnail_id
featured_image_id
cover_image_id
```
pointing to the Media table.

