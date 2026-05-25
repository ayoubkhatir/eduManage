import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { CustomPagination } from '@/components/admin/PaginationComp'
import { SearchInput } from '@/components/admin/SearchInput'
import { SelectPageSize } from '@/components/admin/SelectPageSize'
import IndexPageComponent from '@/components/admin/IndexPageComponent'
import { zodValidator } from '@tanstack/zod-adapter'
import { getTeachersServerFn } from '#/server/modules/teachers/teachers.server-functions'
import { getTeachersSchema } from '#/schemas/teachers.schema'
import {
  CustomDataTableSkeleton,
  TeachersTable,
} from '#/components/admin/Table/dataTable'
import { TeachersStatCards } from '#/components/admin/cards/UICard'
import type { GetTeachersType } from '#/types/teacherTypes'
import { motion } from 'framer-motion'
import { StatusFilter, SubjectsFilter } from '#/components/admin/FilterComp.jsx'
import { getAllSubjectsQueryOptions } from '#/server/modules/subjects/subjects.controller'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'
import { StatusEnum } from '#/server/db/schema'

const getTeachersQueryOptions = ({
  page,
  search,
  size,
  sortOrder,
  sortBy,
  status,
  subject,
}: GetTeachersType) => ({
  queryKey: [
    'teachers',
    page,
    search,
    size,
    sortOrder,
    sortBy,
    status,
    subject,
  ],
  queryFn: async () => {
    const response = await getTeachersServerFn({
      data: {
        page,
        search,
        size,
        sortBy,
        sortOrder,
        status,
        subject,
      },
    })
    if (response.success)
      return {
        data: response.data,
        pagination: response.pagination,
      }
    else throw new Error('Cant fetch data')
  },
})

export const Route = createFileRoute('/_auth/admin/teachers/')({
  component: RouteComponent,
  pendingComponent: AdminTeachersPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    context.queryClient.ensureQueryData(getTeachersQueryOptions(deps))
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    context.queryClient.ensureQueryData(
      getAllSubjectsQueryOptions(currentUser.info.id),
    )
    return { currentUser }
  },
  validateSearch: zodValidator(getTeachersSchema),
})

function RouteComponent() {
  return (
    <Skeleton name="admin-teachers-page" loading={false}>
      <AdminTeachersContent />
    </Skeleton>
  )
}

function AdminTeachersPending() {
  return (
    <Skeleton name="admin-teachers-page" loading>
      <AdminTeachersContent />
    </Skeleton>
  )
}

function AdminTeachersContent() {
  const { currentUser } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { search, size, subject, status } = Route.useSearch({
    select: (s) => ({
      search: s.search,
      size: s.size,
      subject: s.subject,
      status: s.status,
    }),
  })
  const { data, status: fetchStatus } = useSuspenseQuery(
    getAllSubjectsQueryOptions(currentUser.info.id),
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 w-full overflow-y-auto overflow-x-auto flex flex-col gap-6"
    >
      <IndexPageComponent role="Teacher">
        <TeachersStatCards />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px] pointer-events-none">
              search
            </span>
            <SearchInput
              placeholder="Search by email or name"
              value={search}
              onSearch={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    search: value,
                  }),
                })
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <SelectPageSize
              value={size}
              onChange={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    size: value,
                  }),
                })
              }
            />
            <StatusFilter
              value={status}
              onChange={(value) =>
                navigate({
                  search: (s) => ({
                    ...s,
                    status:
                      value === 'all'
                        ? undefined
                        : StatusEnum[
                            value.toUpperCase() as keyof typeof StatusEnum
                          ],
                  }),
                })
              }
            />
            {fetchStatus === 'success' && (
              <SubjectsFilter
                value={subject}
                data={data}
                placeholder="Subjects"
                onChange={(value) =>
                  navigate({
                    search: (s) => ({
                      ...s,
                      subject: value === 'all' ? undefined : value,
                    }),
                  })
                }
              />
            )}
          </div>
        </div>

        <MainPageContent />
      </IndexPageComponent>
    </motion.div>
  )
}

function MainPageContent() {
  const navigate = Route.useNavigate()
  const { size, page, search, sortBy, sortOrder, status, subject } =
    Route.useSearch({
      select: (s) => ({
        size: s.size,
        page: s.page,
        search: s.search,
        sortBy: s.sortBy,
        sortOrder: s.sortOrder,
        status: s.status,
        subject: s.subject,
      }),
    })
  const { data: teachersData, status: fetchStatus } = useQuery({
    ...getTeachersQueryOptions({
      page,
      size,
      search,
      sortBy,
      status,
      sortOrder,
      subject,
    }),
  })
  return (
    <>
      {fetchStatus === 'pending' ? (
        <CustomDataTableSkeleton rows={size} cols={6} />
      ) : fetchStatus === 'error' ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-3">
            error_outline
          </span>
          <p className="text-lg font-medium text-foreground">
            Failed to load teachers
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <TeachersTable data={teachersData.data} />
          </div>
          <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium text-foreground">
                {size > teachersData.pagination.totalCount
                  ? teachersData.pagination.totalCount
                  : size}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">
                {teachersData.pagination.totalCount}
              </span>
            </p>
            <CustomPagination
              currentPage={page}
              totalPages={teachersData.pagination.totalPages}
              onPageChange={(p) =>
                navigate({
                  search: (s) => ({ ...s, page: p }),
                })
              }
            />
          </div>
        </div>
      )}
    </>
  )
}
