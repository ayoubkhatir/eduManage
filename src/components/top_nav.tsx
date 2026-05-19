import { useState, useRef, useEffect } from 'react'
import useSideBarStore from '../store/sidebar_show_store'
import PopUpNotification from './popUpNotification'
import { ModeToggle } from '@/features/theme/mode-toggle'

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}

export default function TopNav() {
  const toggleSideBar = useSideBarStore((s) => s.toggle)
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchOpen])

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-[#0d1117]/80 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            className="cursor-pointer flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-white/5 lg:hidden"
            onClick={toggleSideBar}
            aria-label="Toggle sidebar"
            type="button"
          >
            <Icon name="menu" className="text-[22px]" />
          </button>

          {/* Desktop search bar */}
          <div className="hidden sm:flex">
            <div className="flex h-9 w-80 items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50/80 px-3 transition-all focus-within:border-primary/50 focus-within:bg-white focus-within:shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02] dark:focus-within:border-primary/40 dark:focus-within:bg-white/[0.04] xl:w-96">
              <Icon name="search" className="text-[18px] text-slate-400 dark:text-slate-500" />
              <input
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Search anything…"
                type="text"
              />
              <kbd className="hidden shrink-0 items-center rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500 md:inline-flex">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Mobile search trigger */}
          <button
            className="cursor-pointer flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-white/5 sm:hidden"
            aria-label="Search"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" className="text-[22px]" />
          </button>

          <ModeToggle />

          <PopUpNotification />
        </div>
      </header>

      {/* Mobile search overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 sm:hidden ${
          searchOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ visibility: searchOpen ? 'visible' : 'hidden' }}
      >
        <button
          className="cursor-pointer absolute inset-0 cursor-pointer bg-black/50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
          aria-label="Close search"
        />

        <div
          className={`relative mx-4 mt-4 rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xl transition-all duration-300 ease-out dark:border-white/[0.06] dark:bg-[#0d1117] ${
            searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon name="search" className="text-[20px] text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              className="flex-1 border-none bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Search anything…"
              type="text"
            />
            <button
              className="cursor-pointer flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              type="button"
            >
              <Icon name="close" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
