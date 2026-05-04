import useSideBarStore from '../services/store/sidebar_show_store'

import PopUpNotification from './popUpNotification'
import { ModeToggle } from '@/features/theme/mode-toggle'

export default function TopNav() {
  const toggleSideBar = useSideBarStore((state) => state.toggle)
  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-surface-light dark:bg-surface-dark px-6 shrink-0">
      {/* Mobile Menu Toggle (Visible only on small screens) */}
      <button
        className="mr-6 mt-1.5 lg:hidden text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
        onClick={toggleSideBar}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      {/* Search Bar */}
      <div className="hidden w-96 lg:flex items-center gap-2 bg-background-light/80 dark:bg-gray-800/60 px-3 py-2 rounded-lg ring-1 ring-slate-200/70 dark:ring-slate-700/50">
        <span
          className="material-symbols-outlined text-slate-500 dark:text-slate-400"
          style={{ fontSize: '20px' }}
        >
          search
        </span>
        <input
          className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0"
          placeholder="Search for anything..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-4 ml-auto ">
        <ModeToggle />
        <div className="relative group pt-1.5">
          <PopUpNotification />
        </div>
      </div>
    </header>
  )
}
