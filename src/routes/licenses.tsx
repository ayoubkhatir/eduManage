import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/licenses')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Licenses - EduManage' }] }),
})

const licenses = [
  { name: 'React', license: 'MIT', desc: 'A JavaScript library for building user interfaces.' },
  { name: 'TanStack Router', license: 'MIT', desc: 'Type-safe routing for React applications.' },
  { name: 'Tailwind CSS', license: 'MIT', desc: 'A utility-first CSS framework.' },
  { name: 'Material Symbols', license: 'Apache 2.0', desc: 'Icon library by Google.' },
  { name: 'Lexend', license: 'OFL', desc: 'Font family by Bonnie Baker.' },
  { name: 'Manrope', license: 'OFL', desc: 'Font family by Michael Sharanda.' },
  { name: 'Vite', license: 'MIT', desc: 'Next-generation frontend tooling.' },
  { name: 'TypeScript', license: 'Apache 2.0', desc: 'Typed superset of JavaScript.' },
]

function RouteComponent() {
  return (
    <Skeleton name="licenses" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Legal</p>
                  <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Open Source Licenses
                  </h1>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                    EduManage is built on the shoulders of open source software. We are grateful to these projects and their contributors.
                  </p>
                </div>
              </FadeIn>

              <div className="mt-12 space-y-4">
                {licenses.map((l, i) => (
                  <FadeIn key={l.name} delay={i * 60}>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/6border-white/[0.06] dark:bg-white/3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{l.name}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{l.desc}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{l.license}</span>
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
