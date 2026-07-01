# 🗄 Database Design

The AI Hub Platform uses **PostgreSQL** as its primary database with **SQLAlchemy 2.0** as the ORM and **Alembic** for schema migrations.

The database is designed around a **modular architecture**, allowing new features to be added without requiring major structural changes.

---

# Design Principles

The database follows these principles:

- Normalize data where appropriate
- Avoid duplicate information
- Use junction tables for many-to-many relationships
- Keep business logic outside the database
- Support future expansion (AI, Notifications, Analytics)
- Prefer UUID/BigInt IDs (final decision during implementation)
- Use timestamps on all major entities

---

# Authentication Module

## Users

Stores all authenticated users.

| Column | Description |
|---------|-------------|
| id | Primary Key |
| first_name | User first name |
| last_name | User last name |
| email | Unique email |
| password_hash | Hashed password |
| phone | Phone number |
| avatar | Profile image |
| bio | Short biography |
| is_active | Account status |
| created_at | Created timestamp |
| updated_at | Updated timestamp |

---

## Roles

Stores system roles.

Examples:

- Super Admin
- Editor
- Contributor

| Column |
|---------|
| id |
| name |
| description |

---

## User Roles

Many-to-Many relationship between users and roles.

| Column |
|---------|
| user_id |
| role_id |

---

# Club Module

## Subgroups

Represents the club's technical groups.

Examples:

- Artificial Intelligence
- Signal Processing
- Web Development
- Embedded Systems

| Column |
|---------|
| id |
| name |
| slug |
| description |
| icon |
| cover_image |
| lead_id |
| created_at |
| updated_at |

---

## Members

Public member directory.

| Column |
|---------|
| id |
| user_id |
| subgroup_id |
| position |
| github |
| linkedin |
| portfolio |
| show_profile |
| joined_at |

---

# Projects Module

## Projects

Stores all club projects.

| Column |
|---------|
| id |
| title |
| slug |
| summary |
| description |
| status |
| thumbnail |
| github_url |
| demo_url |
| featured |
| subgroup_id |
| created_by |
| created_at |
| updated_at |

---

## Project Members

Many members can participate in multiple projects.

| Column |
|---------|
| project_id |
| member_id |

---

## Technologies

Stores technologies used across projects.

Examples:

- Python
- React
- Docker
- Arduino
- TensorFlow

| Column |
|---------|
| id |
| name |
| icon |

---

## Project Technologies

Many-to-Many relationship.

| Column |
|---------|
| project_id |
| technology_id |

---

# Research Module

## Research

Stores publications and research outputs.

| Column |
|---------|
| id |
| title |
| slug |
| abstract |
| content |
| publication_date |
| pdf_url |
| created_by |
| featured |
| created_at |
| updated_at |

---

## Research Authors

Many-to-Many relationship.

| Column |
|---------|
| research_id |
| member_id |
| author_order |

---

# Blog Module

## Blog Posts

| Column |
|---------|
| id |
| title |
| slug |
| excerpt |
| content |
| featured_image |
| status |
| published_at |
| author_id |
| created_at |
| updated_at |

---

## Categories

Examples:

- News
- Tutorials
- Research
- Events
- Member Spotlight

| Column |
|---------|
| id |
| name |
| slug |

---

## Blog Categories

Many-to-Many relationship.

| Column |
|---------|
| blog_id |
| category_id |

---

# Events Module

## Events

| Column |
|---------|
| id |
| title |
| description |
| location |
| event_date |
| registration_link |
| cover_image |
| status |
| created_by |
| created_at |
| updated_at |

---

# Resources Module

## Resources

| Column |
|---------|
| id |
| title |
| description |
| type |
| file_url |
| external_url |
| subgroup_id |
| uploaded_by |
| created_at |

Resource Types:

- PDF
- Presentation
- Dataset
- Video
- External Link

---

# Join Applications

## Applications

Stores membership applications.

| Column |
|---------|
| id |
| first_name |
| last_name |
| registration_number |
| programme |
| year |
| email |
| phone |
| motivation |
| subgroup_id |
| status |
| reviewed_by |
| created_at |

Application Status:

- Pending
- Approved
- Rejected

---

# Contact Module

## Contact Messages

| Column |
|---------|
| id |
| name |
| email |
| subject |
| message |
| status |
| created_at |

---

# Website Configuration

## Site Settings

Allows administrators to modify website content without changing code.

Examples:

- Hero Title
- Hero Subtitle
- Mission
- Vision
- Contact Email
- Social Media Links

| Column |
|---------|
| key |
| value |

---

# Media Library

## Media

Centralized storage for uploaded files.

| Column |
|---------|
| id |
| filename |
| path |
| mime_type |
| size |
| uploaded_by |
| created_at |

---

# Activity Logs

## Activity Logs

Tracks important system actions.

Examples:

- User Login
- Project Created
- Blog Updated
- Resource Deleted

| Column |
|---------|
| id |
| user_id |
| action |
| entity |
| entity_id |
| ip_address |
| created_at |

---

# MVP 2 Database Extensions

The following tables are intentionally excluded from MVP 1.

## AI Assistant

### Chatbot Documents

Stores indexed documents for Retrieval-Augmented Generation (RAG).

- id
- source
- content
- embedding

---

### Chat Conversations

Stores conversation history.

- id
- session_id
- question
- answer
- created_at

---

# Notifications

Stores in-app notifications.

- id
- user_id
- title
- message
- is_read
- created_at

---

# Newsletter Subscribers

Stores newsletter subscriptions.

- id
- email
- subscribed_at

---

# Event Registrations

Stores event attendance.

- id
- event_id
- user_id
- status

---

# Comments

Supports blog comments.

- id
- blog_id
- user_id
- content
- created_at

---

# Entity Relationship Overview

```text
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
```

---

# Migration Strategy

The database will evolve incrementally throughout development.

Instead of creating every table at once, each feature introduces its own migration.

Example progression:

### Phase 1

- Users
- Roles
- User Roles

### Phase 2

- Subgroups
- Members

### Phase 3

- Projects
- Technologies
- Project Members
- Project Technologies

### Phase 4

- Research
- Blog
- Categories
- Events
- Resources
- Applications
- Contact Messages
- Media
- Site Settings
- Activity Logs

This migration strategy keeps the project maintainable, minimizes migration conflicts, and allows the database to grow alongside the application.