import { DropdownMenuItem } from '#/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import { UserCogIcon } from 'lucide-react'

export function AssignTeacherMenuItem({ teacherId }: { teacherId: string }) {
  return (
    <DropdownMenuItem asChild>
      <Link
        to={'/owner/teachers/$teacherId/assignements'}
        params={{ teacherId }}
        className="flex items-center gap-2 cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-1.5 rounded-sm"
      >
        <UserCogIcon size="18" />
        <p>View | Edit Assignements</p>
      </Link>
    </DropdownMenuItem>
  )
}
