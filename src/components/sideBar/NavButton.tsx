import type { SidebarItem } from './SideBarContent'

export interface NavButtonProps {
  item: SidebarItem
  onClick: () => void
}

export function NavButton({ item, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        item.active
          ? 'bg-primary/10 text-primary shadow-sm dark:bg-primary/15'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/4 dark:hover:text-slate-200'
      }`}
    >
      <span
        className={`material-symbols-outlined text-[22px] transition-colors duration-200 ${
          item.active
            ? 'text-primary'
            : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
        }`}
      >
        {item.icon}
      </span>
      <span className="truncate">{item.name}</span>
      {item.active && (
        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}
