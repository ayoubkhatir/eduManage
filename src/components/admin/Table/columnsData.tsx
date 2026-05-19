import {
  ArrowUpDown,
  MoreHorizontal,
  MoveDownIcon,
  MoveUpIcon,
  UserCircleIcon,
} from 'lucide-react'
import { getRouteApi } from '@tanstack/react-router'
import DeleteMenuItem from '../DropDownMenuComp/DeleteMenuItem'
import ViewProfileMenuItem from '../DropDownMenuComp/ViewProfileMenuItem'
import CopyIdMenuItem from '../DropDownMenuComp/CopyIdMenuItem'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { AdvancedImage } from '@cloudinary/react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'
import { AssignTeacherMenuItem } from '../DropDownMenuComp/AssignTeacherMenuItem'
import { Badge } from '#/components/ui/badge'
import { StatusEnum, UserGenderEnum } from '#/server/db/schema'
import ProfilePicGenerator from '../profilePicGenerator'
import { cld } from '#/lib/cloudinary'
import type { Student } from '#/types/studentTypes'
import type { Teacher } from '#/types/teacherTypes'

export function UserAvatar({
  image,
  size,
}: {
  image: string | null
  size: number
}) {
  return image ? (
    <AdvancedImage
      cldImg={cld
        .image(image)
        .resize(
          thumbnail()
            .width(size * 4)
            .height(size * 4),
        )
        .roundCorners(byRadius(999))}
      className={`size-${size} object-cover rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-sm`}
    />
  ) : (
    <UserCircleIcon
      className={`size-${size} text-slate-400 dark:text-slate-500`}
    />
  )
}

function ImageColumnUI({ image }: { image: string | null }) {
  return (
    <div className="flex items-center justify-center">
      <UserAvatar image={image} size={12} />
    </div>
  )
}

