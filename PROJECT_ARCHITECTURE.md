# PROJECT ARCHITECTURE — EduManage

> **Internal Engineering Documentation**
> *Version 1.0 — Generated from codebase analysis*

---

## 1. Project Overview

### 1.1 Purpose

EduManage is a full-stack, multi-role school management platform that digitises and streamlines administrative, academic, and communication workflows for educational institutions. It replaces fragmented spreadsheets, paper records, and disparate tools with a unified dashboard-driven SaaS experience.

### 1.2 Business & Domain Logic

The platform models a real-world school hierarchy:

- **Admins** manage the school — oversee grades, classes, teachers, students, announcements, and the academic calendar.
- **Teachers** manage their classes — record marks, create assessments, share resources, view their schedule, and post announcements.
- **Students** view their subjects, marks, calendar events, announcements, and learning resources.

Domain entities include Grades, Classes, Subjects, Teachers, Students, Assessments, StudentMarks, Events, Resources, and Announcements.

### 1.3 Target Users & Use Cases

| User | Primary Use Cases |
|---|---|
| School Admin | Create/manage grades, classes, subjects; onboard teachers & students; assign teachers; view analytics; post announcements; manage calendar |
| Teacher | View assigned classes & subjects; record marks; create assessments; share resources; view timetable; post announcements |
| Student | View subjects & grades; check marks; browse resources; view calendar; read announcements |

### 1.4 Platform Goals

- Provide a single source of truth for academic data
- Enforce role-based access with clear boundaries
- Deliver a modern, responsive, themeable UI across desktop and mobile
- Support cloud-based file storage (Cloudinary) and email notifications (Resend)
- Maintain type safety end-to-end via shared TypeScript and Zod schemas
- Enable rapid onboarding for new schools via self-service signup

---

## 2. Tech Stack

### 2.1 Frontend Framework — React 19 + TanStack Start

| Aspect | Detail |
|---|---|
| Library | react@^19.2.0 with react-dom@^19.2.0 |
| Meta-framework | @tanstack/react-start — SSR-capable React framework |
| Rationale | Provides first-class SSR, streaming, server functions (RPC), and tight integration with TanStack Router and TanStack Query — all within a single project without needing Next.js or Remix |

### 2.2 Routing — TanStack Router

| Aspect | Detail |
|---|---|
| Library | @tanstack/react-router with file-based route tree |
| Rationale | Full type safety across route params, search params, loader data, and context. Supports nested layouts, beforeLoad guards, and SSR streaming. Auto-generates routeTree.gen.ts via the Vite plugin |
| Integration | Router context carries queryClient; setupRouterSsrQueryIntegration bridges SSR and client hydration |

### 2.3 State Management & Data Fetching

| Aspect | Detail |
|---|---|
| Server state | @tanstack/react-query (v5) |
| Client state | zustand@^5.0.9 (sidebar visibility, active navigation) |
| Query client | refetchOnWindowFocus: true |

### 2.4 Server Functions / API Layer

Server functions (createServerFn from @tanstack/react-start) act as the RPC bridge. Functions are collocated with frontend code but execute on the server — no REST or GraphQL boilerplate. Each domain module in src/server/modules/ exposes a *.server-functions.ts file.

### 2.5 Database — PostgreSQL (Neon Serverless)

Serverless Postgres via @neondatabase/serverless (HTTP-based driver). Provides auto-scaling and branching without connection pooling overhead. Local dev uses Docker Compose.

### 2.6 ORM — Drizzle ORM

drizzle-orm@^0.45.2 with drizzle-kit@^0.31.10. Lightweight SQL-like query builder with full TypeScript inference. Single schema.ts file defines all tables, enums, and relations. Drizzle adapter also powers Better Auth tables.

### 2.7 Validation — Zod v4

zod@^4.3.6 for universal schema validation — API input, form validation (via @hookform/resolvers), search param validation (via @tanstack/zod-adapter), and type generation via z.infer.

### 2.8 Authentication — Better Auth

better-auth@^1.6.1 configured with Drizzle adapter, custom user fields (role, gender, telNumber), bcrypt password hashing, JWT + refresh token rotation, email/password, and OAuth (Google, Facebook). A legacy custom JWT system (auth.middleware.ts, syncAuthSession.ts) remains partially wired but is deprecated.

