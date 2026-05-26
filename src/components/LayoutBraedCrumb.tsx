import { Link, useMatches } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export function LayoutBreadcrumb() {
  const matches = useMatches()

  const breadcrumbs = matches
    .filter((match) => match.staticData?.breadcrumb)
    .flatMap((match) => {
      const rawBreadcrumb = match.staticData.breadcrumb

      const items = Array.isArray(rawBreadcrumb)
        ? rawBreadcrumb
        : [rawBreadcrumb]

      return items.map((item, index) => {
        const label = typeof item === 'function' ? item(match) : item

        const isMultiItemParent = Array.isArray(rawBreadcrumb) && index === 0
        const path = isMultiItemParent
          ? match.pathname.split('/').slice(0, -1).join('/')
          : match.pathname

        return {
          label: label ?? '',
          path: path,
        }
      })
    })
    .filter((crumb) => crumb.label !== '')

  console.log({ breadcrumbs, matches })
  return (
    <>
      {breadcrumbs.length > 0 && (
        <nav
          className="flex items-center gap-2 px-6 pt-5 pb-2 text-sm font-medium"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1

            return (
              <Fragment key={crumb.path}>
                {i > 0 && (
                  <svg
                    className="size-3.5 shrink-0 text-slate-400 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}

                {isLast ? (
                  <span className="text-foreground font-semibold tracking-tight">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </Fragment>
            )
          })}
        </nav>
      )}
    </>
  )
}
