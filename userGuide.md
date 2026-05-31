# EduManage User Guide

EduManage is a school management web app for administrators, teachers, and students. It provides role-based dashboards for calendars, announcements, grades, classes, subjects, student records, and account settings.

Visitors should use the public site at https://edumanage.vercel.app.

## Who This Guide Is For

- School administrators who manage teachers, students, grades, calendars, and announcements.
- Teachers who review classes, subject resources, marks, and school events.
- Students who view their calendar, subjects, announcements, and profile settings.

## Getting Started

### For Visitors

- Open https://edumanage.vercel.app to browse the public-facing site.
- Visitor pages are for learning about the product, not for school operations.
- If you need access to school data, sign in with an admin, teacher, or student account.

1. Install dependencies.

   ```bash
   pnpm install
   ```

2. Start the app in development mode.

   ```bash
   pnpm dev
   ```

3. Open the app in your browser.

   The development server runs on port 4000.

## Sign In and Account Access

- Use the login page to sign in with your assigned role.
- The app redirects authenticated users to the correct area automatically:
  - Admin users go to the admin dashboard.
  - Teachers go to the teacher calendar.
  - Students go to the student calendar.
- Admin login supports social sign-in options in addition to the standard form.
- If you forget your password, use the forgot password flow and then complete the reset password page from the emailed token.

## Main Areas

### Administrator Area

Admins see the broadest set of tools and can manage the school from a single interface.

Main sections:

- Dashboard
- Calendar
- Grades
- Teachers
- Students
- Announcements
- Settings

Common admin tasks:

- Add and manage teachers.
- Add and manage students.
- Create or review announcements.
- Manage school calendar events.
- Organize grades and classes.
- Open teacher assignment screens to connect teachers to classes and subjects.

### Teacher Area

Teachers work from a focused dashboard centered on class instruction and communication.

Main sections:

- Calendar
- Classes
- Subjects
- Announcements
- Settings

Common teacher tasks:

- View school events on the calendar.
- Review assigned classes and drill into class details.
- Browse subject resources.
- Open marks for a class.
- Create and review announcements.
- Update teacher profile and account settings.

### Student Area

Students get a read-only experience centered on their schedule and school communication.

Main sections:

- Calendar
- Subjects
- Announcements
- Settings

Common student tasks:

- Check the school calendar.
- View subject resources.
- Read announcements.
- Update personal settings.

## Key Workflows

### Viewing the Calendar

- Admins can view and manage school events.
- Teachers see the school calendar in read-only mode.
- Students also view the calendar in read-only mode.

### Managing Announcements

- Admins and teachers can create announcements.
- Students can only read announcements.
- Announcement lists support search and filtering.
- Each role has its own announcement detail page.

### Managing Teachers and Assignments

- Admins can add teachers and assign them to classes and subjects.
- Admins can open a teacher’s assignment page to manage current assignments.
- Teacher assignment pages support marking a teacher as primary for a class.

### Managing Students

- Admins can add students and open student detail pages.
- Student lists support search, filters, and pagination.

### Grades and Classes

- Admins manage grades and class organization.
- Teachers can open class detail pages to review assigned teachers, student counts, schedules, and marks.

## Navigation Tips

- Use the left sidebar inside each role area to move between sections.
- Use the top navigation and breadcrumb trail to understand where you are in the app.
- Most list pages support search, filters, and pagination.
- Detail pages are usually opened from a list or table row.

## Data and Setup Notes

- The app uses Drizzle for schema and migration management.
- Seed data is available through the `pnpm db:seed` script.
- Database migrations are available through the `pnpm db:generate` and `pnpm db:migrate` scripts.
- The app uses Better Auth for authentication and role-based access control.

## Common Scripts

- `pnpm dev` - start the development server.
- `pnpm build` - build the app for production.
- `pnpm preview` - preview the production build locally.
- `pnpm test` - run tests.
- `pnpm lint` - run ESLint.
- `pnpm format` - check formatting.
- `pnpm check` - format and lint fix pass.
- `pnpm db:seed` - populate the database with seed data.

## Troubleshooting

- If you are redirected away from a page, your account role may not have access to that section.
- If a page shows loading forever, confirm that the backend session and query data are available.
- If login succeeds but the app still looks unauthenticated after refresh, sign out and back in so the auth state can rehydrate cleanly.
- If calendar or announcement data is missing, check that the database has been migrated and seeded.

## Project Summary

EduManage is organized around three roles and a shared authentication system:

- Admins manage the school.
- Teachers manage classes, subjects, and announcements.
- Students consume schedules, subjects, and announcements.

The app is built as a TanStack Start application with file-based routing, role-aware layouts, and database-backed data fetching.