### 2.9 Styling — Tailwind CSS v4 + SCSS + CSS Variables

tailwindcss@^4.1.18 with @tailwindcss/vite plugin, SCSS partials for shared variables and keyframes, and a custom ThemeProvider supporting light/dark/system modes with View Transitions API.

### 2.10 UI Libraries

Radix UI primitives, shadcn/ui (New York style), Floating UI, Framer Motion, Lottie React, Vaul (drawer), Sonner (toasts), Lucide/Font Awesome/React Icons, date-fns, Quill (rich text), react-big-calendar, react-day-picker, Chart.js + react-chartjs-2.

### 2.11 Form Handling

react-hook-form@^7.68.0 with @hookform/resolvers. Each mutation hook creates a useForm instance with zodResolver, coupling validation and mutation in one composable.

### 2.12 Cloudinary

Cloudinary SDK (@cloudinary/react, @cloudinary/url-gen) for image and file uploads with upload widget integration.

### 2.13 Resend

resend@^6.12.3 for transactional email (password reset, notifications).

### 2.14 Build & Dev Tools

Vite 8, TypeScript 5.7 (strict, verbatimModuleSyntax), ESLint (TanStack config), Prettier, Vitest, tsx, pnpm.

---

## 3. Project Architecture

### 3.1 Overall Architecture Style

EduManage follows a Server-Driven React (TanStack Start) architecture with RPC-style server functions. Frontend and backend code coexist under src/, separated by convention.

```
Browser
  -> TanStack Router (file-based route resolution, beforeLoad guards, loaders)
    -> TanStack Query (client cache, useQuery / useMutation)
      -> createServerFn (RPC bridge to server)
        -> Controllers (business logic)
          -> Drizzle ORM (type-safe queries)
            -> Neon PostgreSQL (serverless)
```

### 3.2 Folder Structure

```
src/
  assets/            Static assets
  auth/              Auth page components
  bones/             Boneyard-JS skeleton loading definitions
  components/        Shared UI components
    ui/              shadcn/ui primitives
    sideBar/         Navigation sidebar
    admin/           Admin-specific components
    teacher/         Teacher-specific components
    Dialogs/         CRUD dialogs
    table/           Data table components
    settings/        Settings components
    landing/         Landing page components
  features/          Feature modules (theme)
  hooks/             Custom React hooks (per domain)
  lib/               Utilities (auth, query client, cloudinary)
  providers/         Context providers (largely deprecated)
  routes/            TanStack Router file-based routes
  schemas/           Zod validation schemas
  server/            Server-only code
    db/              Schema, connection, repositories
    modules/         Domain modules with controllers + server functions
    middlewares/     TanStack Start middleware
    utils/           Server utilities
  store/             Zustand stores
  styles/            SCSS partials
  styles.css         Global stylesheet
  types/             TypeScript type definitions
  utils/             Client utilities
```

### 3.3 Domain Module Organisation

Each server module bundles:
- **Controller** (business logic, class-based)
- **Server Functions** (RPC endpoints)
- **Optional Service / Repository**

Client side per domain:
- **Hooks** in src/hooks/{domain}/hooks.ts
- **Components** in src/components/
- **Route files** in src/routes/

### 3.4 Request Lifecycle

1. Navigation triggers route resolution
2. beforeLoad calls getSession() to verify auth
3. Role layout beforeLoad matches user role to route prefix
4. Loader fetches current user and prefetches route data
5. Component renders with data from context or Suspense queries
6. User actions go through useMutation -> createServerFn -> Controller -> Drizzle -> DB

### 3.5 Component Hierarchy

```
RootDocument
  QueryClientProvider
    ThemeProvider
      Toaster (sonner)
        AnimatePresence
          [Public Routes] | [Auth Routes]
          [Role Layout] -> SideBar + TopNav + Breadcrumb + Outlet
            -> Page Component -> Skeleton -> Stat Cards + Filters + Data Table/Cards + Dialogs
```

### 3.6 Separation of Concerns

