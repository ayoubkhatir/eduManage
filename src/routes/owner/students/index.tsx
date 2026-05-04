import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-adapter'
import { StudentColumns } from '@/components/owner/Table/columnsData'
import DataTable, {
  CustomDataTableSkeleton,
} from '@/components/owner/Table/dataTable'
import { CustomPagination } from '@/components/owner/PaginationComp'
import { SearchInput } from '@/components/owner/SearchInput'
import { SelectPageSize } from '@/components/owner/SelectPageSize'
import IndexPageComponent from '@/components/owner/IndexPageComponent'
import {
  getAllStudentsServerFn,
  getStudentsStatsServerFn,
} from '#/server/modules/students/students.server-functions'
import type { StudentUser } from '#/server/modules/students/students.types'
import {
  getStudentsSchema,
  type GetStudentsSchema,
} from '#/schemas/students.schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getAllGradesQueryOptions } from '#/services/api/grades.hooks'
import UICardComponent, {
  UICardSkeleton,
  type UICardType,
} from '#/components/owner/UICard'
import { useMemo, useState } from 'react'

// type QueryOptionsType = Filters<StudentModel>

// const StudentSearchSchema = z.object({
//   search: fallback(z.string(), '').default(''),
//   email: fallback(z.string().email(), '').default(''),
//   status: fallback(z.string(), '').default(''),
//   grade: fallback(z.string(), '').default(''),
//   sortBy: fallback(z.enum(['name', 'email']), 'name').default('name'),
//   sortOrder: fallback(z.enum(['asc', 'desc']).nullable(), 'asc').default('asc'),
//   page: fallback(z.coerce.number().int().positive(), 1).default(1),
//   size: fallback(z.coerce.number().int().positive(), 10).default(10),
// })
const getStudentsQueryOptions = ({
  page,
  search,
  size,
  status,
  grade,
  sortOrder,
  sortBy,
  classe,
  email,
}: GetStudentsSchema) => ({
  queryKey: [
    'students',
    page,
    search,
    size,
    status,
    grade,
    sortOrder,
    sortBy,
    classe,
    email,
  ],
  queryFn: async () => {
    const response = await getAllStudentsServerFn({
      data: {
        page,
        search,
        size,
        status,
        sortOrder,
        sortBy,
        grade,
        classe,
        email,
      },
    })

    if (response.success)
      return {
        data: response.data,
        pagination: response.pagination,
      }
    else throw new Error(response.message)
  },
  // placeholderData: keepPreviousData,
})

export const Route = createFileRoute('/owner/students/')({
  component: RouteComponent,
  pendingComponent: OwnerStudentsPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // // await new Promise((resolve) => setTimeout(resolve, 2000))
    context.queryClient.ensureQueryData(getAllGradesQueryOptions())
    context.queryClient.ensureQueryData(getStudentsQueryOptions(deps))
  },
  validateSearch: zodValidator(getStudentsSchema),
})

function RouteComponent() {
  return (
    <Skeleton name="owner-students-page" loading={false}>
      <OwnerStudentsContent />
    </Skeleton>
  )
}

function OwnerStudentsPending() {
  return (
    <Skeleton name="owner-students-page" loading>
      <OwnerStudentsContent />
    </Skeleton>
  )
}

function OwnerStudentsContent() {
  const navigate = Route.useNavigate()

  const { size, search } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      search: s.search,
    }),
  })

  return (
    <div className="flex-1 w-full overflow-x-auto flex flex-col gap-4">
      <IndexPageComponent role="student">
        <StudentsStatCards />
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
            <GradesFilter />
          </div>
        </div>
        <MainPageContent />
      </IndexPageComponent>
    </div>
  )
}

const getStudentsStatsQueryOptions = () => ({
  queryKey: ['students', 'stats'],
  queryFn: async () => {
    const response = await getStudentsStatsServerFn()
    if (response.success) return response.data
    return {
      totalStudents: 0,
      totalMonthEnrollments: 0,
    }
  },
})

