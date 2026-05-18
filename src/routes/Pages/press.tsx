import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/press')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Press - EduManage' }] }),
})

const releases = [
  { title: 'EduManage Raises $20M Series A to Expand School Management Platform', date: 'Mar 15, 2026', source: 'TechCrunch', desc: 'The funding will be used to accelerate product development and expand into new markets across Europe and Asia.' },
  { title: 'EduManage Partners with 50 New Schools in Q1 2026', date: 'Feb 2, 2026', source: 'Education Week', desc: 'The platform now serves over 10,000 students worldwide, with particularly strong adoption in the UK and Middle East.' },
  { title: 'How EduManage Is Bridging the Gap Between Teachers and Parents', date: 'Dec 10, 2025', source: 'Forbes Education', desc: 'By providing real-time communication tools and transparency into student progress, EduManage is redefining parental engagement.' },
  { title: 'EduManage Launches Free Tier for Small Schools', date: 'Nov 5, 2025', source: 'EdSurge', desc: 'The free tier includes core features for up to 50 students, making quality school management accessible to all.' },
]

function RouteComponent() {
  return (
    <Skeleton name="press" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Press</p>
                  <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Press & media
                  </h1>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    Latest news, announcements, and media coverage about EduManage.
                  </p>
                </div>
              </FadeIn>

              <div className="mt-4 flex justify-center">
                <a href="mailto:press@edumanage.com" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary">
                  <Icon name="mail" className="text-base" /> press@edumanage.com
                </a>
              </div>

              <div className="mt-12 space-y-6">
                {releases.map((r, i) => (
                  <FadeIn key={r.title} delay={i * 80}>
                    <div className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{r.source}</span>
                        <span className="text-slate-400">{r.date}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{r.desc}</p>
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
