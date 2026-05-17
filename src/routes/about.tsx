import { createFileRoute, Link } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import {
  Icon,
  Section,
  FadeIn,
  Navbar,
  Footer,
} from '#/components/landing/landing-shared'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'About - EduManage',
      },
    ],
  }),
})

function Hero() {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
        <div className="absolute top-20 right-0 size-100 rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-400/5" />
      </div>

      <Section>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-white/4 dark:text-slate-300">
              <span className="inline-block size-1.5 rounded-full bg-primary animate-pulse" />
              Our Story
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Transforming education{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  worldwide
                </span>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
              We&apos;re on a mission to make school management simple,
              efficient, and accessible for every educational institution.
            </p>
          </FadeIn>
        </div>
      </Section>
    </div>
  )
}

function Story() {
  return (
    <div className="border-y border-slate-200/60 bg-slate-50/50 dark:border-white/6border-white/[0.06] dark:bg-white/2">
      <Section className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                Our Story
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Built by educators, for educators
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                <p>
                  EduManage was born in a small classroom in 2020, when our
                  founder realized how much time teachers spent on
                  administrative work instead of teaching. What started as a
                  simple attendance tracker has grown into a comprehensive
                  school management platform used by over 50 schools worldwide.
                </p>
                <p>
                  Today, our team of 30+ engineers, former educators, and
                  designers work tirelessly to build tools that genuinely make a
                  difference in how schools operate. Every feature we ship is
                  tested and validated by real teachers and administrators.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="relative">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl shadow-slate-900/5 dark:border-white/8 dark:bg-white/3 dark:shadow-black/30">
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-linear-to-br from-primary/5 to-blue-500/5">
                  <div className="text-center">
                    <Icon
                      name="diversity_3"
                      className="text-7xl text-primary/30 dark:text-primary/20"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-lg dark:border-white/8 dark:bg-surface-dark sm:-right-8 sm:-bottom-6">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Schools Trust Us
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  50+
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
    </div>
  )
}

function Mission() {
  const items = [
    {
      icon: 'visibility',
      title: 'Our Vision',
      desc: 'A world where teachers spend less time on paperwork and more time inspiring young minds. We envision schools that operate seamlessly, leaving room for what truly matters: education.',
    },
    {
      icon: 'flag',
      title: 'Our Mission',
      desc: 'To provide an intuitive, all-in-one platform that simplifies school management, enhances communication, and empowers educators with data-driven insights.',
    },
  ]

  return (
    <Section className="py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {items.map((item, i) => (
          <FadeIn key={item.title} delay={i * 100}>
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                <Icon name={item.icon} className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

function Stats() {
  const items = [
    { icon: 'school', value: '50+', label: 'Schools' },
    { icon: 'groups', value: '10k+', label: 'Active Students' },
    { icon: 'cast_for_education', value: '500+', label: 'Teachers' },
    { icon: 'public', value: '12', label: 'Countries' },
  ]

  return (
    <div className="border-y border-slate-200/60 bg-slate-50/50 dark:border-white/6border-white/[0.06] dark:bg-white/2">
      <Section className="py-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((s, i) => (
            <FadeIn key={s.label} delay={i * 80}>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/10">
                  <Icon name={s.icon} className="text-2xl" />
                </div>
                <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {s.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Values() {
  const values = [
    {
      icon: 'lightbulb',
      title: 'Innovation',
      desc: 'We continuously push boundaries to deliver modern solutions that anticipate the evolving needs of education.',
    },
    {
      icon: 'handshake',
      title: 'Trust',
      desc: 'Data security and reliability are at our core. Schools trust us with their most sensitive information.',
    },
    {
      icon: 'support',
      title: 'Support',
      desc: 'Our dedicated team provides responsive, human-centered support to ensure your success every step of the way.',
    },
    {
      icon: 'auto_graph',
      title: 'Impact',
      desc: 'We measure our success by the real-world impact we create — more time for teaching, better outcomes for students.',
    },
  ]

  return (
    <Section className="py-24 sm:py-32">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Core Values
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            What drives us
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            The principles that guide every decision we make.
          </p>
        </div>
      </FadeIn>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <FadeIn key={v.title} delay={i * 80}>
            <div className="group flex h-full flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
              <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                <Icon name={v.icon} className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {v.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {v.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

function CTA() {
  return (
    <Section className="py-24 sm:py-32">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-slate-900 to-slate-800 px-6 py-16 text-center shadow-2xl dark:border-white/8 sm:px-12 sm:py-24">
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Join us in shaping the future
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Whether you&apos;re a school looking for better management or an
              educator wanting to make an impact, we&apos;d love to hear from
              you.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Started Free
                <Icon
                  name="arrow_forward"
                  className="text-lg transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}

function RouteComponent() {
  return (
    <Skeleton name="about" loading={false}>
      <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100">
        <Navbar />
        <main>
          <Hero />
          <Story />
          <Mission />
          <Stats />
          <Values />
          <CTA />
        </main>
        <Footer />
      </div>
    </Skeleton>
  )
}
