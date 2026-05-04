export function SearchBar() {
  return (
    <div className="hidden md:flex items-center gap-2 bg-background-light/80 dark:bg-gray-800/60 px-3 py-3.5 rounded-lg ring-1 ring-slate-200/70 dark:ring-slate-700/50 mx-0.5">
      <span
        className="material-symbols-outlined text-slate-500 dark:text-slate-400 "
        style={{ fontSize: '20px' }}
      >
        search
      </span>
      <input
        className="bg-transparent border-none outline-none text-sm flex-1 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0"
        placeholder="Search for anything..."
        type="text"
      />
    </div>
  )
}
