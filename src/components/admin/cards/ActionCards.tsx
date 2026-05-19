import { Link } from '@tanstack/react-router'

type Props = {
  label: string
  icon: string
  navigateTo: string
}

export default function ActionCards({ label, icon, navigateTo }: Props) {
  return (
    <Link
      to={navigateTo}
      className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-primary/40 dark:hover:bg-primary/10"
    >
      <span className="material-symbols-outlined text-3xl text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500">
        {icon}
      </span>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </Link>
  )
}