| Concern | Location |
|---|---|
| Route definitions | src/routes/ |
| Auth guards | beforeLoad in route files |
| Data fetching patterns | src/hooks/{domain}/hooks.ts |
| Validation schemas | src/schemas/ |
| Business logic | src/server/modules/*/controllers |
| RPC layer | src/server/modules/*/server-functions |
| Database access | src/server/db/ + controllers |
| UI components | src/components/ |
| Client state | src/store/ (Zustand) |
| Types | src/types/ + inferred from Zod + Drizzle |

### 3.7 Type Safety Chain

Database Schema (Drizzle) -> Zod Schema (z.infer) -> TypeScript Type

No manual type duplication. Types flow from database through API to UI.

### 3.8 Validation Flow

```
Client: Form -> react-hook-form + zodResolver (client validation)
     -> createServerFn (Zod server validation)
Server: Controller business rules -> Drizzle ORM column type checks
Database: PostgreSQL PK/FK constraints, unique indexes, enums
```

---

## 4. Routing Architecture

### 4.1 Route Tree Structure

TanStack Router with file-based naming (auto-generated routeTree.gen.ts):

| File Pattern | Route |
|---|---|
| __root.tsx | Root layout (HTML shell, providers) |
| index.tsx | / Landing page |
| _auth.tsx | Layout route for authenticated pages |
| _auth/admin.tsx | Admin role layout |
| _auth/admin/dashboard.tsx | /admin/dashboard |
| _auth/admin/students.$studentId.tsx | /admin/students/:studentId |
| _auth/auth.api.$.tsx | Catch-all for Better Auth API |
| log-in.tsx | /log-in |

### 4.2 Nested Layouts

```
__root.tsx
  / (landing), /log-in, /sign-up, /forgot-password, /Pages/*
  _auth.tsx (session guard)
    _auth/admin.tsx (role guard: ADMIN)
      dashboard, calendar, students/*, teachers/*, grades/*, announcements/*, settings
    _auth/teacher.tsx (role guard: TEACHER)
      calendar, classes/*, subjects/*, marks/*, announcements/*, settings
    _auth/student.tsx (role guard: STUDENT)
      calendar, subjects/*, announcements/*, settings
```

### 4.3 Authentication Guards

Three levels:
1. _auth.tsx beforeLoad redirects to /log-in if no session
2. Role layout beforeLoad redirects to correct role route if mismatch
3. Landing page index.tsx redirects authenticated users to their dashboard

### 4.4 Breadcrumb Pattern

Declared per route via staticData.breadcrumb. LayoutBreadcrumb reads useMatches(), filters routes with breadcrumb data, and renders a navigable trail with chevron separators.

### 4.5 Route-Level Data Fetching

Routes use loader for prefetching (queryClient.ensureQueryData) and component-level useQuery / useSuspenseQuery for rendering. Search params (pagination, filters) are validated with zodValidator and drive automatic refetching via loaderDeps.

---

## 5. State Management & Data Fetching

### 5.1 TanStack Query Usage

- queryOptions factory functions per domain for reusable, type-safe configurations
- useSuspenseQuery for Suspense-enabled data
- useQuery with keepPreviousData for paginated lists
- useMutation for all writes with onSuccess cache invalidation

### 5.2 Query Organisation

Query keys follow ['entity', { filters }] convention for granular invalidation. Mutations invalidate by prefix (e.g., ['students']) causing all related queries to refetch.

### 5.3 Local State

- Zustand: useSideBarStore, useSideBarShowStore, useWelcomeSideBarStore
- URL search params: pagination, filters, sorting
- useState: local UI concerns

### 5.4 Global State

No global store for application data. Server state lives in React Query cache. Only sidebar open/close status is globally managed (Zustand).

---

## 6. Backend & Database Architecture

### 6.1 Database Tables

Core Application Tables (15):
- users: Authentication and profile base
- admins: School profile, root of school hierarchy
- grades: Academic levels (1AM, 2AM, etc.)
- classes: Sections within grades (1AM-A, 1AM-B)
- subjects: Academic subjects (Mathematics, Arabic, etc.)
- students: Student profiles linked to users and classes
- teachers: Teacher profiles linked to users
- teacher_assignments: Teacher-Class-Subject assignments (unique triple)
- grade_subjects: Subject configuration per grade (coefficient, weekly hours)
- assessment_periods: Academic periods (Trimester 1, Semester 2, etc.)
- assessments: Tests, exams, quizzes linked to classes and subjects
- student_marks: Individual student scores (unique per assessment-student pair)
- events: Calendar events with optional class/teacher/subject links
- resources: Educational files with type, size, visibility
- announcements: School announcements with audience targeting

