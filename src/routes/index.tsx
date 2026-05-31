import { motion } from 'framer-motion'
import { ModeToggle } from '#/features/theme/mode-toggle'
import useWelcomeSideBarStore from '#/store/welcome_store'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { UserRoleEnum } from '#/server/db/schema'
import { useEffect, useState } from 'react'
import {
  Icon,
  Section,
  FadeIn,
  Footer,
} from '#/components/landing/landing-shared'
import { getSession } from '#/lib/auth'

const getRedirectToFromRole = (role: UserRoleEnum) =>
  role === UserRoleEnum.ADMIN
    ? '/admin/dashboard'
    : `/${role.toLowerCase()}/calendar`

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const authState = await getSession()
    if (authState && authState.user) {
      const role = authState.user.role
      throw redirect({ to: getRedirectToFromRole(role) })
    }
  },
  // staticData: {
  //   breadcrumb: ['EduManage', 'Home'],
  // },
  component: App,
  head: () => ({
    meta: [
      {
        title: 'EduManage',
      },
    ],
  }),
})

/* ─── Navbar ─── */
function Navbar() {
  const toggleSideBar = useWelcomeSideBarStore((s) => s.toggle)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Roles', href: '#roles' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 overflow-x-hidden transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto w-full flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-soft text-white shadow-md shadow-primary/20 transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
            <Icon name="school" className="text-xl" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            EduManage
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ModeToggle />
          <button
            className="md:hidden cursor-pointer rounded-xl p-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
            onClick={toggleSideBar}
            aria-label="Open menu"
          >
            <Icon name="menu" className="text-[22px]" />
          </button>
          <Link
            to="/log-in"
            search={{
              role: UserRoleEnum.ADMIN,
              redirectTo: '/admin/dashboard',
            }}
            className="hidden sm:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95"
          >
            Sign in
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

/* ─── Mobile sidebar (replaces SideBar component) ─── */
function MobileSidebar() {
  const isOpen = useWelcomeSideBarStore((s) => s.isOpen)
  const close = useWelcomeSideBarStore((s) => s.closeSideBar)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const links = [
    { label: 'Features', id: 'features' },
    { label: 'Roles', id: 'roles' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <div
      className={`fixed inset-x-0 top-16 bottom-0 z-50 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      <button
        className="cursor-pointer absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={close}
        aria-label="Close menu"
      />
      <aside
        className="absolute right-0 top-0 h-full w-72 max-w-[85vw] border-l border-slate-200/60 bg-white shadow-2xl dark:border-white/6 dark:bg-background-dark transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex flex-col gap-1 p-4">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault()
                close()
                document
                  .getElementById(l.id)
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/log-in"
            search={{
              role: UserRoleEnum.ADMIN,
              redirectTo: '/admin/dashboard',
            }}
            className="mt-3 flex items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            onClick={close}
          >
            Sign in
          </Link>
        </div>
      </aside>
    </div>
  )
}

/* ─── DashboardPreview ─── */
function DashboardPreview() {
  const statCards = [
    { icon: 'school', color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400', label: 'Total Students', value: '2,450' },
    { icon: 'badge', color: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400', label: 'Total Teachers', value: '128' },
    { icon: 'workspaces', color: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400', label: 'Total Grades', value: '12' },
    { icon: 'meeting_room', color: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400', label: 'Total Classes', value: '48' },
  ]

  const quickActions = ['Add Teacher', 'Add Student', 'Add Announcement', 'Add Grade']

  const recentActivities = [
    { initials: 'JD', bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-300', name: 'John Doe', detail: 'New Registration', role: 'Student', roleBg: 'bg-blue-100 dark:bg-blue-500/20', roleText: 'text-blue-800 dark:text-blue-300', action: 'Completed enrollment form', time: '2 mins ago' },
    { initials: 'SM', bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-300', name: 'Sarah Miller', detail: 'Fee Payment', role: 'Parent', roleBg: 'bg-purple-100 dark:bg-purple-500/20', roleText: 'text-purple-800 dark:text-purple-300', action: 'Paid tuition for Q3', time: '15 mins ago' },
  ]

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl shadow-slate-900/5 dark:border-white/8 dark:bg-white/3 dark:shadow-black/30">
      <div className="overflow-hidden rounded-xl bg-white dark:bg-slate-900">
        {/* Dashboard inner */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Header */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Dashboard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overview of your school&apos;s performance</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-lg border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex size-7 items-center justify-center rounded-lg ${card.color}`}>
                    <span className="material-symbols-outlined text-sm">{card.icon}</span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <span className="material-symbols-outlined text-[10px]">trending_up</span>
                    +12%
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart area */}
            <div className="lg:col-span-2 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enrollment Growth</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Academic Year 2023-2024</p>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                  Last 6 Months
                </div>
              </div>
              {/* Mini chart SVG */}
              <svg viewBox="0 0 300 100" className="w-full h-24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q25,70 50,60 T100,45 T150,35 T200,30 T250,20 T300,10"
                  fill="none"
                  stroke="rgb(59,130,246)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0,80 Q25,70 50,60 T100,45 T150,35 T200,30 T250,20 T300,10 L300,100 L0,100 Z"
                  fill="url(#chartGrad)"
                />
                {/* Dots */}
                {[0, 50, 100, 150, 200, 250, 300].map((x, i) => (
                  <circle key={i} cx={x} cy={[80, 60, 45, 35, 30, 20, 10][i]} r="3" fill="rgb(59,130,246)" stroke="white" strokeWidth="1.5" />
                ))}
              </svg>
            </div>

            {/* Quick Actions + System Status */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/30 p-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <div key={action} className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-2.5 transition-all hover:border-primary/30 hover:bg-primary/5">
                      <span className="material-symbols-outlined text-lg text-slate-400 dark:text-slate-500">group_add</span>
                      <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-300">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary to-blue-700 p-4 shadow-md">
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-yellow-300 text-sm">verified</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">System Status</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">All Systems Normal</h4>
                  <p className="text-[10px] text-white/70">Server maintenance scheduled for Sunday, 2:00 AM.</p>
                </div>
                <span className="material-symbols-outlined absolute -bottom-3 -right-3 text-6xl text-white/10">dns</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activities</h4>
              <button type="button" className="text-[10px] font-semibold text-primary hover:text-primary/80">View All</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-2.5">User / Event</th>
                  <th className="px-4 py-2.5">Role</th>
                  <th className="px-4 py-2.5">Action Type</th>
                  <th className="px-4 py-2.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {recentActivities.map((row, i) => (
                  <tr key={i} className="transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`flex size-7 items-center justify-center rounded-full ${row.bg} ${row.text} text-[10px] font-bold`}>
                          {row.initials}
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-slate-900 dark:text-white">{row.name}</p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400">{row.detail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center rounded-full ${row.roleBg} ${row.roleText} px-2 py-0.5 text-[9px] font-medium`}>
                        {row.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-[11px] text-slate-700 dark:text-slate-300">{row.action}</p>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{row.time}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
        <div className="absolute top-20 right-0 size-100 rounded-full bg-blue-400/10 blur-[100px] dark:bg-blue-400/5" />
      </div>

      <Section>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Badge */}
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-white/4 dark:text-slate-300">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now used by 50+ schools worldwide
            </div>
          </FadeIn>

          {/* Heading */}
          <FadeIn delay={80}>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Managing the{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Future
                </span>
              </span>{' '}
              of Education
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={160}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
              Streamline operations, empower teachers, and engage students with
              the all-in-one private school management platform built for modern
              education.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={240}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Get Started Free
                <Icon
                  name="arrow_forward"
                  className="text-lg transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:bg-white/8"
              >
                <Icon name="play_circle" className="text-lg" />
                View Demo
              </a>
            </div>
          </FadeIn>

          {/* Dashboard preview mockup */}
          <FadeIn delay={360} className="mt-16 w-full max-w-5xl">
            <DashboardPreview />
          </FadeIn>
        </div>
      </Section>
    </div>
  )
}

/* ─── Stats ─── */
function Stats() {
  const items = [
    { icon: 'domain', value: '50+', label: 'Schools Trust Us' },
    { icon: 'groups', value: '10k+', label: 'Active Students' },
    { icon: 'cast_for_education', value: '500+', label: 'Teachers Empowered' },
  ]

  return (
    <div className="border-y border-border/60 bg-muted/30">
      <Section>
        <div className="grid grid-cols-1 gap-6 py-14 sm:grid-cols-3">
          {items.map((s, i) => (
            <FadeIn key={s.label} delay={i * 100}>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon name={s.icon} className="text-2xl" />
                </div>
                <p className="text-4xl font-extrabold tracking-tight text-foreground">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
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

/* ─── Features ─── */
function Features() {
  const features = [
    {
      icon: 'monitoring',
      title: 'Real-time Analytics',
      desc: 'Make data-driven decisions with comprehensive reports on student performance, attendance trends, and financial health.',
      span: 'md:col-span-2 md:row-span-2',
      accent: true,
    },
    {
      icon: 'payments',
      title: 'Fee Management',
      desc: 'Automated billing, invoicing, and payment tracking with zero hassle.',
    },
    {
      icon: 'chat',
      title: 'Communication Hub',
      desc: 'Direct messaging between teachers, parents, and administrators.',
    },
    {
      icon: 'calendar_month',
      title: 'Smart Scheduling',
      desc: 'Auto-generate timetables and manage events effortlessly.',
    },
    {
      icon: 'assignment',
      title: 'Grade Tracking',
      desc: 'Record, analyze, and share grades with parents in real time.',
    },
  ]

  return (
    <Section id="features" className="py-24 sm:py-32">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to run a modern school
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Powerful tools wrapped in a simple, intuitive interface that anyone
            can use.
          </p>
        </div>
      </FadeIn>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 80} className={f.span || ''}>
            <div
              className={`group relative h-full rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40 ${
                f.span ? 'flex flex-col justify-between' : ''
              }`}
            >
              {f.accent && (
                <div className="pointer-events-none absolute -right-16 -bottom-16 size-64 rounded-full bg-primary/5 blur-3xl transition-opacity group-hover:opacity-80" />
              )}
              <div className="relative">
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                  <Icon name={f.icon} className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {f.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

/* ─── Roles ─── */
function Roles() {
  const roles = [
    {
      icon: 'domain',
      title: 'School Admins',
      desc: 'Simplify administration, track finances, and oversee operations from a single dashboard.',
      role: UserRoleEnum.ADMIN,
      redirect: '/admin/dashboard',
      cta: 'Login as Admin',
    },
    {
      icon: 'auto_stories',
      title: 'Teachers',
      desc: 'Focus on teaching, not paperwork. Manage grades, attendance, and lesson plans easily.',
      role: UserRoleEnum.TEACHER,
      redirect: '/teacher/calendar',
      cta: 'Login as Teacher',
    },
      {
      icon: 'backpack',
      title: 'Students',
      desc: 'Access grades, schedules, and assignements instantly from your computer or phone.',
      role: UserRoleEnum.STUDENT,
      redirect: '/student/calendar',
      cta: 'Login as Student',
    },
  ]

  return (
    <Section id="roles" className="py-24 sm:py-32">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Who is it for?
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Tailored for Every Role
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Specific tools and dashboards designed to make everyone&apos;s life
            easier, from the front office to the classroom.
          </p>
        </div>
      </FadeIn>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r, i) => (
          <FadeIn key={r.title} delay={i * 100}>
            <div className="group flex h-full flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white dark:bg-primary/10">
                <Icon name={r.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {r.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {r.desc}
              </p>
              <Link
                to="/log-in"
                search={{ role: r.role, redirectTo: r.redirect }}
                className="mt-auto w-full rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:text-primary"
              >
                {r.cta}
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

/* ─── Testimonials ─── */
function Testimonials() {
  const items = [
    {
      quote:
        'EduManage transformed how we run our school. Administrative tasks that used to take hours now take minutes.',
      name: 'Sarah Mitchell',
      role: 'Principal, Oakridge Academy',
      avatar: 'SM',
    },
    {
      quote:
        'The communication features alone are worth it. Parents are more engaged than ever before.',
      name: 'James Okonkwo',
      role: 'IT Director, Sunrise International',
      avatar: 'JO',
    },
    {
      quote:
        'Finally, a platform that understands what schools actually need. Clean, fast, and intuitive.',
      name: 'Maria Santos',
      role: 'Head Teacher, Greenfield School',
      avatar: 'MS',
    },
    {
      quote:
        'The grade tracking feature saved us weeks of manual work. Our teachers can finally focus on teaching.',
      name: 'David Kim',
      role: 'Administrator, Seoul International School',
      avatar: 'DK',
    },
    {
      quote:
        'Implementing EduManage was the best decision we made. The onboarding was smooth and the support is exceptional.',
      name: 'Aisha Patel',
      role: 'Vice Principal, Delhi Public School',
      avatar: 'AP',
    },
    {
      quote:
        'The analytics dashboard gives us insights we never had before. Data-driven decisions have improved our student outcomes significantly.',
      name: 'Thomas Mueller',
      role: 'Head of IT, Berlin International Academy',
      avatar: 'TM',
    },
  ]

  return (
    <div className="border-y border-slate-200/60 bg-slate-50/50 dark:border-white/6border-white/[0.06] dark:bg-white/2">
      <Section className="py-24 sm:py-32">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Loved by educators
            </h2>
          </div>
        </FadeIn>

        <FadeIn className="mt-16">
          <div
            className="overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}
          >
            <div
              className="flex gap-6 animate-marquee"
              style={{ width: 'max-content' }}
            >
              {[...items, ...items].map((t, i) => (
                <div key={`${t.name}-${i}`} className="w-88 shrink-0">
                  <div className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6:border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="mb-4 flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, j) => (
                        <Icon key={j} name="star" className="text-lg" />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  )
}

/* ─── FAQ ─── */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'How long does it take to set up EduManage?',
      a: 'Most schools are up and running within a day. Our onboarding wizard guides you through importing data, setting up roles, and configuring your dashboard.',
    },
    {
      q: 'Is there a free trial available?',
      a: 'Yes! You can start with our free tier that includes core features for up to 50 students. Upgrade anytime as your school grows.',
    },
    {
      q: 'Can I migrate data from my current system?',
      a: 'Absolutely. We support CSV imports and offer assisted migration for schools transitioning from other platforms.',
    },
    {
      q: 'Is my data secure?',
      a: 'We use industry-standard encryption, regular backups, and comply with data protection regulations. Your data is always safe with us.',
    },
    {
      q: 'Do you offer support?',
      a: 'Yes, we provide email support for all plans and dedicated account managers for premium customers. Our average response time is under 4 hours.',
    },
  ]

  return (
    <Section id="faq" className="py-24 sm:py-32">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
      </FadeIn>

      <div className="mx-auto mt-14 max-w-3xl divide-y divide-slate-200 dark:divide-white/6">
        {faqs.map((faq, i) => (
          <FadeIn key={i} delay={i * 60}>
            <div>
              <button
                className="cursor-pointer flex w-full items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="text-base font-semibold text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all dark:border-white/10 dark:text-slate-400 ${
                    openIndex === i ? 'rotate-45' : ''
                  }`}
                >
                  <Icon name="add" className="text-lg" />
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-48 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.a}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  )
}

/* ─── CTA ─── */
function CTA() {
  return (
    <Section className="py-24 sm:py-32">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-slate-900 to-slate-800 px-6 py-16 text-center shadow-2xl dark:border-white/8 sm:px-12 sm:py-24">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to transform your school?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Join over 500 schools already modernizing their operations with
              EduManage.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Create an Account
                <Icon
                  name="arrow_forward"
                  className="text-lg transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}

/* ─── Main App ─── */
function App() {
  return (
    <Skeleton name="landing-page" loading={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden"
      >
        <Navbar />
        <MobileSidebar />
        <main>
          <Hero />
          <Stats />
          <Features />
          <Roles />
          <Testimonials />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </motion.div>
    </Skeleton>
  )
}
