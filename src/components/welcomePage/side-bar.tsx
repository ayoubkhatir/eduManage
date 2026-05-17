import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { UserRoleEnum } from '#/server/db/schema'
import useWelcomeSideBarStore from '#/services/store/welcome_store'

type WelcomeSideBarProps = {
  onNavigate: (id: string) => void
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  )
}

export default function SideBar({ onNavigate }: WelcomeSideBarProps) {
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

  const handleNavigate =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      close()
      onNavigate(id)
    }

  const links = [
    { label: 'Features', id: 'features', icon: 'widgets' },
    { label: 'Roles', id: 'roles', icon: 'people' },
    { label: 'FAQ', id: 'faq', icon: 'help_outline' },
    { label: 'Contact', id: 'contact', icon: 'mail' },
  ]

  return (
    <div
      className={`fixed inset-0 top-0 z-50 md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      style={{ visibility: isOpen ? 'visible' : 'hidden' }}
    >
      {/* Backdrop */}
      <button
        className="cursor-pointer absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={close}
        aria-label="Close menu"
      />

      {/* Panel */}
      <aside
        className="absolute left-0 top-0 h-full w-72 max-w-[85vw] flex flex-col bg-white shadow-2xl dark:bg-[#101622] border-r border-slate-200/60 dark:border-white/[0.06] transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/20">
              <Icon name="school" className="text-[18px]" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              EduManage
            </span>
          </div>
          <button
            className="cursor-pointer flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
            onClick={close}
            aria-label="Close menu"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile navigation">
          <div className="flex flex-col gap-0.5">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={handleNavigate(l.id)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <Icon name={l.icon} className="text-[20px] text-slate-400 dark:text-slate-500" />
                {l.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Footer CTA */}
        <div className="border-t border-slate-200/60 dark:border-white/[0.06] p-4">
          <Link
            to="/log-in"
            search={{ role: UserRoleEnum.ADMIN, redirectTo: '/admin/dashboard' }}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-colors hover:bg-primary/90"
            onClick={close}
          >
            <Icon name="login" className="text-[18px]" />
            Sign in
          </Link>
        </div>
      </aside>
    </div>
  )
}
