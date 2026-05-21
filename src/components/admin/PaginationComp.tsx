function getPaginationItems(current: number, total: number) {
  const items: Array<number | 'ellipsis'> = []

  // Always show first page
  items.push(1)

  // Left ellipsis
  if (current > 3) {
    items.push('ellipsis')
  }

  // Current page (if not first/last)
  if (current !== 1 && current !== total) {
    items.push(current)
  }

  // Right ellipsis
  if (current < total - 2) {
    items.push('ellipsis')
  }

  // Always show last page (if more than 1)
  if (total > 1) {
    items.push(total)
  }

  return items
}

type CustomPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  const items = getPaginationItems(currentPage, totalPages)

  return (
    <div className="flex items-center gap-1.5">
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
          currentPage === 1
            ? 'border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white'
        }`}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-[20px]">
          chevron_left
        </span>
      </button>

      {/* Pages */}
      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={i}
            className="px-1 text-slate-400 dark:text-slate-500 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(item)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
              item === currentPage
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white'
            }`}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
          currentPage === totalPages
            ? 'border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-600 cursor-not-allowed'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white'
        }`}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-[20px]">
          chevron_right
        </span>
      </button>
    </div>
  )
}
