import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/careers')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Careers - EduManage' }] }),
})

const roles = [
  { title: 'Senior Software Engineer', type: 'Full-time', location: 'Remote / London', dept: 'Engineering' },
  { title: 'Product Designer', type: 'Full-time', location: 'London / Berlin', dept: 'Design' },
  { title: 'Customer Success Manager', type: 'Full-time', location: 'Remote', dept: 'Success' },
  { title: 'Data Analyst', type: 'Full-time', location: 'London', dept: 'Data' },
  { title: 'Marketing Lead', type: 'Full-time', location: 'Remote', dept: 'Marketing' },
]

function RouteComponent() {
  return (
    <Skeleton name="careers" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Careers</p>
                  <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Join our mission
                  </h1>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Help us build the future of education technology. We&apos;re looking for passionate people who want to make a difference.
                  </p>
                </div>
              </FadeIn>

              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Icon name="public" className="text-base" /> Remote-friendly</span>
                <span className="flex items-center gap-1"><Icon name="heart_plus" className="text-base" /> Great benefits</span>
                <span className="flex items-center gap-1"><Icon name="trending_up" className="text-base" /> Growth opportunities</span>
              </div>

              <div className="mt-12 space-y-4">
                {roles.map((r, i) => (
                  <FadeIn key={r.title} delay={i * 60}>
                    <div className="group flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{r.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>{r.dept}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>{r.type}</span>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span>{r.location}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                        Apply Now <Icon name="arrow_forward" className="text-base" />
                      </span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn delay={200}>
                <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-8 text-center dark:border-white/6border-white/[0.06] dark:bg-white/2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Don&apos;t see the right role?</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We&apos;re always looking for talented people. Send us your resume.</p>
                  <a href="mailto:careers@edumanage.com" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30">
                    careers@edumanage.com
                  </a>
                </div>
              </FadeIn>
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
