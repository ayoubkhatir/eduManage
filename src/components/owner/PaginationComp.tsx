import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

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
    <div className="w-fit">
      <Pagination className="">
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>

          {/* Pages */}
          {items.map((item, i) =>
            item === 'ellipsis' ? (
              <PaginationItem key={i}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
