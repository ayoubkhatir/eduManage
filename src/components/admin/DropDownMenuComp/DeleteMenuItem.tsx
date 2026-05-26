import { Trash2, Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog'
import { DropdownMenuItem } from '../../ui/dropdown-menu'
import { useDeleteStudent } from '#/hooks/students/hooks'
import { toast } from 'sonner'
import { useDeleteTeacher } from '#/hooks/teachers/hooks'
// import { useDeleteTeacher } from '@/services/api/admin/teacher/hooks'

type Props = {
  role: 'Student' | 'Teacher'
  id: string
}

export default function DeleteMenuItem({ role, id }: Props) {
  const { mutate: deleteStudent } = useDeleteStudent()
  const { mutate: deleteTeacher } = useDeleteTeacher()

  let deleteElement = role === 'Student' ? deleteStudent : deleteTeacher

  return (
    <DropdownMenuItem asChild>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer text-center text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 py-1.5 rounded-sm px-2">
            <Trash2 size="18" />
            <p className="text-sm">Delete Student</p>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
              <Trash2Icon className="h-6 w-6" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700 dark:text-slate-300">
              This will permanently delete this student record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel variant="outline" className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              onClick={() =>
                deleteElement(id, {

                  onSuccess: () => {
                    toast.success('Element deleted')
                  },
                  onError(error) {
                    toast.error('Element not deleted')
                  },
                })
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  )
}
