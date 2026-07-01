# AI Hub & Signal Processing Club Platform

> Empowering innovation through Artificial Intelligence, Research, and Technology at Mbeya University of Science and Technology (MUST).

![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38BDF8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

##  Overview

The **AI Hub & Signal Processing Club Platform** is the official web platform for the **AI Hub & Signal Processing Club** at **Mbeya University of Science and Technology (MUST)**.

The platform is designed to provide a modern digital experience for students, researchers, industry partners, and the public by showcasing the club's activities, research, projects, events, learning resources, and community.

Beyond being a website, this project serves as a complete web application featuring a custom administration system, authentication, and an AI-powered assistant capable of answering questions using the club's own knowledge base.

---

## Key Features

###  Public Website

- Modern responsive design
- Home page with club highlights
- About the club
- Technical sub-groups
- Research showcase
- Projects portfolio
- Events
- Blog & News
- Learning resources
- Members directory
- Join Us application
- Contact page

---

###  Authentication

- Secure login
- JWT Authentication
- Role-based authorization
- Protected routes
- Session management

---

### Admin Dashboard

Authorized administrators can manage:

- Blog posts
- Events
- Projects
- Research
- Members
- Resources
- Applications
- Contact messages
- Homepage content

---

### AI Assistant

The platform includes an AI-powered assistant capable of:

- Answering club-related questions
- Guiding new members
- Searching club resources
- Recommending projects
- Explaining research activities
- Providing quick access to information using Retrieval-Augmented Generation (RAG)

---

## Architecture

The application follows a modern full-stack architecture.

```text
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
```

---

##  Technology Stack

### Frontend

- React
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Framer Motion

### Backend

- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Alembic
- Pydantic
- JWT Authentication
- Redis

### DevOps

- Docker
- Docker Compose
- Git
- GitHub

### AI

- Retrieval-Augmented Generation (RAG)
- Vector Search
- Large Language Model Integration

---

##  Project Structure

```text
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
```

---

## Project Goals

The platform aims to:

- Showcase club achievements
- Promote research activities
- Encourage student participation
- Support collaboration with external partners
- Provide a centralized knowledge hub
- Demonstrate modern AI technologies
- Deliver an intuitive experience across desktop and mobile devices

---

##  Security

The platform is designed with security in mind.

- JWT Authentication
- Password hashing
- Input validation
- Role-based access control
- Secure API endpoints
- Environment-based configuration
- HTTPS-ready deployment

---

## Responsive Design

The application is designed using a mobile-first approach to ensure an excellent experience on:

- Mobile devices
- Tablets
- Laptops
- Desktop computers

---

##  Performance

Performance considerations include:

- Optimized API responses
- Lazy loading
- Efficient database queries
- Image optimization
- Redis caching
- Dockerized deployment

---

##  Contributing

Contributions are welcome.

Please open an issue before submitting major changes so discussions can take place before implementation.

---

##  License

This project is licensed under the MIT License.

---

##  Development Team

Developed for the **AI Hub & Signal Processing Club**
Mbeya University of Science and Technology (MUST)

Building technology that creates impact through Artificial Intelligence and Signal Processing.