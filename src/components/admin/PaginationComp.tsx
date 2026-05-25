import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPaginationItems(current: number, total: number) {
  const items: Array<number | 'ellipsis'> = []

  items.push(1)

  if (current > 3) {
    items.push('ellipsis')
  }

  if (current !== 1 && current !== total) {
    items.push(current)
  }

  if (current < total - 2) {
    items.push('ellipsis')
  }

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
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
          currentPage === 1
            ? 'border-border bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
            : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {items.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={i}
            className="px-1 text-muted-foreground/50 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(item)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
              item === currentPage
                ? 'border-primary bg-primary/10 text-primary shadow-sm'
                : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground'
            }`}
            aria-label={`Page ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-150 ${
          currentPage === totalPages
            ? 'border-border bg-muted/30 text-muted-foreground/40 cursor-not-allowed'
            : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-accent hover:text-foreground'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
