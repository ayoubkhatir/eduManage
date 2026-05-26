import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/documentation')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Documentation - EduManage' }] }),
})

const sections = [
  { icon: 'rocket_launch', title: 'Getting Started', desc: 'Set up your school, invite staff, and import student data in minutes.', count: '12 articles' },
  { icon: 'school', title: 'Student Management', desc: 'Enroll, track, and manage student profiles, attendance, and grades.', count: '18 articles' },
  { icon: 'payments', title: 'Fee Management', desc: 'Configure billing, process payments, and manage invoicing.', count: '9 articles' },
  { icon: 'calendar_month', title: 'Scheduling', desc: 'Create timetables, manage events, and handle room assignements.', count: '14 articles' },
  { icon: 'chat', title: 'Communication', desc: 'Send messages, announcements, and notifications to parents and staff.', count: '7 articles' },
  { icon: 'bar_chart', title: 'Reports & Analytics', desc: 'Generate reports, visualize data, and export insights.', count: '11 articles' },
  { icon: 'api', title: 'API Reference', desc: 'Integrate EduManage with your existing tools and workflows.', count: '24 articles' },
  { icon: 'settings', title: 'Administration', desc: 'Manage users, roles, permissions, and system settings.', count: '16 articles' },
]

function RouteComponent() {
  return (
    <Skeleton name="documentation" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Documentation</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Guides & references
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Everything you need to get the most out of EduManage.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sections.map((s, i) => (
                <FadeIn key={s.title} delay={i * 60}>
                  <a href="#" className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                      <Icon name={s.icon} className="text-xl" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-400">{s.desc}</p>
                    <span className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">{s.count}</span>
                  </a>
                </FadeIn>
              ))}
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
