import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-adapter'
import { CustomPagination } from '@/components/admin/PaginationComp'
import { SearchInput } from '@/components/admin/SearchInput'
import { SelectPageSize } from '@/components/admin/SelectPageSize'
import IndexPageComponent from '@/components/admin/IndexPageComponent'
import { studentSearchSchema } from '#/schemas/students.schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useState } from 'react'
import { StudentsStatCards } from '#/components/admin/cards/UICard'
import {
  CustomDataTableSkeleton,
  StudentsTable,
} from '#/components/admin/Table/dataTable'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { getStudentsQueryOptions } from '#/server/db/repo'

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

export const Route = createFileRoute('/admin/students/')({
  component: RouteComponent,
  pendingComponent: OwnerStudentsPending,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // // await new Promise((resolve) => setTimeout(resolve, 2000))
    context.queryClient.ensureQueryData(getAllGradesQueryOptions())
    context.queryClient.ensureQueryData(getStudentsQueryOptions(deps))
  },
  validateSearch: zodValidator(studentSearchSchema),
})

function RouteComponent() {
  return (
    <Skeleton name="admin-students-page" loading={false}>
      <OwnerStudentsContent />
    </Skeleton>
  )
}

function OwnerStudentsPending() {
  return (
    <Skeleton name="admin-students-page" loading>
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
      <IndexPageComponent role="Student">
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

function GradesFilter() {
  const navigate = Route.useNavigate()
  const { data: gradesData, status: fetchStatus } = useQuery(
    getAllGradesQueryOptions(),
  )
  const [open, setOpen] = useState(false)
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
  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      defaultValue={''}
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
            key={option.value ?? option.label}
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
  const { size, page, search, sortBy, sortOrder } = Route.useSearch({
    select: (s) => ({
      size: s.size,
      page: s.page,
      search: s.search,
      sortBy: s.sortBy,
      sortOrder: s.sortOrder,
    }),
  })
  const { data: studentsData, status: fetchStatus } = useQuery({
    ...getStudentsQueryOptions({
      size,
      page,
      search,
      sortBy,
      sortOrder,
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
