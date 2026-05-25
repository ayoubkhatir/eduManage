import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { Link } from '@tanstack/react-router'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/pricing')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Pricing - EduManage' }] }),
})

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Perfect for small schools exploring digital management.',
    features: ['Up to 50 students', 'Basic attendance tracking', 'Grade management', 'Email support'],
    cta: 'Get Started',
    href: '/sign-up',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/month',
    desc: 'Ideal for growing schools with advancing needs.',
    features: ['Up to 500 students', 'Advanced analytics', 'Fee management', 'Communication hub', 'Priority support'],
    cta: 'Start Free Trial',
    href: '/sign-up',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For large institutions requiring tailored solutions.',
    features: ['Unlimited students', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'On-premise option', '24/7 support'],
    cta: 'Contact Sales',
    href: '/#contact',
    featured: false,
  },
]

function RouteComponent() {
  return (
    <Skeleton name="pricing" loading={false}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Simple, transparent pricing
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  No hidden fees. No surprises. Start free and scale as you grow.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {plans.map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100}>
                  <div className={`group relative flex h-full flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    plan.featured
                      ? 'border-primary/40 bg-white shadow-lg shadow-primary/10 dark:border-primary/40 dark:bg-white/5'
                      : 'border-slate-200/80 bg-white dark:border-white/6border-white/[0.06] dark:bg-white/3'
                  }`}>
                    {plan.featured && (
                      <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                        {plan.period && <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>}
                      </div>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{plan.desc}</p>
                    </div>
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                          <Icon name="check" className="text-lg text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={plan.href as any}
                      className={`mt-8 flex items-center justify-center rounded-full py-3 text-sm font-semibold transition-all ${
                        plan.featured
                          ? 'bg-primary text-white shadow-sm shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5'
                          : 'border border-slate-200 text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:text-primary'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Section>
        </div>
      </PageLayout>
      </motion.div>
    </Skeleton>
  )
}