Better Auth Tables (3): session, account, verification

### 6.2 Schema Design Patterns

- All primary keys use cuid2 (12 chars) via generateId()
- Every table has createdAt and updatedAt timestamps
- Status column (Active/New/Inactive/Pending) on all major entities for soft-state management
- Composite unique indexes enforce business rules (school + name for grades/subjects)
- Cascade deletes on most FKs; RESTRICT on critical paths (classes -> students)

### 6.3 Database Connection

Single db.ts file initializes Drizzle with Neon HTTP driver and exports the database object with full schema.

### 6.4 Repository Layer

src/server/db/repo/ contains repository implementations. Currently:
- UsersRepository (class-based with IUsersRepository interface)
- EventsRepository (functional CRUD with filter support)

### 6.5 Controller Layer

Each domain has a class-based controller (e.g., StudentsController, TeachersController) with methods implementing business logic. Controllers are imported by server functions and return standardized response types (ApiResponse<T>, PaginatedAPIResponse<T>).

### 6.6 Error Handling

Standardized error types: ValidationError, HTTPError, InternalServerError, DatabaseError. Factory functions (successResponse, validationErrorResponse, etc.) ensure consistent response shapes. Database errors are mapped via mapDbError() handling Postgres error codes (23505, 23503, 23502, 22001).

---

## 7. Authentication & Authorization

### 7.1 Auth Flow

Primary auth is Better Auth with:
- Email/password with bcrypt hashing (12 salt rounds)
- OAuth via Google and Facebook
- JWT session tokens (7-day expiry, 1-day update age)
- Session stored in session table with token, expiry, ipAddress, userAgent
- Session rotation on refresh

### 7.2 Route Protection

- _auth.tsx beforeLoad checks session via getSession()
- Role layouts verify user.role matches route prefix
- Landing page redirects authenticated users to appropriate dashboard

### 7.3 Legacy Auth System

A secondary system exists (auth.middleware.ts with jose JWT verification, syncAuthSession.ts, authStore) that appears to be a prior implementation. It is partially wired but deprecated in favour of Better Auth.

---

## 8. UI/UX Architecture

### 8.1 Design System

Based on shadcn/ui New York style with Tailwind CSS v4. CSS custom properties define a complete design token system (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart, sidebar colors) with light and dark variants.

### 8.2 Component Strategy

Three tiers of components:
1. Primitives (src/components/ui/): 24+ atomic components (button, input, table, dialog, etc.)
2. Shared composites (src/components/): SideBar, TopNav, LayoutBreadcrumb, PaginationComp, etc.
3. Domain-specific (src/components/admin/, src/components/teacher/): Feature-specific components

### 8.3 Responsiveness

- SideBar: Static sidebar on desktop (lg:flex), drawer on mobile (lg:hidden with Vaul)
- Layouts: flex + overflow patterns, max-w-7xl containers
- Responsive breakpoints via Tailwind and useMediaQuery hook
- TopNav: hidden search on small screens with overlay search panel

### 8.4 Theme System

Custom ThemeProvider supporting light, dark, and system modes. Persists to localStorage. Uses View Transitions API for smooth theme switching. System preference changes are detected and applied reactively.

### 8.5 Dashboard Architecture

Admin dashboard displays stat cards (total students, teachers, classes, grades), enrollment chart (Chart.js), quick-action cards, and recent activity table. Data is fetched via server functions with TanStack Query.

### 8.6 Form Architecture

Forms are built with react-hook-form using zodResolver for validation. Each mutation hook encapsulates the form instance, mutation logic, navigation, and toast notifications. The standard-schema resolver (Zod v4 compatible) is used for latest compatibility.

### 8.7 Loading States

