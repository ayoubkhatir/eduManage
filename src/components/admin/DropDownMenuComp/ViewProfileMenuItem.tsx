import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type Props = {
  role: 'Student' | 'Teacher'
  id: string
}

export default function ViewProfileMenuItem({ role, id }: Props) {
  return (
    <DropdownMenuItem asChild>
      <Link
        to={
          role === 'Student'
            ? '/admin/students/$studentId'
            : '/admin/teachers/$teacherId'
        }
        params={role === 'Student' ? { studentId: id } : { teacherId: id }}
        className="flex items-center gap-2 cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-1.5 rounded-sm"
      >
        <Eye size="18" />
        <p>View | Edit Profile</p>
      </Link>
    </DropdownMenuItem>
  )
}
