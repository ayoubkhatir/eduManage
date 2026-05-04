import type { SidebarItem } from "./SideBarContent"

const BUTTON_BASE =
  'flex items-center rounded-lg cursor-pointer gap-3 px-3 py-2.5'
const BUTTON_ACTIVE = 'bg-primary/10 text-primary dark:bg-primary/20'
const BUTTON_INACTIVE =
  'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 group'

export interface NavButtonProps {
  item: SidebarItem
  onClick: () => void
}

export function NavButton({ item, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      key={item.key}
      className={`${BUTTON_BASE} ${item.active ? BUTTON_ACTIVE : BUTTON_INACTIVE}`}
    >
      <span className="material-symbols-outlined group-hover:text-primary">
        {item.icon}
      </span>
      <p className="text-sm font-medium leading-normal group-hover:text-slate-900 dark:group-hover:text-slate-100">
        {item.name}
      </p>
    </button>
  )
}
