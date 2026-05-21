import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/_auth/Pages/changelog')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Changelog - EduManage' }] }),
})

const entries = [
  { version: '2.4.0', date: 'May 12, 2026', changes: ['New analytics dashboard with custom report builder', 'Parent-teacher meeting scheduler', 'Improved mobile responsiveness', 'API rate limit increased to 1000 req/min'] },
  { version: '2.3.0', date: 'Apr 1, 2026', changes: ['Bulk student import from CSV/Excel', 'Automated fee reminders via email and SMS', 'Gradebook templates for different grading systems', 'Performance optimizations across the platform'] },
  { version: '2.2.0', date: 'Feb 15, 2026', changes: ['Real-time attendance tracking with QR codes', 'Integrated messaging system', 'Role-based permission presets', 'Dark mode improvements'] },
  { version: '2.1.0', date: 'Jan 5, 2026', changes: ['Multi-language support (EN, FR, ES, AR)', 'Calendar sync with Google Calendar', 'Enhanced search functionality', 'Accessibility improvements (WCAG 2.1 AA)'] },
  { version: '2.0.0', date: 'Nov 20, 2025', changes: ['Complete UI redesign', 'Mobile app (iOS & Android)', 'Offline mode for attendance tracking', 'New API v2', 'Subscription management portal'] },
]

function RouteComponent() {
  return (
    <Skeleton name="changelog" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Changelog</p>
                  <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    What&apos;s new
                  </h1>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Stay up to date with the latest features and improvements.
                  </p>
                </div>
              </FadeIn>

              <div className="mt-16 space-y-8">
                {entries.map((entry, i) => (
                  <FadeIn key={entry.version} delay={i * 60}>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/6border-white/[0.06] dark:bg-white/3 sm:p-8">
                      <div className="flex items-baseline justify-between">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">v{entry.version}</h2>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{entry.date}</span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {entry.changes.map((c) => (
                          <li key={c} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                            <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