function StudentsStatCards() {
  const { data: studentsStat, status: fetchStatus } = useQuery({
    ...getStudentsStatsQueryOptions(),
  })

  const cards = useMemo<UICardType[]>(
    () => [
      {
        id: 'total-students',
        iconName: 'school',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 0,
        cardTitle: 'Total Students',
        info: studentsStat?.totalStudents ?? 0,
      },
      {
        id: 'month-enrollments',
        iconName: 'person_add',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 0,
        cardTitle: 'Enrollments This Month',
        info: studentsStat?.totalMonthEnrollments ?? 0,
      },
    ],
    [studentsStat],
  )

  if (fetchStatus === 'pending') return <UICardSkeleton count={2} />
  if (fetchStatus === 'error') return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <UICardComponent {...card} key={i} />
      ))}
    </div>
  )
}

function GradesFilter() {
  const navigate = Route.useNavigate()
  const { grade } = Route.useSearch({ select: (s) => ({ grade: s.grade }) })
  const { data: gradesData, status: fetchStatus } = useQuery(
    getAllGradesQueryOptions(),
  )
  if (fetchStatus === 'error') return null
  if (fetchStatus === 'pending')
    return (
      <Select disabled={true}>
        <SelectTrigger disabled={true} className="w-45">
          Loading ...
        </SelectTrigger>
      </Select>
    )
  const gradeOptions = [
    // { label: 'All', value: null },
    ...gradesData.map((g) => ({ label: g.name, value: g.id })),
  ]

  const [open, setOpen] = useState(false)
  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      defaultValue={grade ?? ''}
      onValueChange={(v) =>
        navigate({ to: '.', search: (s) => ({ ...s, grade: v }) })
      }
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Grade" />
      </SelectTrigger>
      <SelectContent className="bg-background-light dark:bg-background-dark dark:text-white">
        <SelectItem value={null as any}>ALL</SelectItem>
        {gradeOptions?.map((option) => (
          <SelectItem
            key={option.label}
            value={option.value}
            className="bg-background-light dark:bg-background-dark"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    // <SelectFilter
    //   placeholder="Select a grade"
    //   options={gradeOptions}
    //   value={grade || ''}
    //   onChange={(value) =>
    //     navigate({
    //       search: (s) => ({
    //         ...s,
    //         grade: value,
    //       }),
    //     })
    //   }
    // />
  )
}

function MainPageContent() {
  const {
    size,
    page,
    search,
    sortBy,
    sortOrder,
    status,
    grade,
    email,
    classe,
  } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      page: s.page,
      search: s.search,
      sortBy: s.sortBy,
      sortOrder: s.sortOrder,
      status: s.status,
      grade: s.grade,
      email: s.email,
      classe: s.classe,
    }),
  })
  const { data: studentsData, status: fetchStatus } = useQuery({
    ...getStudentsQueryOptions({
      size,
      page,
      search,
      sortBy,
      sortOrder,
      status,
      grade,
      email,
      classe,
    }),
    placeholderData: keepPreviousData,
  })
  const navigate = Route.useNavigate()

  return (
    <>
      {fetchStatus === 'pending' ? (
        <CustomDataTableSkeleton rows={size} cols={6} />
      ) : fetchStatus === 'error' ? (
        <p>Error</p>
      ) : (
        <>
          <StudentsTable data={studentsData.data} />
          <div className="flex items-center justify-between">
            <p className="w-fit">
              Showing{' '}
              {size > studentsData.pagination.totalCount
                ? studentsData.pagination.totalCount
                : size}{' '}
              of {studentsData.pagination.totalCount}{' '}
            </p>
            <CustomPagination
              currentPage={page}
              totalPages={studentsData.pagination.totalPages}
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

function StudentsTable({ data }: { data: Array<StudentUser> }) {
  const table = useReactTable({
    data,
    columns: StudentColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <DataTable table={table} />
}
