import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { useQuery } from '@tanstack/react-query'
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
import type { GetTeachersSchema } from '#/types/teacherTypes'

const getTeachersQueryOptions = ({
  page,
  search,
  size,
  status,
  sortOrder,
  sortBy,
  email,
  subject,
}: GetTeachersSchema) => ({
  queryKey: [
    'teachers',
    page,
    search,
    size,
    status,
    sortOrder,
    sortBy,
    email,
    subject,
  ],
  queryFn: async () => {
    const response = await getTeachersServerFn({
      data: {
        email,
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

export const Route = createFileRoute('/admin/teachers/')({
  component: RouteComponent,
  pendingComponent: AdminTeachersPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    context.queryClient.ensureQueryData(getTeachersQueryOptions(deps))
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
  const navigate = Route.useNavigate()
  const { search, size } = Route.useSearch({
    select: (s) => ({ search: s.search, size: s.size }),
  })
  return (
    <div className="flex-1 w-full overflow-y-auto overflow-x-auto flex flex-col gap-4">
      <IndexPageComponent role="Teacher">
        <TeachersStatCards />
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-4">
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
          </div>
        </div>

        <MainPageContent />
      </IndexPageComponent>
    </div>
  )
}

function MainPageContent() {
  const navigate = Route.useNavigate()
  const { size, page, search, sortBy, sortOrder, status, email, subject } =
    Route.useSearch({
      select: (s) => ({
        size: s.size,
        page: s.page,
        search: s.search,
        sortBy: s.sortBy,
        sortOrder: s.sortOrder,
        status: s.status,
        email: s.email,
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
      email,
      subject,
    }),
  })
  return (
    <>
      {fetchStatus === 'pending' ? (
        <CustomDataTableSkeleton rows={size} cols={6} />
      ) : fetchStatus === 'error' ? (
        <p>Error</p>
      ) : (
        <>
          <TeachersTable data={teachersData.data} />
          <div className="flex items-center justify-between">
            <p className="w-fit">
              Showing{' '}
              {size > teachersData.pagination.totalCount
                ? teachersData.pagination.totalCount
                : size}{' '}
              of {teachersData.pagination.totalCount}
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
        </>
      )}
    </>
  )
}
