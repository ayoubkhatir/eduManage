import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/_auth/Pages/security')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Security - EduManage' }] }),
})

const features = [
  { icon: 'encryption', title: 'End-to-End Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your information stays private and secure.' },
  { icon: 'verified_user', title: 'SOC 2 Compliant', desc: 'We undergo rigorous third-party audits to ensure our security controls meet the highest industry standards.' },
  { icon: 'shield', title: 'Access Control', desc: 'Role-based access control ensures that users only see what they need. Granular permissions for every action.' },
  { icon: 'backup', title: 'Automated Backups', desc: 'Data is backed up every 6 hours across multiple geographic regions. Recovery point objective under 15 minutes.' },
  { icon: 'monitoring', title: 'Threat Monitoring', desc: '24/7 automated threat detection and response. Suspicious activities are flagged and blocked in real-time.' },
  { icon: 'gpp_maybe', title: 'Incident Response', desc: 'Dedicated security team with a documented incident response plan. Average response time under 30 minutes.' },
]

function RouteComponent() {
  return (
    <Skeleton name="security" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
            <div className="absolute top-40 right-0 size-100 rounded-full bg-emerald-400/10 blur-[100px] dark:bg-emerald-400/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Security</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Your data is safe with us
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  We implement enterprise-grade security measures to protect every piece of data in our platform.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <FadeIn key={f.title} delay={i * 80}>
                  <div className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                      <Icon name={f.icon} className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
