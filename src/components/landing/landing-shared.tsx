import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ModeToggle } from '#/features/theme/mode-toggle'
import { UserRoleEnum } from '#/server/db/schema'

/* ─── Icon ─── */
export function Icon({
  name,
  className = '',
}: {
  name: string
  className?: string
}) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  )
}

/* ─── Section ─── */
export function Section({
  id,
  className = '',
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

/* ─── Fade-in on scroll ─── */
export function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Navbar ─── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/about' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/60 bg-white/80 dark:border-white/6 dark:bg-background-dark/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
            <Icon name="school" className="text-xl" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            EduManage
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            to="/log-in"
            search={{
              role: UserRoleEnum.ADMIN,
              redirectTo: '/admin/dashboard',
            }}
            className="hidden sm:inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ─── Footer ─── */
export function Footer() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Security', href: '/pages/security' },
        { label: 'Changelog', href: '/pages/changelog' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/pages/about' },
        { label: 'Careers', href: '/pages/careers' },
        { label: 'Blog', href: '/pages/blog' },
        { label: 'Press', href: '/pages/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/pages/documentation' },
        { label: 'Help Center', href: '/pages/help' },
        { label: 'Community', href: '/pages/community' },
        { label: 'Contact', href: '/#contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '/pages/privacy' },
        { label: 'Terms', href: '/pages/terms' },
        { label: 'Cookie Policy', href: '/pages/cookie-policy' },
        { label: 'Licenses', href: '/pages/licenses' },
      ],
    },
  ]

  return (
    <footer
      id="contact"
      className="border-t border-slate-200/60 dark:border-white/6border-white/[0.06]"
    >
      <Section className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
                <Icon name="school" className="text-xl" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                EduManage
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Making education management simple, efficient, and accessible for
              everyone.
            </p>
            <div className="mt-6 flex gap-3">
              {['chat', 'mail', 'language'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-400 dark:hover:border-primary dark:hover:text-primary"
                >
                  <Icon name={icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={'/Pages/about'}
                      className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200/60 pt-8 text-center dark:border-white/6:border-white/[0.06]">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} EduManage Inc. All rights
            reserved.
          </p>
        </div>
      </Section>
    </footer>
  )
}

/* ─── Page layout (Navbar + content + Footer) ─── */
export function PageLayout({
  children,
  name = 'page',
}: {
  children: React.ReactNode
  name?: string
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
