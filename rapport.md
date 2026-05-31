# EduManage - School Management System

**Project Rapport Documentation**
**Version:** 1.0.0
**Date:** May 2026
**Status:** In Progress / Active Development

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Proposed Solution](#4-proposed-solution)
5. [Project Objectives](#5-project-objectives)
6. [Target Audience](#6-target-audience)
7. [System Actors & Roles](#7-system-actors--roles)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [System Architecture](#10-system-architecture)
11. [Use Case Diagram](#11-use-case-diagram)
12. [Key System Models](#12-key-system-models)
13. [Tech Stack and Design Tools](#13-tech-stack-and-design-tools)
14. [UI and UX Philosophy](#14-ui-and-ux-philosophy)
15. [Security and Privacy](#15-security-and-privacy)
16. [Business Model](#16-business-model)
17. [Development Methodology](#17-development-methodology)
18. [Team Presentation](#18-team-presentation)
19. [Challenges and Solutions](#19-challenges-and-solutions)
20. [Future Improvements](#20-future-improvements)
21. [Conclusion](#21-conclusion)
22. [References and Tools](#22-references-and-tools)

---

## 1. Executive Summary

EduManage is a comprehensive full-stack web application designed to modernize and streamline school management operations. Built with modern web technologies, the platform provides role-based access control for three primary user categories: Administrators, Teachers, and Students.

The system addresses the need for centralized school management by offering features including grade management, class scheduling, attendance tracking, announcement systems, resource sharing, and academic performance monitoring. EduManage leverages a clean, accessible interface powered by shadcn/ui components, ensuring consistency and usability across all user experience levels.

**Key Highlights:**

- **Type:** Full-stack School Management Web Application
- **Technology:** React 19 + TanStack Start, TypeScript, PostgreSQL
- **Deployment:** Live at https://edumanage.vercel.app
- **User Roles:** Administrator, Teacher, Student
- **Core Features:** Dashboard analytics, calendar management, grade/mark tracking, announcements, resource management

<!-- [COMMENT: Add financial/project investment details, ROI projections, or key success metrics if available] -->

---

## 2. Introduction

### 2.1 Project Overview

EduManage is a cloud-based school management information system (SMIS) designed to digitize and automate the administrative and academic processes of educational institutions. The platform serves as a centralized hub where school stakeholders can collaborate, communicate, and manage academic workflows efficiently.

The application is built using the TanStack Start framework, providing a robust, type-safe foundation for both client and server-side operations. It utilizes a PostgreSQL database hosted on Neon (serverless) for scalable, reliable data persistence.

### 2.2 Purpose of This Document

This rapport documents the complete specification, design, and implementation details of the EduManage system. It serves as:

- A reference for developers and project stakeholders
- Documentation for future maintenance and enhancement
- A comprehensive guide for system understanding and training

### 2.3 Scope

The EduManage system encompasses:

- User authentication and authorization across three roles
- Administrative functions for school-wide management
- Teacher tools for class, subject, and assessment management
- Student access to learning resources and academic information
- Calendar and event management
- Announcement and communication systems
- File/resource management with Cloudinary integration

---

## 3. Problem Statement

### 3.1 Current Challenges in School Management

Educational institutions face numerous operational challenges that EduManage addresses:

1. **Fragmented Data Management**
   - Student records, grades, and attendance often stored in separate systems or paper-based records
   - Difficulty in maintaining data consistency across departments
   - Time-consuming data retrieval and reporting

2. **Communication Gaps**
   - Disconnect between administrators, teachers, students, and parents
   - Announcements and updates lost in email threads or notice boards
   - Limited real-time visibility into academic progress

3. **Manual Administrative Processes**
   - Repetitive data entry tasks consuming staff time
   - Error-prone manual grade calculations and record-keeping
   - Inefficient class and schedule management

4. **Limited Access to Information**
   - Students lack self-service access to their academic records
   - Parents have minimal visibility into child performance
   - Teachers spend excessive time on administrative rather than teaching tasks

5. **Scalability Issues**
   - Paper-based systems cannot efficiently scale with student enrollment
   - Multiple classrooms and grade levels compound administrative complexity

<!-- [COMMENT: Provide specific statistics or studies on school management inefficiencies if available] -->

### 3.2 Stakeholder Pain Points

| Stakeholder | Pain Points |
|-------------|-------------|
| Administrators | Data silos, manual reporting, teacher/student management overhead |
| Teachers | Administrative burden, tracking multiple classes/subjects, grade entry complexity |
| Students | Limited access to resources, difficulty tracking assignments and performance |
| Parents | Lack of visibility into child progress, limited communication channels |

---

## 4. Proposed Solution

### 4.1 System Overview

EduManage provides a unified platform that consolidates school management functions into a single, accessible web application. The solution emphasizes:

- **Centralization:** All school data stored in one PostgreSQL database with role-based access
- **Accessibility:** Web-based interface accessible from any modern browser
- **Automation:** Reduced manual data entry through intelligent forms and workflows
- **Real-time Updates:** Instant synchronization of announcements, grades, and events

### 4.2 Core Solution Components

1. **Authentication & Authorization System**
   - Secure login with email/password
   - Social sign-in (Google, Facebook) integration via Better Auth
   - Role-based access control (RBAC) ensuring users see only relevant data

2. **Administrative Dashboard**
   - Analytics charts (Chart.js) for at-a-glance school metrics
   - Quick access to management functions
   - Event and announcement creation tools

3. **Academic Management Module**
   - Grade level configuration
   - Class and section organization
   - Subject management with coefficient tracking
   - Assessment period (term/semester) setup

4. **Teaching & Learning Tools**
   - Teacher assignment management (teacher-subject-class mapping)
   - Mark entry and grade calculation
   - Resource upload and sharing
   - Rich-text announcements via Quill editor

5. **Calendar & Event System**
   - React Big Calendar integration
   - Event categorization
   - Role-specific visibility

6. **Communication Platform**
   - Announcement system with rich-text support
   - Targeted announcements by role/class
   - Resource sharing capabilities

### 4.3 Key Differentiators

- Modern, accessible UI built on shadcn/ui design principles
- TypeScript end-to-end type safety
- Serverless architecture for scalability
- Dark/light mode support for user preference

---

## 5. Project Objectives

### 5.1 Primary Objectives

| Objective | Description | Success Metric |
|-----------|-------------|----------------|
| Centralize Data | Consolidate all school data into single database | 100% of academic data in system |
| Role-Based Access | Implement secure, role-specific dashboards | Three distinct user experiences |
| Streamline Administration | Reduce manual work for admin staff | 50%+ reduction in data entry time |
| Enhance Communication | Provide real-time announcement system | Instant delivery to relevant roles |
| Enable Self-Service | Give students access to their records | Student portal with full visibility |

### 5.2 Secondary Objectives

1. **Performance Optimization**
   - Page load time under 2 seconds
   - Smooth transitions and interactions (Framer Motion)
   - Efficient database queries via Drizzle ORM

2. **Accessibility Compliance**
   - WCAG 2.1 AA compliance target
   - Keyboard navigation support
   - Screen reader compatibility

3. **Security Hardening**
   - OWASP security best practices
   - Regular dependency updates
   - Secure session management

4. **Scalability**
   - Support for multiple grade levels and classes
   - Handle 1000+ concurrent users
   - Efficient resource handling

### 5.3 Future Objectives

<!-- [COMMENT: Define long-term roadmap objectives, potential integrations (payment gates, SMS notifications), mobile app development] -->

---

## 6. Target Audience

### 6.1 Primary Users

| User Type | Description | Estimated Volume |
|-----------|-------------|------------------|
| **Administrators** | School leadership, IT staff, registrars | 2-10 users per school |
| **Teachers** | Academic staff, subject teachers, homeroom teachers | 20-100 users per school |
| **Students** | Enrolled students | 200-2000+ per school |

### 6.2 Secondary Users

| User Type | Description | Notes |
|-----------|-------------|-------|
| **Parents** | Parents/guardians of students | Future scope - read-only student progress access |
| **School Board** | Governing body members | Future scope - reporting dashboard |

### 6.3 User Characteristics

**Administrators:**

- Technical comfort: Medium to High
- Primary device: Desktop/laptop
- Usage frequency: Daily
- Key tasks: Data management, reporting, system configuration

**Teachers:**

- Technical comfort: Medium
- Primary device: Desktop/tablet
- Usage frequency: Daily
- Key tasks: Grade entry, attendance, resource management

**Students:**

- Technical comfort: Varies (typically High)
- Primary device: Mobile/desktop
- Usage frequency: Regular (check schedules, announcements)
- Key tasks: View calendar, access resources, check grades

---

## 7. System Actors & Roles

### 7.1 Actor Definitions

| Actor | Description | Type |
|-------|-------------|------|
| **Admin** | Full system access for school operations management | Primary |
| **Teacher** | Manages classes, subjects, grades, and resources | Primary |
| **Student** | Accesses schedule, resources, and announcements | Primary |
| **System** | Automated processes, validations, notifications | Secondary |
| **Cloudinary** | External service for file/image storage | External |

### 7.2 Role Permissions Matrix

| Feature/Function | Admin | Teacher | Student |
|------------------|-------|---------|---------|
| User Authentication | ✓ | ✓ | ✓ |
| View Dashboard | ✓ | ✓ | ✓ |
| Manage Users | ✓ | ✗ | ✗ |
| Manage Grades/Classes | ✓ | ✗ | ✗ |
| Manage Subjects | ✓ | ✗ | ✗ |
| Assign Teachers | ✓ | ✗ | ✗ |
| Enter Grades/Marks | ✓ | ✓ (own classes) | ✗ |
| View Grades/Marks | ✓ | ✓ | ✓ (own) |
| Create Announcements | ✓ | ✓ | ✗ |
| View Announcements | ✓ | ✓ | ✓ |
| Manage Calendar/Events | ✓ | ✓ (limited) | ✓ (read-only) |
| Upload Resources | ✓ | ✓ | ✗ |
| Access Resources | ✓ | ✓ | ✓ |
| System Settings | ✓ | ✗ | ✗ |

### 7.3 User Flows

**Admin Flow:**
```
Login → Dashboard → [Manage Students | Manage Teachers | Manage Classes | Manage Grades | Announcements | Calendar | Settings]
```

**Teacher Flow:**
```
Login → Dashboard → [My Classes | My Subjects | Enter Marks | Create Announcement | Calendar | Resources]
```

**Student Flow:**
```
Login → Dashboard → [View Calendar | Browse Subjects | View Announcements | Access Resources | View Grades]
```

---

## 8. Functional Requirements

### 8.1 Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Users can register with email and password | Must |
| FR-002 | Users can login with email/password credentials | Must |
| FR-003 | Users can login via Google OAuth | Should |
| FR-004 | Users can login via Facebook OAuth | Should |
| FR-005 | Users can reset forgotten passwords via email | Must |
| FR-006 | Sessions persist across browser restarts | Must |
| FR-007 | Role-based redirect after login (admin/teacher/student) | Must |
| FR-008 | Unauthorized access redirects to login | Must |

### 8.2 Admin Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-101 | Admin can view analytics dashboard with charts | Must |
| FR-102 | Admin can CRUD students (with search/pagination) | Must |
| FR-103 | Admin can CRUD teachers | Must |
| FR-104 | Admin can CRUD grade levels | Must |
| FR-105 | Admin can CRUD classes/sections | Must |
| FR-106 | Admin can CRUD subjects | Must |
| FR-107 | Admin can assign teachers to subject-class combinations | Must |
| FR-108 | Admin can manage assessment periods (terms) | Must |
| FR-109 | Admin can CRUD events on calendar | Must |
| FR-110 | Admin can CRUD announcements | Must |
| FR-111 | Admin can upload/manage school resources | Must |
| FR-112 | Admin can manage school settings | Should |

### 8.3 Teacher Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-201 | Teacher can view assigned classes and subjects | Must |
| FR-202 | Teacher can enter/edit student marks | Must |
| FR-203 | Teacher can create announcements for classes | Must |
| FR-204 | Teacher can upload teaching resources | Must |
| FR-205 | Teacher can view calendar with events | Must |
| FR-206 | Teacher can manage personal profile | Must |

### 8.4 Student Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-301 | Student can view personal profile | Must |
| FR-302 | Student can view enrolled classes | Must |
| FR-303 | Student can browse available subjects | Must |
| FR-304 | Student can view own grades/marks | Must |
| FR-305 | Student can view calendar/schedule | Must |
| FR-306 | Student can view announcements | Must |
| FR-307 | Student can access shared resources | Must |

### 8.5 Calendar & Events

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-401 | Events display on calendar interface | Must |
| FR-402 | Events categorized by type (academic, extracurricular) | Should |
| FR-403 | Role-based event visibility | Must |
| FR-404 | Date/time picker for event creation | Must |

### 8.6 Communication

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-501 | Rich-text announcements using Quill editor | Must |
| FR-502 | Announcements filterable by date/author | Should |
| FR-503 | Announcement targeting by role/class | Should |

---

## 9. Non-Functional Requirements

### 9.1 Performance

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page Load Time | < 3 seconds | First Contentful Paint |
| Time to Interactive | < 5 seconds | DOMContentLoaded |
| API Response Time | < 500ms | Server-side latency |
| Concurrent Users | 100+ | Simultaneous active sessions |

### 9.2 Reliability

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% |
| Database Backup | Daily automated |
| Error Rate | < 0.1% of requests |

### 9.3 Usability

| Requirement | Description |
|-------------|-------------|
| Responsive Design | Works on desktop, tablet, mobile |
| Browser Support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Accessibility | WCAG 2.1 AA compliance |
| Localization | <!-- [COMMENT: Define if multi-language support is required] --> |

### 9.4 Security

| Requirement | Implementation |
|-------------|----------------|
| Data Encryption | HTTPS/TLS for all connections |
| Password Storage | bcrypt hashing (cost factor 12) |
| Session Management | Secure HTTP-only cookies |
| Input Validation | Zod schema validation on all inputs |
| SQL Injection Prevention | Parameterized queries via Drizzle ORM |

### 9.5 Maintainability

| Requirement | Description |
|-------------|-------------|
| Code Quality | TypeScript strict mode, ESLint rules |
| Documentation | Inline comments, userGuide.md, rapport.md |
| Test Coverage | Unit tests for critical business logic |
| Modular Architecture | Feature-based folder structure |

### 9.6 Scalability

| Requirement | Description |
|-------------|-------------|
| Database | PostgreSQL with Neon serverless (auto-scaling) |
| File Storage | Cloudinary CDN for assets |
| Deployment | Vercel Edge Network |

---

## 10. System Architecture

### 10.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Browser    │  │   Mobile     │  │     PWA      │              │
│  │  (Chrome,    │  │   Browser    │  │   Support    │              │
│  │   Firefox)   │  │              │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                           │                                        │
│                    HTTPS (TLS 1.3)                                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        EDGE LAYER (Vercel)                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    TanStack Start Application                 │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │   Router    │  │   Query     │  │   State Management  │   │  │
│  │  │  (Routes)   │  │  (React     │  │   (Zustand)         │   │  │
│  │  │             │  │   Query)    │  │                     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │                    React Components                    │    │  │
│  │  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────────┐  │    │  │
│  │  │  │ shadcn  │  │  React  │  │ Framer  │  │  Chart.js │  │    │  │
│  │  │  │   /ui   │  │  Hook   │  │  Motion │  │  (Charts) │  │    │  │
│  │  │  │        │  │  Form   │  │        │  │           │  │    │  │
│  │  │  └────────┘  └────────┘  └────────┘  └────────────┘  │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    TanStack Start Server                      │  │
│  │                                                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │  │
│  │  │   Better    │  │   Drizzle   │  │     API Routes     │    │  │
│  │  │   Auth      │  │   ORM       │  │   (Controllers)    │    │  │
│  │  │ (Auth +     │  │             │  │                    │    │  │
│  │  │  Sessions)  │  │             │  │                    │    │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘    │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │                 Server Modules                         │    │  │
│  │  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐   │    │  │
│  │  │  │Announce│ │Classes│ │ Events│ │ Grades │ │ Marks  │   │    │  │
│  │  │  │  ments │ │       │ │       │ │        │ │        │   │    │  │
│  │  │  └───────┘ └───────┘ └───────┘ └───────┘ └────────┘   │    │  │
│  │  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐   │    │  │
│  │  │  │Students│ │Subject│ │Teacher│ │Resource│ │  Auth  │   │    │  │
│  │  │  │       │ │       │ │       │ │        │ │        │   │    │  │
│  │  │  └───────┘ └───────┘ └───────┘ └───────┘ └────────┘   │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│    PostgreSQL    │ │   Cloudinary     │ │     Resend      │
│   (Neon DB)      │ │  (File Upload)   │ │    (Email)      │
│                  │ │                  │ │                  │
│  - users         │ │  - Images        │ │  - Password     │
│  - students      │ │  - Documents     │ │    Reset        │
│  - teachers      │ │  - Resources     │ │  - Notifications│
│  - grades        │ │                  │ │                  │
│  - classes       │ │                  │ │                  │
│  - subjects      │ │                  │ │                  │
│  - marks         │ │                  │ │                  │
│  - announcements │ │                  │ │                  │
│  - events        │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

### 10.2 Directory Structure

```
eduManage/
├── src/
│   ├── assets/              # Static assets (logos, animations)
│   ├── auth/                # Authentication forms (login, signup, reset)
│   ├── bones/               # UI skeleton components
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   ├── admin/          # Admin-specific components
│   │   ├── teacher/        # Teacher-specific components
│   │   └── sideBar/        # Navigation components
│   ├── features/           # Feature-based modules
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── providers/          # React context providers
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── _auth/          # Authenticated routes
│   │   │   ├── admin/      # Admin dashboard routes
│   │   │   ├── teacher/    # Teacher dashboard routes
│   │   │   └── student/    # Student dashboard routes
│   │   └── Pages/          # Public pages
│   ├── schemas/            # Zod validation schemas
│   ├── server/             # Server-side code
│   │   ├── db/             # Database connection & schema
│   │   └── modules/        # Server controllers/services
│   ├── store/              # Zustand state stores
│   ├── styles/             # CSS/SCSS files
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Client-side utilities
├── drizzle/                # Database migrations
├── public/                 # Static public assets
└── [config files]         # vite, tsconfig, drizzle, etc.
```

### 10.3 Data Flow

```
[Client Action]
      │
      ▼
[TanStack Router] ──► [Route Loader/Action]
      │                      │
      ▼                      ▼
[React Component] ◄──── [TanStack Query Cache]
      │                      │
      │              ┌───────┴───────┐
      │              ▼               ▼
      │        [Server API]    [Server API]
      │              │               │
      │              └───────┬───────┘
      │                      ▼
      │              [Drizzle ORM]
      │                      │
      │              ┌───────┴───────┐
      │              ▼               ▼
      │         [PostgreSQL]    [External APIs]
      │              │          (Cloudinary, Resend)
      │              └───────────┬───────────┘
      │                          ▼
      │                   [Response]
      │                          │
      └──────────────────────────┘
            [UI Update via React]
```

---

## 11. Use Case Diagram

### 11.1 High-Level Use Case Diagram

```
                         ┌─────────────────────────────────────────────────────────┐
                         │                    EduManage System                       │
                         │                                                          │
                         │   ┌─────────┐     ┌─────────┐     ┌─────────┐            │
                         │   │  Admin  │     │ Teacher │     │ Student │            │
                         │   └───┬─────┘     └───┬─────┘     └───┬─────┘            │
                         │       │               │               │                   │
                         │       │               │               │                   │
                         │       ▼               ▼               ▼                   │
                         │   ┌─────────────────────────────────────────────────┐     │
    ┌──────────────┐    │   │                  USE CASES                       │     │
    │   External    │    │   │                                                  │     │
    │   Systems     │    │   │  • Login/Logout                                 │     │
    │              │    │   │  • View Dashboard                                │     │
    │  • Google     │◄───┼───┤  • Manage Users                                  │     │
    │    OAuth      │    │   │  • Manage Classes                                │     │
    │  • Facebook   │◄───┼───┤  • Manage Grades                                 │     │
    │    OAuth      │    │   │  • Manage Subjects                               │     │
    │              │    │   │  • Enter/View Marks                               │     │
    │  • Email      │◄───┼───┤  • Manage Calendar/Events                        │     │
    │    Service    │    │   │  • Create/View Announcements                     │     │
    │              │    │   │  • Upload/Download Resources                      │     │
    │  • Cloudinary │◄───┼───┤  • View Reports/Analytics                        │     │
    │    Storage    │    │   │  • System Settings                               │     │
    └──────────────┘    │   │                                                  │     │
                        │   └─────────────────────────────────────────────────┘     │
                        │                                                          │
                        └─────────────────────────────────────────────────────────┘
```

### 11.2 Admin Use Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ADMIN USE CASES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Login      │───▶│   Logout     │    │ View         │                   │
│  │              │    │              │    │ Dashboard    │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│        │                                        │                           │
│        │                                        ▼                           │
│        │                              ┌──────────────┐                       │
│        │                              │ Manage       │                       │
│        │                              │ Analytics    │                       │
│        │                              └──────────────┘                       │
│        │                                                                  │
│        ▼                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Manage     │    │   Manage     │    │   Manage     │                   │
│  │   Students   │    │   Teachers   │    │   Grades     │                   │
│  │              │    │              │    │              │                   │
│  │ • Create     │    │ • Create     │    │ • Create     │                   │
│  │ • Read       │    │ • Read       │    │ • Update     │                   │
│  │ • Update     │    │ • Update     │    │ • Delete     │                   │
│  │ • Delete     │    │ • Delete     │    │ • Assign     │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│        │                  │                  │                               │
│        │                  ▼                  ▼                               │
│        │            ┌──────────────┐    ┌──────────────┐                   │
│        │            │   Manage     │    │   Manage     │                   │
│        │            │   Classes    │    │   Subjects   │                   │
│        │            └──────────────┘    └──────────────┘                   │
│        │                                                                  │
│        ▼                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Manage     │    │   Manage     │    │   Manage     │                   │
│  │   Teacher    │    │   Assessment │    │   Calendar   │                   │
│  │   Assignments│    │   Periods    │    │   Events     │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│        │                  │                  │                               │
│        └──────────────────┴──────────────────┴─────────────────────────────  │
│                                    │                                           │
│                                    ▼                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Create     │    │   Upload/    │    │   System     │                   │
│  │   Announce-  │    │   Manage     │    │   Settings   │                   │
│  │   ments      │    │   Resources  │    │              │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Teacher Use Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             TEACHER USE CASES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Login      │───▶│   Logout     │    │ View         │                   │
│  │              │    │              │    │ Dashboard    │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                    │                         │
│                                                    ▼                         │
│                                              ┌──────────────┐                │
│                                              │ View My      │                │
│                                              │ Classes      │                │
│                                              └──────────────┘                │
│                                                    │                         │
│        ┌───────────────────────────────────────────┼─────────────────────┐  │
│        │                   │                       │                     │  │
│        ▼                   ▼                       ▼                     ▼  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   Enter/     │    │   Manage     │    │   View       │               │
│  │   Edit       │    │   Subject    │    │   Calendar   │               │
│  │   Marks      │    │   Resources  │    │              │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│        │                   │                   │                          │
│        │                   │                   │                          │
│        │                   ▼                   │                          │
│        │             ┌──────────────┐           │                          │
│        │             │   Upload    │           │                          │
│        │             │   Resources │           │                          │
│        │             └──────────────┘           │                          │
│        │                                          │                          │
│        └──────────────────────────────────────────┼──────────────────────    │
│                                                    │                          │
│                                                    ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│  │   Create     │    │   View       │    │   Update     │                │
│  │   Announce-  │    │   Student    │    │   Profile    │                │
│  │   ments      │    │   List       │    │              │                │
│  └──────────────┘    └──────────────┘    └──────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.4 Student Use Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             STUDENT USE CASES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Login      │───▶│   Logout     │    │ View         │                   │
│  │              │    │              │    │ Dashboard    │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                    │                         │
│        ┌───────────────────────────────────────────┼─────────────────────┐  │
│        │                   │                       │                     │  │
│        ▼                   ▼                       ▼                     ▼  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐               │
│  │   View       │    │   Browse     │    │   View       │               │
│  │   Classes    │    │   Subjects   │    │   Calendar   │               │
│  └──────────────┘    └──────────────┘    └──────────────┘               │
│        │                   │                   │                          │
│        │                   │                   │                          │
│        │                   ▼                   │                          │
│        │             ┌──────────────┐         │                          │
│        │             │   Access     │         │                          │
│        │             │   Resources  │         │                          │
│        │             └──────────────┘         │                          │
│        │                                          │                        │
│        └──────────────────────────────────────────┼──────────────────      │
│                                                    │                       │
│                                                    ▼                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│  │   View Own   │    │   View       │    │   Update     │                │
│  │   Grades/    │    │   Announce-  │    │   Profile    │                │
│  │   Marks      │    │   ments      │    │              │                │
│  └──────────────┘    └──────────────┘    └──────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.5 Key Use Case Descriptions

#### UC-001: User Login

| Field | Description |
|-------|-------------|
| **ID** | UC-001 |
| **Name** | User Login |
| **Actors** | Admin, Teacher, Student, External (Google, Facebook) |
| **Preconditions** | User has valid credentials or social account |
| **Postconditions** | User authenticated, redirected to role-based dashboard |
| **Basic Flow** | 1. User navigates to login page<br>2. Enters credentials or clicks social login<br>3. System validates credentials<br>4. System creates session<br>5. User redirected to appropriate dashboard |
| **Alternative Flow** | 3a. Invalid credentials → Show error message<br>3b. Social login → Redirect to provider → Return with token |

#### UC-002: Admin Manages Students

| Field | Description |
|-------|-------------|
| **ID** | UC-002 |
| **Name** | Admin Student Management |
| **Actors** | Admin |
| **Preconditions** | Admin is authenticated |
| **Postconditions** | Student record created/updated/deleted in database |
| **Basic Flow** | 1. Admin navigates to Student Management<br>2. Views paginated list of students<br>3. Searches for student (optional)<br>4. Clicks Add/Edit/Delete<br>5. Fills form with Zod validation<br>6. System persists to PostgreSQL<br>7. UI updates via React Query |

#### UC-003: Teacher Enters Marks

| Field | Description |
|-------|-------------|
| **ID** | UC-003 |
| **Name** | Teacher Mark Entry |
| **Actors** | Teacher |
| **Preconditions** | Teacher is authenticated and assigned to class/subject |
| **Postconditions** | Student marks recorded in database |
| **Basic Flow** | 1. Teacher navigates to Marks section<br>2. Selects class and subject<br>3. Selects assessment period<br>4. Enters marks per student<br>5. System validates (0-20 scale)<br>6. Saves to database<br>7. Success notification shown |

<!-- [COMMENT: Add more use cases as needed - UC-004 through UC-020 for full coverage] -->

---

## 12. Key System Models

### 12.1 Entity-Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    admins    │       │   teachers   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │       │ id (PK)      │
│ email        │  │    │ userId (FK)  │◄──┐   │ userId (FK)  │◄─┐
│ passwordHash │  │    │ schoolName   │   │   │ bio          │  │
│ name         │  │    │ address      │   │   │ createdAt    │  │
│ role         │  │    └──────────────┘   │   └──────────────┘  │
│ image        │  │                       │          │           │
│ createdAt    │  │                       │          │           │
│ updatedAt    │  │                       │          │           │
└──────────────┘  │                       │          │           │
     │            │                       │          │           │
     │            │   ┌──────────────┐     │          │           │
     │            │   │  students    │     │          │           │
     │            └──▶│ id (PK)      │     │          │           │
         │            │ userId (FK)  │◄────┘          │           │
         │            │ classId (FK) │◄───────────────┤           │
         │            │ parentName   │                │           │
         │            │ parentPhone  │                │           │
         │            │ createdAt    │                │           │
         │            └──────────────┘                │           │
         │                   │                        │           │
         │                   │                        │           │
         │                   ▼                        │           │
         │            ┌──────────────┐                │           │
         │            │   classes    │                │           │
         │            ├──────────────┤                │           │
         │            │ id (PK)      │◄─────┐         │           │
         │            │ name         │       │         │           │
         │            │ gradeId (FK) │◄───┐  │         │           │
         │            │ createdAt    │    │  │         │           │
         │            └──────────────┘    │  │         │           │
         │                   │             │  │         │           │
         │                   │             │  │         │           │
         │                   ▼             │  │         │           │
         │            ┌──────────────┐     │  │         │           │
         │            │   grades    │     │  │         │           │
         │            ├──────────────┤     │  │         │           │
         │            │ id (PK)      │◄─────┘  │         │           │
         │            │ name         │         │         │           │
         │            │ adminId (FK) │─────────┘         │           │
         │            └──────────────┘                   │           │
         │                                                │           │
         │                   ┌────────────────────────────┘           │
         │                   │                                        │
         │                   ▼                                        │
         │            ┌──────────────┐     ┌──────────────┐         │
         │            │  subjects    │     │   teacher    │         │
         │            ├──────────────┤     │ _assignments │         │
         │            │ id (PK)      │◄────│ id (PK)      │         │
         │            │ name         │     │ teacherId(FK)│◄────────┘
         │            │ createdAt    │     │ subjectId(FK│◄────────┐
         │            └──────────────┘     │ classId (FK)│◄────────┤
         │                   │             └──────────────┘         │
         │                   │                    │                 │
         │                   │                    │                 │
         │                   ▼                    ▼                 │
         │            ┌──────────────┐     ┌──────────────┐       │
         │            │  grade       │     │  assessment  │       │
         │            │ _subjects    │     │  _periods    │       │
         │            ├──────────────┤     ├──────────────┤       │
         │            │ id (PK)      │     │ id (PK)      │       │
         │            │ gradeId (FK) │     │ name         │       │
         │            │ subjectId(FK)│     │ startDate    │       │
         │            │ coefficient  │     │ endDate      │       │
         │            └──────────────┘     └──────────────┘       │
         │                                    │                    │
         │                                    │                    │
         │                                    ▼                    │
         │                             ┌──────────────┐            │
         │                             │ assessments │            │
         │                             ├──────────────┤            │
         │                             │ id (PK)      │            │
         │                             │ name         │            │
         │                             │ type         │            │
         │                             │ periodId(FK) │◄──────────┘
         │                             │ weight       │            │
         │                             │ date         │            │
         │                             └──────────────┘            │
         │                                    │                     │
         │                                    │                     │
         │                                    ▼                     │
         │                             ┌──────────────┐            │
         │                             │ student_marks│            │
         │                             ├──────────────┤            │
         │                             │ id (PK)      │            │
         │                             │ studentId(FK)│◄───────────┘
         │                             │ assessmentId │◄───────────┐
         │                             │ mark         │            │
         │                             │ createdAt    │            │
         │                             └──────────────┘            │
         │                                                    │
         │                                                    │
         ▼                                                    │
┌──────────────┐                                       ┌──────────────┐
│  resources   │                                       │ announcements│
├──────────────┤                                       ├──────────────┤
│ id (PK)      │                                       │ id (PK)      │
│ title        │                                       │ title        │
│ description  │                                       │ content      │
│ fileUrl      │                                       │ authorId(FK) │
│ uploaderId   │                                       │ targetRole   │
│ classId (FK) │                                       │ classId (FK) │
│ createdAt    │                                       │ createdAt    │
└──────────────┘                                       └──────────────┘
        ▲
        │
┌──────────────┐
│   events     │
├──────────────┤
│ id (PK)      │
│ title        │
│ description  │
│ start        │
│ end          │
│ allDay       │
│ classId (FK) │
│ createdAt    │
└──────────────┘
```

### 12.2 Core Database Schema Tables

#### Users Table

```typescript
// Simplified schema representation
{
  users: {
    id: uuid PRIMARY KEY,
    email: varchar UNIQUE NOT NULL,
    passwordHash: varchar,
    name: varchar NOT NULL,
    role: enum('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    image: varchar,
    createdAt: timestamp DEFAULT NOW(),
    updatedAt: timestamp DEFAULT NOW()
  }
}
```

#### Students Table

```typescript
{
  students: {
    id: uuid PRIMARY KEY,
    userId: uuid FOREIGN KEY → users.id,
    classId: uuid FOREIGN KEY → classes.id,
    parentName: varchar,
    parentPhone: varchar,
    createdAt: timestamp DEFAULT NOW()
  }
}
```

#### Grades, Classes, Subjects

```typescript
{
  grades: {
    id: uuid PRIMARY KEY,
    name: varchar NOT NULL,      // e.g., "1AM", "2AM", "3AM"
    adminId: uuid FOREIGN KEY → admins.id,
    createdAt: timestamp DEFAULT NOW()
  },
  classes: {
    id: uuid PRIMARY KEY,
    name: varchar NOT NULL,      // e.g., "1AM-A", "1AM-B"
    gradeId: uuid FOREIGN KEY → grades.id,
    createdAt: timestamp DEFAULT NOW()
  },
  subjects: {
    id: uuid PRIMARY KEY,
    name: varchar NOT NULL,
    createdAt: timestamp DEFAULT NOW()
  }
}
```

#### Marks Assessment

```typescript
{
  assessmentPeriods: {
    id: uuid PRIMARY KEY,
    name: varchar NOT NULL,      // e.g., "Term 1", "Semester 2"
    startDate: date,
    endDate: date
  },
  assessments: {
    id: uuid PRIMARY KEY,
    name: varchar NOT NULL,      // e.g., "Midterm Exam"
    type: varchar NOT NULL,      // e.g., "EXAM", "QUIZ", "HOMEWORK"
    periodId: uuid FOREIGN KEY → assessmentPeriods.id,
    weight: integer DEFAULT 1,
    date: date
  },
  studentMarks: {
    id: uuid PRIMARY KEY,
    studentId: uuid FOREIGN KEY → students.id,
    assessmentId: uuid FOREIGN KEY → assessments.id,
    mark: decimal(5,2) NOT NULL,  // 0-20 scale
    createdAt: timestamp DEFAULT NOW()
  }
}
```

### 12.3 Key API Endpoints (Server Modules)

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `POST /auth/reset-password` | Authentication flows |
| Students | `GET /api/students`, `POST /api/students`, `PATCH /api/students/:id`, `DELETE /api/students/:id` | Student CRUD |
| Teachers | `GET /api/teachers`, `POST /api/teachers`, `PATCH /api/teachers/:id`, `DELETE /api/teachers/:id` | Teacher CRUD |
| Classes | `GET /api/classes`, `POST /api/classes`, `PATCH /api/classes/:id`, `DELETE /api/classes/:id` | Class management |
| Grades | `GET /api/grades`, `POST /api/grades`, `PATCH /api/grades/:id`, `DELETE /api/grades/:id` | Grade level management |
| Subjects | `GET /api/subjects`, `POST /api/subjects`, `PATCH /api/subjects/:id`, `DELETE /api/subjects/:id` | Subject management |
| Marks | `GET /api/marks/:studentId`, `POST /api/marks`, `PATCH /api/marks/:id` | Grade entry |
| Events | `GET /api/events`, `POST /api/events`, `PATCH /api/events/:id`, `DELETE /api/events/:id` | Calendar events |
| Announcements | `GET /api/announcements`, `POST /api/announcements`, `DELETE /api/announcements/:id` | Announcements |
| Resources | `GET /api/resources`, `POST /api/resources`, `DELETE /api/resources/:id` | File management |

---

## 13. Tech Stack and Design Tools

### 13.1 Technology Stack

#### Framework & Runtime

| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Start** | Latest | Full-stack React framework with file-based routing |
| **React** | 19.2.0 | UI library |
| **TypeScript** | Strict Mode | Type-safe development |
| **Bun** | Primary | JavaScript runtime & package manager |
| **Node.js** | Compatible | Alternative runtime |
| **Vite** | Latest | Build tool |

#### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **SCSS** | - | Additional styling capabilities |
| **shadcn/ui** | - | Component library (built on Radix UI) |
| **Framer Motion** | 12.34.3 | Animations and transitions |
| **Lucide React** | - | Icon library |
| **Zustand** | 5.0.9 | Client-side state management |
| **TanStack Query** | Latest | Server state management & caching |
| **React Hook Form** | 7.68.0 | Form handling |
| **Zod** | 4.3.6 | Schema validation |
| **React Big Calendar** | 1.19.4 | Calendar component |
| **Chart.js** | 4.5.1 | Analytics charts |
| **Quill** | 2.0.2 | Rich text editor |
| **date-fns** | 4.1.0 | Date utilities |

#### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Drizzle ORM** | 0.45.2 | Database ORM |
| **PostgreSQL** | - | Relational database |
| **Neon Database** | - | Serverless PostgreSQL hosting |
| **Better Auth** | 1.6.1 | Authentication framework |
| **bcrypt** | 6.0.0 | Password hashing |
| **Resend** | 6.12.3 | Email service |
| **Cloudinary** | 2.10.0 | File/image storage CDN |

### 13.2 Design Tools

| Tool | Purpose | Usage in Project |
|------|---------|-----------------|
| **Figma** | UI/UX Design, Prototyping | <!-- [COMMENT: Provide link to Figma design files if available] --> |
| **Stitch** | Design handoff, asset extraction | <!-- [COMMENT: Document Stitch usage for design specs] --> |

#### Design Assets

| Asset | Location | Description |
|-------|----------|-------------|
| Design Files | <!-- [COMMENT: Add path to Figma files] --> | UI mockups and prototypes |
| Logo Assets | `src/assets/` | Application logos |
| UI Components | `src/components/ui/` | shadcn/ui component library |

### 13.3 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Vitest** | Unit testing |
| **Testing Library** | React component testing |
| **Vercel** | Deployment & hosting |
| **Docker** | Local development (PostgreSQL) |

### 13.4 Package Scripts Reference

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes to DB
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Drizzle Studio (DB GUI)

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run Vitest tests
pnpm test:ui          # Run tests with UI
```

---

## 14. UI and UX Philosophy

### 14.1 Design Principles

EduManage adheres to the following UI/UX design principles:

1. **Clarity First**
   - Clean, uncluttered interfaces with clear visual hierarchy
   - Consistent use of whitespace and typography
   - Information organized in digestible chunks

2. **Role-Based Design**
   - Each user role sees a tailored dashboard
   - Navigation reflects role permissions
   - Actions contextual to user needs

3. **Accessibility by Default**
   - Semantic HTML elements
   - ARIA labels where needed
   - Sufficient color contrast ratios
   - Keyboard navigable interfaces

4. **Performance Perception**
   - Skeleton loaders for loading states
   - Smooth transitions (Framer Motion)
   - Immediate feedback on interactions

### 14.2 Design System

#### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--background` | #ffffff | #0a0a0c | Page background |
| `--surface` | #f6f8fa | #121216 | Cards, panels |
| `--primary` | #7aa2f7 | #7aa2f7 | Buttons, links, accents |
| `--primary-foreground` | #ffffff | #ffffff | Text on primary |
| `--secondary` | #6e7681 | #8b949e | Secondary actions |
| `--muted` | #f6f8fa | #21262d | Subdued backgrounds |
| `--text` | #1f2328 | #e6edf3 | Primary text |
| `--text-secondary` | #656d76 | #8b949e | Secondary text |
| `--border` | #d0d7de | #30363d | Borders, dividers |
| `--destructive` | #f85149 | #f85149 | Error states |
| `--success` | #3fb950 | #3fb950 | Success states |
| `--warning` | #d29922 | #d29922 | Warning states |

#### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display | Plus Jakarta Sans | 700 | 32-48px |
| Heading 1 | Plus Jakarta Sans | 600 | 24px |
| Heading 2 | Plus Jakarta Sans | 600 | 20px |
| Heading 3 | Plus Jakarta Sans | 600 | 16px |
| Body | Inter | 400 | 14px |
| Small | Inter | 400 | 12px |
| Code | JetBrains Mono | 400 | 13px |

#### Spacing System

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |

#### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Inputs, small buttons |
| `--radius-md` | 8px | Cards, panels |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-full` | 9999px | Avatars, pills |

### 14.3 Component Library (shadcn/ui)

EduManage uses shadcn/ui components with the following configuration:

| Setting | Value |
|---------|-------|
| Style | new-york |
| Base Color | neutral |
| CSS Variables | Enabled |
| Icon Library | Lucide |
| Prefix | (empty) |

#### Key Components Used

| Category | Components |
|----------|------------|
| **Layout** | Card, Container, Section |
| **Navigation** | Sidebar, Tabs, Breadcrumb |
| **Forms** | Input, Label, Select, Checkbox, RadioGroup, Switch, Toggle |
| **Feedback** | Alert, Dialog, Drawer, Popover, Toast (Sonner) |
| **Data Display** | Table, Badge, Avatar, Skeleton |
| **Date/Time** | Calendar, DatePicker |
| **Rich Content** | Quill Editor |
| **Charts** | Chart.js with react-chartjs-2 |

### 14.4 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| Mobile | 0px | < 640px |
| Tablet | 640px | 640px - 1024px |
| Desktop | 1024px | > 1024px |
| Wide | 1280px | > 1280px |

### 14.5 Animation Guidelines

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Page transition | 200ms | ease-out | Route changes |
| Modal open | 300ms | ease-out | Dialogs, drawers |
| Hover state | 150ms | ease-in-out | Buttons, links |
| Skeleton pulse | 1.5s | ease-in-out | Loading states |

---

## 15. Security and Privacy

### 15.1 Authentication Security

| Feature | Implementation |
|---------|----------------|
| Password Storage | bcrypt with cost factor 12 |
| Session Management | HTTP-only secure cookies |
| OAuth Providers | Google, Facebook via Better Auth |
| Password Reset | Token-based via email (Resend) |
| Rate Limiting | <!-- [COMMENT: Confirm if rate limiting is implemented] --> |

### 15.2 Authorization

| Feature | Implementation |
|---------|----------------|
| Role-Based Access | Role enum stored in users table |
| Permission Checks | Middleware on protected routes |
| Resource Ownership | User ID validated on all data mutations |

### 15.3 Data Protection

| Area | Measures |
|------|----------|
| Transport | HTTPS/TLS 1.3 for all connections |
| Database | Parameterized queries via Drizzle ORM |
| Input Validation | Zod schemas on all form submissions |
| XSS Prevention | React's built-in escaping, no dangerouslySetInnerHTML |
| CSRF | SameSite cookies, CSRF tokens |

### 15.4 Privacy Compliance

<!-- [COMMENT: Specify privacy regulations applicable (GDPR, FERPA, etc.) and compliance measures] -->

| Requirement | Status |
|-------------|--------|
| Data Encryption at Rest | Via Neon Database |
| Data Encryption in Transit | Via TLS |
| User Consent for Data | In signup flow |
| Right to Deletion | Admin functionality |
| Data Export | <!-- [COMMENT: Define if user data export is available] --> |

### 15.5 Security Checklist

- [x] Password hashing with bcrypt
- [x] HTTPS enforced (Vercel)
- [x] TypeScript strict mode
- [x] Zod validation on all inputs
- [x] Parameterized DB queries
- [x] HTTP-only session cookies
- [ ] Regular dependency audits
- [ ] Security headers (CSP, etc.)
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection prevention testing

---

## 16. Business Model

<!-- [COMMENT: This section requires input from project owner. Fill in the appropriate business model details.] -->

### 16.1 Revenue Model

| Model | Description | Status |
|-------|-------------|--------|
| **Freemium** | Basic features free, premium for advanced | <!-- [COMMENT: Specify] --> |
| **Subscription** | Monthly/annual licensing | <!-- [COMMENT: Specify] --> |
| **One-time Purchase** | Perpetual license | <!-- [COMMENT: Specify] --> |
| **Open Source** | Free with support contracts | <!-- [COMMENT: Specify] --> |

### 16.2 Pricing Tiers

<!-- [COMMENT: Define pricing structure if applicable] -->

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | <!-- [COMMENT: List included features] --> |
| Pro | $20/mo | <!-- [COMMENT: List included features] --> |
| Enterprise | $30/mo | <!-- [COMMENT: List included features] --> |

### 16.3 Market Positioning

<!-- [COMMENT: Define market position, target geography, competitor analysis] -->

---

## 17. Development Methodology

### 17.1 Methodology Overview

EduManage follows an **Agile** development approach with the following practices:

| Practice | Implementation |
|----------|----------------|
| Iterations | 2-week sprints |
| Planning | Sprint planning at start of each iteration |
| Standups | Not implemented <!-- [COMMENT: Define if team uses standups] --> |
| Reviews | Code review before merge |
| Retrospectives | <!-- [COMMENT: Define frequency and process] --> |

### 17.2 Version Control

| Practice | Implementation |
|----------|----------------|
| Branching | Feature branches from `main` |
| Commit Messages | Conventional commits |
| Pull Requests | Required for all changes |
| Review | At least 1 approval required |
| Merging | Squash and merge |

### 17.3 Code Review Checklist

- [x] TypeScript types correct
- [x] No hardcoded values
- [x] Zod validation on inputs
- [x] Error handling in place
- [x] No console.log statements
- [x] Tests pass
- [x] Linting passes

### 17.4 Project Phases

| Phase | Status | Timeline |
|-------|--------|----------|
| Planning & Requirements | Complete | <!-- [COMMENT: Date] --> |
| UI/UX Design | Complete | <!-- [COMMENT: Date] --> |
| Backend Development | Complete | <!-- [COMMENT: Date] --> |
| Frontend Development | Complete | <!-- [COMMENT: Date] --> |
| Testing | Partial | <!-- [COMMENT: Date] --> |
| Deployment | Complete | <!-- [COMMENT: Date] --> |
| Feature Enhancements | Ongoing | Current |

---

## 18. Team Presentation

<!-- [COMMENT: Complete this section with actual team member information] -->

### 18.1 Team Members

| Name | Role | Responsibilities |
|------|------|-------------------|
| <!-- [Ayoub Khatir] --> | Project Lead (Full Stack Developer) | <!-- [Add from your own ] --> |
| <!-- [COMMENT: Name] --> | Full Stack Developer| <!-- [add from your Own ] --> |
| <!-- [Benali Mohammed] --> | UI / UX Design + Frontend Developer | <!-- [add from your Own] --> |
| <!-- [KesKas Nazim ] --> | Backend Developer| <!-- [add from your Own] --> |
| <!-- [Oussama] --> | Backend Developer | <!-- [add from your Own] --> |
| <!-- [Ali] --> | Backend Developer | <!-- [add from your Own] --> |



## 19. Challenges and Solutions

### 19.1 Technical Challenges

| Challenge | Solution | Status |
|-----------|----------|--------|
| Role-based routing | TanStack Router middleware for auth checks | ✅ Solved |
| Complex form validation | Zod schemas with React Hook Form | ✅ Solved |
| File uploads | Cloudinary integration with presigned URLs | ✅ Solved |
| Calendar integration | React Big Calendar with custom styling | ✅ Solved |
| Chart visualization | Chart.js with react-chartjs-2 adapter | ✅ Solved |

### 19.2 Performance Challenges

| Challenge | Solution | Status |
|-----------|----------|--------|
| Initial page load | Vite build optimization, code splitting | ✅ Solved |
| Database queries | Drizzle ORM with optimized queries | ✅ Solved |
| React Query caching | Strategic cache invalidation | ✅ Solved |

### 19.3 Design Challenges

| Challenge | Solution | Status |
|-----------|----------|--------|
| Consistent theming | CSS variables + Tailwind config | ✅ Solved |
| Dark mode support | CSS variable swapping | ✅ Solved |
| Responsive layout | Tailwind responsive utilities | ✅ Solved |

### 19.4 Future Challenges (Anticipated)

| Challenge | Proposed Solution | Priority |
|-----------|-------------------|----------|
| Multi-school support | Tenant-based architecture | Medium |
| Real-time updates | WebSocket integration | Medium |
| Mobile app | React Native or PWA enhancement | Low |
| Offline support | Service Worker caching | Low |

---

## 20. Future Improvements

### 20.1 Short-term (Next Quarter)

| Feature | Description | Priority |
|---------|-------------|----------|
| Parent Portal | Read-only access to child progress | High |
| Attendance Tracking | Daily attendance marking | High |
| Grade Reports | PDF export of student reports | Medium |
| Notifications | Email/SMS notifications | Medium |

### 20.2 Medium-term (6-12 Months)

| Feature | Description | Priority |
|---------|-------------|----------|
| Mobile App | Native iOS/Android application | Medium |
| Online Payments | Fee payment integration | Medium |
| Timetable Builder | Drag-drop schedule creation | Medium |
| Multi-language | i18n support (Arabic, French) | Low |

### 20.3 Long-term (12+ Months)

| Feature | Description | Priority |
|---------|-------------|----------|
| AI Assistant | Chatbot for common queries | Low |
| Analytics Dashboard | Advanced BI/reporting | Low |
| API for Third-parties | Public API access | Low |
| White-label | Custom branding for schools | Low |

### 20.4 Technical Improvements

| Improvement | Description | Priority |
|-------------|-------------|----------|
| Test Coverage | Increase unit/integration tests | High |
| Performance Monitoring | Add APM (Application Performance Monitoring) | Medium |
| Security Audit | Professional security review | Medium |
| Documentation | API documentation (OpenAPI/Swagger) | Medium |

---

## 21. Conclusion

EduManage represents a comprehensive solution to modern school management needs. Built on a robust technology stack featuring React 19, TanStack Start, and PostgreSQL, the application provides a scalable, maintainable platform for educational institutions.

### 21.1 Key Achievements

1. **Complete Feature Set**: From authentication to grade management, EduManage covers the full spectrum of school management functions
2. **Modern Architecture**: TypeScript end-to-end, component-driven design, and cloud-native deployment
3. **Accessible Design**: Clean UI following shadcn/ui principles with dark/light mode support
4. **Secure Foundation**: Industry-standard authentication, parameterized queries, and input validation

### 21.2 Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| User Roles | 3 (Admin, Teacher, Student) | ✅ Achieved |
| Feature Coverage | Core school management | ✅ Achieved |
| Deployment | Production URL accessible | ✅ Achieved |
| Code Quality | TypeScript strict, ESLint passing | ✅ Achieved |

### 21.3 Looking Forward

EduManage is positioned for continued growth. With a solid technical foundation and clear roadmap, the platform will evolve to meet the expanding needs of educational institutions.

<!-- [COMMENT: Add specific call to action, next steps, or closing remarks] -->

---

## 22. References and Tools

### 22.1 Documentation References

| Document | Location | Description |
|----------|----------|-------------|
| README.md | `/README.md` | Project setup and commands |
| userGuide.md | `/userGuide.md` | End-user documentation |
| rapport.md | `/rapport.md` | This document |

### 22.2 External Resources

#### Framework Documentation

| Resource | URL |
|----------|-----|
| TanStack Start | https://tanstack.com/start |
| TanStack Router | https://tanstack.com/router |
| TanStack Query | https://tanstack.com/query |
| React | https://react.dev |
| TypeScript | https://www.typescriptlang.org |

#### UI/Design Documentation

| Resource | URL |
|----------|-----|
| Tailwind CSS | https://tailwindcss.com |
| shadcn/ui | https://ui.shadcn.com |
| Radix UI | https://radix-ui.com |
| Framer Motion | https://www.framer.com/motion |
| Lucide Icons | https://lucide.dev |

#### Backend/Database Documentation

| Resource | URL |
|----------|-----|
| Drizzle ORM | https://orm.drizzle.team |
| PostgreSQL | https://www.postgresql.org |
| Neon Database | https://neon.tech |
| Better Auth | https://www.better-auth.com |

#### External Services

| Service | Purpose | Docs |
|---------|---------|------|
| Vercel | Deployment | https://vercel.com/docs |
| Cloudinary | File storage | https://cloudinary.com/documentation |
| Resend | Email | https://resend.com/docs |
| Google OAuth | Social login | https://developers.google.com/identity |
| Facebook OAuth | Social login | https://developers.facebook.com/docs |

### 22.3 Development Tools

| Tool | Purpose |
|------|---------|
| Visual Studio Code | IDE |
| Chrome DevTools | Debugging |
| Vercel CLI | Deployment |
| PostgreSQL | Local database (via Docker) |

### 22.4 Community & Support

| Channel | Link |
|---------|------|
| GitHub Issues | <!-- [COMMENT: Add GitHub repo URL] --> |
| Documentation | <!-- [COMMENT: Add docs URL] --> |
| Support Email | <!-- [COMMENT: Add support email] --> |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **SMIS** | School Management Information System |
| **RBAC** | Role-Based Access Control |
| **ORM** | Object-Relational Mapping |
| **CRUD** | Create, Read, Update, Delete |
| **OAuth** | Open Authorization protocol for secure authentication |
| **PWA** | Progressive Web Application |

## Appendix B: Acronyms

| Acronym | Full Form |
|---------|-----------|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| DB | Database |
| HTML | HyperText Markup Language |
| JSON | JavaScript Object Notation |
| SQL | Structured Query Language |
| SSH | Secure Shell |
| TLS | Transport Layer Security |
| UI | User Interface |
| UX | User Experience |

---

**Document Version:** 1.0.0
**Last Updated:** May 2026
**Author:** <!-- [COMMENT: Add author name] -->