Boneyard-JS skeleton system uses JSON bone files defining loading templates for each route. The Skeleton component wraps page content and switches between loading skeleton and actual content. Lottie animations provide additional loading feedback.

### 8.8 Animation System

Framer Motion provides:
- Page entrance animations (fade-in-up, scale-in)
- Staggered children animations
- AnimatePresence for route transitions
- Scroll-triggered animations on landing page
- Custom CSS keyframes in SCSS partials

---

## 9. Strengths of the Project

### 9.1 Modern Stack Cohesion

The TanStack ecosystem (Router + Query + Start) provides a unified, type-safe development experience. Server functions eliminate the need for a separate API layer while maintaining full type safety.

### 9.2 End-to-End Type Safety

Types flow from database schema (Drizzle) through Zod validation to React components without manual duplication. The strict TypeScript configuration (strict, noUnusedLocals, verbatimModuleSyntax) catches errors at compile time.

### 9.3 Clean Domain Separation

Server modules follow a clear Controller -> Service/Repository pattern. Client hooks are organized by domain. The separation of concerns between routes, hooks, components, and server logic is well-maintained.

### 9.4 Comprehensive Data Model

The database schema captures real-world school hierarchy accurately. Composite unique keys prevent data duplication. Proper foreign key relationships with cascade/restrict rules maintain referential integrity.

### 9.5 Rich UI Component Library

24+ reusable shadcn/ui primitives combined with Radix accessibility, CVA variant management, and consistent styling create a solid design system foundation.

### 9.6 Declarative Loading States

The Boneyard-JS skeleton system separates loading state definitions from component logic, allowing designers to define loading templates without touching React code.

### 9.7 Modern Build Pipeline

Vite 8 with Tailwind CSS v4, TypeScript 5.7, and pnpm provides fast builds, HMR, and dependency management.

### 9.8 Serverless-Ready Architecture

Neon Postgres + TanStack Start server functions creates a naturally serverless architecture that can scale without infrastructure management.

### 9.9 Seed Script & Developer Experience

A comprehensive seed script creates realistic test data (two schools with full hierarchies: grades, classes, teachers, students, assignments, assessments, marks, events). The Drizzle Studio integration provides database inspection.

### 9.10 Theme System Maturity

Custom ThemeProvider with View Transitions API, system preference detection, localStorage persistence, and CSS custom properties demonstrates production-grade theming.

---

## 10. Current Weaknesses & Possible Improvements

### 10.1 Dual Auth Systems

The presence of both Better Auth and a custom JWT system (auth.middleware.ts, syncAuthSession.ts, authStore) creates confusion and potential security gaps.

**Recommendation**: Fully migrate to Better Auth and remove all legacy auth code, including:
- src/server/middlewares/auth.middleware.ts
- src/lib/syncAuthSession.ts
- src/store/auth_store.ts
- src/providers/authProvider.tsx
- src/routes/_auth/-check-user-beforeLoad.ts

### 10.2 Inconsistent Server-Function Patterns

Some server functions use standardized response types (ApiResponse / successResponse) while others return raw data. This inconsistency complicates error handling on the client side.

**Recommendation**: Standardize all server functions to use the response type system. Create a base server function wrapper that handles common concerns (auth, error handling, validation).

### 10.3 Single Schema File

The 835-line schema.ts file will become unwieldy as the project grows.

**Recommendation**: Split into per-domain schema files (e.g., schema/users.ts, schema/grades.ts) with a central index.ts for re-exports.

### 10.4 Missing Tests

Only test infrastructure (Vitest, Testing Library) is installed with no tests written.

**Recommendation**: Add tests incrementally:
- Unit tests for controllers (Vitest)
- Integration tests for server functions
- Component tests for key UI components
- E2E tests for critical user flows (Playwright or Cypress)

### 10.5 No API Documentation

Better Auth has OpenAPI plugin configured but no formal API documentation exists for the server functions.

**Recommendation**: Enable OpenAPI/Swagger documentation for all server functions. Document the domain model and business rules.

### 10.6 Incomplete Error Handling

Some server functions lack comprehensive error handling. The error response types are defined but not consistently used.

**Recommendation**: Implement a global error boundary for server functions. Ensure all controllers catch and map database errors properly.

