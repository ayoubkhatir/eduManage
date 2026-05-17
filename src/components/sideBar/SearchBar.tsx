export function SearchBar() {
  return (
    <div className="mx-0.5 flex items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2.5 ring-1 ring-slate-200/70 transition-all focus-within:ring-primary/40 dark:bg-slate-800/60 dark:ring-slate-700/50">
      <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">
        search
      </span>
      <input
        className="flex-1 border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500"
        placeholder="Search..."
        type="text"
      />
    </div>
  )
}
