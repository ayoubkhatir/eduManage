import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/community')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Community - EduManage' }] }),
})

const channels = [
  { icon: 'forum', title: 'Discussion Forums', desc: 'Ask questions, share tips, and connect with other EduManage users.' },
  { icon: 'lightbulb', title: 'Feature Requests', desc: 'Suggest and vote on new features to help shape our roadmap.' },
  { icon: 'groups', title: 'User Groups', desc: 'Join regional and interest-based groups to network with peers.' },
  { icon: 'school', title: 'Webinars & Events', desc: 'Attend live training sessions, Q&As, and community meetups.' },
]

function RouteComponent() {
  return (
    <Skeleton name="community" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Community</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Together we grow
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Join a global community of educators, administrators, and innovators shaping the future of education.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {channels.map((c, i) => (
                <FadeIn key={c.title} delay={i * 80}>
                  <a href="#" className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                      <Icon name={c.icon} className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.desc}</p>
                  </a>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={200}>
              <div className="mt-12 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Community coming soon! Sign up to be notified when we launch.
                </p>
              </div>
            </FadeIn>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