### 10.7 No Rate Limiting

No rate limiting on auth endpoints or server functions.

**Recommendation**: Implement rate limiting via TanStack Start middleware or a reverse proxy layer.

### 10.8 Missing Input Sanitization

The Quill rich-text editor for announcements could introduce XSS vulnerabilities.

**Recommendation**: Sanitize HTML output with DOMPurify (already installed as @types/dompurify but not used). Apply server-side sanitization before storage.

### 10.9 No CI/CD Configuration

No CI pipeline, lint checks, or automated test runs configured.

**Recommendation**: Set up GitHub Actions (or similar) for:
- Lint + type check on PRs
- Test execution on push
- Build verification
- Automated deployment

### 10.10 Partial Repository Pattern

Only users and events have repository classes. Other controllers query Drizzle directly.

**Recommendation**: Either fully adopt the repository pattern or consistently query Drizzle directly. Inconsistency creates maintenance overhead.

### 10.11 No Audit Logging

No tracking of who created/modified/deleted what.

**Recommendation**: Implement an audit_log table with automatic triggers or middleware to track changes to sensitive entities.

### 10.12 StaleTime Configuration

refetchOnWindowFocus: true without a stale time may cause excessive refetches.

**Recommendation**: Set appropriate staleTime per query type (e.g., 30s for active data, 5min for reference data).

---

## 11. Future Ideas & Roadmap

### 11.1 Multi-Tenant Architecture

The schema already supports multi-school via schoolId, but there is no tenant isolation strategy. Future: implement tenant middleware, database schema-per-tenant, or row-level security.

### 11.2 Real-Time Features

- WebSocket-based live notifications (ws library already installed)
- Real-time calendar updates using WebSocket
- Live marks entry with teacher collaboration
- Presence indicators for concurrent editing

### 11.3 Advanced Role System

- Sub-roles (Vice Principal, Department Head, Class Monitor)
- Permission-based access control (RBAC with granular permissions)
- Custom role creation by admin

### 11.4 Reporting & Analytics

- Grade distribution charts
- Student performance trends over time
- Teacher workload analysis
- Attendance tracking module
- Export to PDF/Excel

### 11.5 Notification System

- In-app notification centre (bell icon with badge)
- Email notifications for new marks, announcements, assignments
- Push notifications for mobile
- Configurable notification preferences

### 11.6 AI Integrations

- AI-powered grade analysis and student performance prediction
- Automated report card generation
- Smart scheduling assistant for calendar
- Plagiarism detection for assignments
- AI chatbot for FAQ and support

### 11.7 Offline Support

- Service Worker for offline access
- IndexedDB for local data caching
- Sync queue for offline mutations

### 11.8 Mobile Support

- Progressive Web App (PWA) with manifest and service worker
- React Native or Capacitor for native mobile apps
- Biometric authentication on mobile

### 11.9 Advanced Calendar

- Drag-and-drop event rescheduling
- Recurring event patterns (weekly, bi-weekly, monthly)
- Calendar sharing between teachers
- Integration with Google Calendar / Outlook

### 11.10 Caching Layer

- Redis for server-side caching of frequent queries
- CDN for static assets
- TanStack Query persistent cache (localStorage)

### 11.11 Monitoring & Observability

- Structured logging (pino or winston)
- OpenTelemetry integration
- Sentry for error tracking
- Performance monitoring (Web Vitals already installed)

### 11.12 Infrastructure

- Docker Compose for local development (already present)
- Terraform/Pulumi for cloud infrastructure
- Staging/Production environments
- Blue-green deployment strategy

### 11.13 Testing Infrastructure

- Integration test suite for server functions
- Component tests with Testing Library
- E2E tests with Playwright
- Visual regression tests
- API contract tests

### 11.14 Communication Features

- In-platform messaging between teachers/parents
- Automated email/SMS notifications
- Parent portal for student progress
- Video conferencing integration

---

## 12. Developer Experience

### 12.1 Onboarding

The project has good onboarding foundations:
- Comprehensive seed script generates realistic data
- Drizzle Studio for database inspection
- Clear package.json scripts (dev, build, test, lint, db:*)
- README with basic setup instructions

