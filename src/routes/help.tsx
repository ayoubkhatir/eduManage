import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/help')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Help Center - EduManage' }] }),
})

const topics = [
  { icon: 'account_circle', title: 'Account & Billing', desc: 'Manage your account, subscription, and payment methods.' },
  { icon: 'school', title: 'Students & Classes', desc: 'Enrolling students, creating classes, and managing rosters.' },
  { icon: 'assignment', title: 'Grades & Reports', desc: 'Recording grades, generating report cards, and analyzing performance.' },
  { icon: 'payments', title: 'Fees & Invoices', desc: 'Setting up fee structures, processing payments, and managing invoices.' },
  { icon: 'calendar_month', title: 'Scheduling', desc: 'Creating timetables, booking rooms, and managing the academic calendar.' },
  { icon: 'chat', title: 'Communication', desc: 'Sending announcements, messaging parents, and managing notifications.' },
  { icon: 'security', title: 'Privacy & Security', desc: 'Data protection, user permissions, and security best practices.' },
  { icon: 'sync', title: 'Integrations', desc: 'Connecting EduManage with your other tools and platforms.' },
]

function RouteComponent() {
  return (
    <Skeleton name="help" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Help Center</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  How can we help?
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Find answers to common questions and learn how to make the most of EduManage.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topics.map((t, i) => (
                <FadeIn key={t.title} delay={i * 60}>
                  <a href="#" className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                      <Icon name={t.icon} className="text-xl" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.desc}</p>
                  </a>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={300}>
              <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 text-center dark:border-white/6border-white/[0.06] dark:bg-white/2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Still need help?</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Our support team is available 24/7 to assist you.</p>
                <a href="mailto:support@edumanage.com" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
                  <Icon name="mail" className="text-base" /> Contact Support
                </a>
              </div>
            </FadeIn>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
