import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { TeacherColumns } from '@/components/admin/Table/columnsData'

import DataTable, {
  CustomDataTableSkeleton,
} from '@/components/admin/Table/dataTable'
import { CustomPagination } from '@/components/admin/PaginationComp'
import { SearchInput } from '@/components/admin/SearchInput'
import { SelectPageSize } from '@/components/admin/SelectPageSize'
import IndexPageComponent from '@/components/admin/IndexPageComponent'
import { zodValidator } from '@tanstack/zod-adapter'
import {
  getTeachersServerFn,
  getTeachersStatsServerFn,
} from '#/server/modules/teachers/teachers.server-functions'
import {
  getTeachersSchema,
  type GetTeachersSchema,
} from '#/schemas/teachers.schema'
import type { TeacherUser } from '#/server/modules/teachers/teachers.types'
import UICardComponent, {
  UICardSkeleton,
  type UICardType,
} from '#/components/admin/UICard'
import { useMemo } from 'react'

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

// const getStudentsQueryOptions = ({
//   page,
//   search,
//   size,
//   status,
//   sortOrder,
//   sortBy,
// }: GetTeachersSchema) => ({
//   queryKey: ['students', page, search, size, sortOrder, sortBy, status],
//   queryFn: async () => {
//     const response = await getTeachersServerFn({})
//     // teacherFetcher.getTeachers({
//     //   page,
//     //   search,
//     //   size,
//     //   // status,
//     //   sortOrder,
//     //   sortBy,
//     // })
//     if (response.success)
//       return {
//         data: response.data,
//         pagination: response.pagination,
//       }
//     else throw new Error(response.message)
//   },
//   placeholderData: keepPreviousData,
// })

export const Route = createFileRoute('/admin/teachers/')({
  component: RouteComponent,
  pendingComponent: AdminTeachersPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // // await new Promise((resolve) => setTimeout(resolve, 2000))
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

const getTeacherStatsQueryOptions = () => ({
  queryKey: ['teachers', 'stats'],
  queryFn: async () => {
    const response = await getTeachersStatsServerFn()
    if (response.success) return response.data
    else
      return {
        totalTeachers: 0,
        totalActiveTeachers: 0,
        totalNewThisMonth: 0,
      }
  },
})

function TeachersStatCards() {
  const { data: teachersStat, status: fetchStatus } = useQuery({
    ...getTeacherStatsQueryOptions(),
  })

  const cards = useMemo<UICardType[]>(
    () => [
      {
        id: '0',
        iconName: 'school',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 5,
        cardTitle: 'Total Teachers',
        info: teachersStat?.totalTeachers ?? 0,
      },
      {
        id: '1',
        iconName: 'bolt',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 2,
        cardTitle: 'Active Now',
        info: teachersStat?.totalActiveTeachers ?? 0,
      },
      {
        id: '2',
        iconName: 'person_add',
        iconColor: 'purple',
        stateIcon: 'trending_up',
        percentage: 10,
        cardTitle: 'New This Month',
        info: teachersStat?.totalNewThisMonth ?? 0,
      },
    ],
    [teachersStat],
  )

  if (fetchStatus === 'pending') return <UICardSkeleton count={3} />
  if (fetchStatus === 'error') return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <UICardComponent {...card} key={i} />
      ))}
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

function TeachersTable({ data }: { data: Array<TeacherUser> }) {
  const table = useReactTable({
    data,
    columns: TeacherColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={table} />
}