Improvements needed:
- Add CONTRIBUTING.md with detailed setup guide
- Document environment variable requirements
- Add architecture decision records (ADRs)

### 12.2 Code Quality

- TypeScript strict mode catches many errors
- ESLint with TanStack config enforces consistency
- Prettier for automatic formatting
- Pre-configured dev scripts

### 12.3 Maintainability

Strengths:
- Domain-organized modules
- Consistent hook patterns
- Shared schema and type system
- shadcn/ui component conventions

Weaknesses:
- Single large schema file
- Some deprecated code paths
- Inconsistent error handling patterns

### 12.4 Debugging Experience

- TanStack Query DevTools available
- TanStack Router DevTools available
- Vite HMR for fast iteration
- Console logging in auth flow (should be removed in production)

### 12.5 Team Scalability

The current architecture supports teams of 3-5 developers well. As the team grows, the project would benefit from:
- Stricter module boundaries
- API documentation
- Feature flags
- Package-based monorepo (e.g., Turborepo)

---

## 13. Suggested Best Practices

### 13.1 Security

- Hash all secrets and API keys (already using env vars)
- Implement CSRF protection for server functions
- Add rate limiting to auth endpoints
- Sanitize all user-generated HTML with DOMPurify
- Implement proper CORS policies
- Add security headers (CSP, HSTS, X-Frame-Options)
- Regular dependency audits (pnpm audit)

### 13.2 Code Organisation

- Keep schema.ts under 500 lines by splitting into domain files
- Remove all dead/deprecated code (legacy auth)
- Standardise server function response patterns
- Use barrel exports (index.ts) consistently
- Adopt feature flags for incremental rollouts

### 13.3 Database

- Write database migrations for all schema changes
- Add indexes for all query patterns
- Use database transactions for multi-table operations
- Implement soft deletes consistently
- Add database-level audit triggers

### 13.4 Performance

- Implement proper staleTime/gcTime in React Query
- Use React.lazy and Suspense for code splitting
- Optimize bundle size with Vite analysis
- Implement image optimization (Cloudinary already handles this)
- Use proper pagination for all list views

### 13.5 Testing

- Write unit tests for all controllers
- Write integration tests for critical server functions
- Implement component tests for shared UI
- Add E2E tests for core user flows
- Achieve minimum 70% code coverage
- Run tests in CI pipeline

### 13.6 Documentation

- Document all server function inputs and outputs
- Maintain architecture decision records (ADRs)
- Keep README up to date
- Document environment setup in CONTRIBUTING.md
- Add JSDoc comments to public APIs

### 13.7 CI/CD

- Run lint + type check on every PR
- Run test suite on push
- Build verification before merge
- Automated deployment to staging
- Manual approval gate to production
- Health checks post-deployment

### 13.8 Monitoring

- Set up error tracking (Sentry or similar)
- Implement structured logging
- Add performance monitoring
- Set up uptime monitoring
- Configure alerting for critical errors

---

## 14. Conclusion

EduManage is a well-architected, modern full-stack school management platform that demonstrates strong engineering fundamentals. The choice of the TanStack ecosystem (Start + Router + Query) creates a cohesive, type-safe development experience that is ahead of many comparable projects. The domain-driven module organisation, comprehensive database schema, and rich UI component library provide a solid foundation for continued development.

**Architecture Maturity**: The project has evolved past the initial prototyping phase and shows production-quality patterns in routing, state management, and component architecture. The presence of legacy code (dual auth systems) indicates organic growth, which is normal and should be addressed in a cleanup phase.

**Scalability Potential**: The serverless-friendly architecture (Neon Postgres, TanStack Start server functions, Cloudinary for media) can scale well for hundreds of schools. Multi-tenancy is already designed into the schema via schoolId. With proper caching, rate limiting, and infrastructure automation, the platform could support thousands of concurrent users.

**Engineering Direction**: The primary recommendations are:
1. Clean up deprecated code paths
2. Add comprehensive test coverage
3. Standardise patterns (error handling, response types)
4. Implement CI/CD and monitoring
5. Expand real-time, analytics, and notification capabilities

These improvements will mature the project from a well-structured MVP into a robust, production-grade SaaS platform ready for wider adoption.
