# src/ Folder Structure

| Folder          | Purpose                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **assets/**     | Static files — loading animation (Lottie), school logo SVG, favicon                                                       |
| **auth/**       | Auth page modules — login, signup, forgot-password, reset-password forms                                                  |
| **bones/**      | `.bones.json` route/page definitions for `boneyard-js` (generates UI/route structure)                                     |
| **components/** | Shared React UI components — primitives (shadcn-style), admin/teacher/landing/settings-specific, sidebar, etc.            |
| **features/**   | Feature-based modules — currently just `theme/` (light/dark/auto mode)                                                    |
| **hooks/**      | Custom React hooks — domain-specific (admin, auth, classes, grades, etc.) + general-purpose (debounce, media-query, etc.) |
| **lib/**        | Core services — auth session, Cloudinary SDK, TanStack Query client, utility functions (`cn`)                             |
| **providers/**  | React context providers — currently just a commented-out `authProvider` (auth now handled elsewhere)                      |
| **routes/**     | TanStack Router route tree — root layout, auth guard, admin/teacher/student dashboards, landing, auth pages, static Pages |
| **schemas/**    | Zod validation schemas — for forms and API payloads (auth, announcements, classes, grades, etc.)                          |
| **server/**     | Backend code — Drizzle ORM DB setup, schema, repos, middlewares, domain modules (auth, announcements, classes, etc.)      |
| **store/**      | Zustand state stores — all currently commented out (migration away from this approach)                                    |
| **styles/**     | Global CSS/SCSS — variables, keyframes, calendar overrides, Quill editor styles                                           |
| **types/**      | TypeScript type definitions — domain models (auth, announcements, classes, etc.)                                          |
| **utils/**      | Client-side utilities — Better Auth client instance, `cleanEmptyParams`                                                   |