// definition for the student columns in the student table
export const StudentColumns: Array<ColumnDef<Student>> = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    size: 5,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'image',
    header: '',
    size: 10,
    cell: ({ row }) => <ImageColumnUI image={row.original.image} />,
  },
  {
    accessorKey: 'name',
    header: () => {
      return <StudentSortButton property="name" />
    },
    size: 20,
    cell: ({ row }) => (
      <span className="font-medium text-slate-900 dark:text-white">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: 'email',
    header: () => {
      return <StudentSortButton property="email" />
    },
    size: 28,
    cell: ({ row }) => (
      <div className="text-sm text-slate-700 dark:text-slate-300 truncate w-full">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: 'grade',
    header: 'Grade',
    size: 15,
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.grade.name}
      </span>
    ),
  },
  {
    accessorKey: 'class',
    header: 'Class',
    size: 15,
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.class.name}
      </span>
    ),
  },
  {
    accessorKey: 'parentName',
    header: "Parent's Name",
    size: 15,
    cell: ({ row }) => {
      const student = row.original
      return (
        <div className="flex flex-col text-sm text-slate-700 dark:text-slate-300">
          <span className="font-medium">{student.parentName}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {student.parentPhoneNumber}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 10,
    cell: ({ row }) => {
      const student = row.original
      const bgColor =
        student.status === 'Active'
          ? 'bg-green-100 text-green-800'
          : student.status === 'Inactive'
            ? 'bg-red-100 text-red-800'
            : student.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgColor} `}
        >
          {student.status}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    size: 10,
    cell: ({ row }) => {
      const student = row.original

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className=" h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 bg-white dark:bg-slate-800"
            >
              <DropdownMenuLabel className="text-black dark:text-white">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black" />

              <CopyIdMenuItem role="Student" id={student.id} />

              <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />

              <ViewProfileMenuItem role="Student" id={student.id} />

              <DropdownMenuSeparator className="bg-gray-300 dark:bg-gray-700" />

              <DeleteMenuItem role="Student" id={student.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

// definition for the teacher columns in the teacher table
export const TeacherColumns: Array<ColumnDef<Teacher>> = [
  {
    accessorKey: 'imgSrc',
    header: '',
    size: 10,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <div className="relative">
          <ProfilePicGenerator
            name={row.original.name}
            imgSrc={row.original.image}
          />
          {/* <ImageColumnUI image={row.original.image} />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-800 ${
              row.original.status === 'Active'
                ? 'bg-green-500'
                : row.original.status === 'Inactive'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
            }`}
          /> */}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: () => {
      return <TeacherSortButton property="name" />
    },
    size: 20,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900 dark:text-white">
          {getUser}
          {row.original}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {row.original.id}
        </span>
      </div>
    ),
  },

  {
    accessorKey: 'email',
    header: () => {
      return <TeacherSortButton property="email" />
    },
    size: 28,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {row.original.email}
        </span>
        {row.original.telNumber && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {row.original.telNumber}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    size: 10,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300 capitalize">
        <span
          className={`h-2 w-2 rounded-full ${
            row.original.gender === UserGenderEnum.MALE
              ? 'bg-blue-500'
              : row.original.gender === UserGenderEnum.FEMALE
                ? 'bg-pink-500'
                : 'bg-gray-400'
          }`}
        />
        {row.original.gender}
      </span>
    ),
  },

  {
    accessorKey: 'subjects',
    header: 'Subjects',
    size: 20,
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1.5 max-w-50">
          {row.original.subjects.map((s) => (
            <Badge
              key={s.id}
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 font-medium"
            >
              {s.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 10,
    cell: ({ row }) => {
      const teacher = row.original

      const statusConfig = {
        Active: {
          bg: 'bg-emerald-50 dark:bg-emerald-950/50',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        },
        Inactive: {
          bg: 'bg-red-50 dark:bg-red-950/50',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800',
          dot: 'bg-red-500',
        },
        Pending: {
          bg: 'bg-amber-50 dark:bg-amber-950/50',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
        },
      }

      const config =
        teacher.status === StatusEnum.ACTIVE
          ? statusConfig.Active
          : teacher.status === StatusEnum.INACTIVE
            ? statusConfig.Inactive
            : statusConfig.Pending

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {teacher.status}
        </span>
      )
    },
  },

  {
    id: 'actions',
    header: '',
    size: 10,
    cell: ({ row }) => {
      const teacher = row.original
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="min-w-44 w-fit bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <DropdownMenuLabel className="text-slate-900 dark:text-white font-semibold">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              <CopyIdMenuItem role="Teacher" id={teacher.id} />
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              <ViewProfileMenuItem role="Teacher" id={teacher.id} />
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              <AssignTeacherMenuItem teacherId={teacher.id} />
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />

              <DeleteMenuItem role="Teacher" id={teacher.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

function StudentSortButton({ property }: { property: 'name' | 'email' }) {
  const Route = getRouteApi('/admin/students/')
  const navigate = Route.useNavigate()
  const { sortBy, sortOrder } = Route.useSearch({
    select: (s) => ({ sortBy: s.sortBy, sortOrder: s.sortOrder }),
  })

  if (sortBy !== property) {
    return (
      <Button
        className="capitalize"
        variant="ghost"
        onClick={() =>
          navigate({
            replace: true,
            to: '/admin/students',
            search: (s) => ({
              ...s,
              sortBy: property,
              sortOrder: 'asc',
            }),
          })
        }
      >
        {property}
        <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />
      </Button>
    )
  }

  return (
    <Button
      className="capitalize"
      variant="default"
      onClick={() =>
        navigate({
          // replace: true,
          to: '/admin/students',
          search: (s) => ({
            ...s,
            sortBy: property,
            sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc',
          }),
        })
      }
    >
      {property}
      {sortOrder === 'asc' ? (
        <MoveUpIcon className="ml-2 h-4 w-4" />
      ) : (
        <MoveDownIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

function TeacherSortButton({ property }: { property: 'name' | 'email' }) {
  const Route = getRouteApi('/admin/teachers/')
  const navigate = Route.useNavigate()
  const { sortBy, sortOrder } = Route.useSearch({
    select: (s) => ({ sortBy: s.sortBy, sortOrder: s.sortOrder }),
  })

  if (sortBy !== property) {
    return (
      <Button
        className="capitalize font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        variant="ghost"
        onClick={() =>
          navigate({
            replace: true,
            to: '/admin/teachers',
            search: (s) => ({
              ...s,
              sortBy: property,
              sortOrder: 'asc',
            }),
          })
        }
      >
        {property}
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      className="capitalize font-semibold text-sm text-indigo-600 dark:text-indigo-400"
      variant="ghost"
      onClick={() =>
        navigate({
          to: '/admin/teachers',
          search: (s) => ({
            ...s,
            sortBy: property,
            sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc',
          }),
        })
      }
    >
      {property}
      {sortOrder === 'asc' ? (
        <MoveUpIcon className="ml-2 h-3.5 w-3.5" />
      ) : (
        <MoveDownIcon className="ml-2 h-3.5 w-3.5" />
      )}
    </Button>
  )
}
