import { Trash2Icon } from 'lucide-react'
import type { ReactNode } from 'react'

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
} from '#/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { useDeleteGrade } from '#/hooks/grades/hooks'
import type { GradeCardProps } from '#/types/gradesTypes'
import { useDeleteClass } from '#/hooks/classes/hooks'
import type { ClassCardProps } from '#/types/classesTypes'

export function DeleteGrade({
  grade,
  children,
}: GradeCardProps & { children: ReactNode }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: deleteGrade } = useDeleteGrade()

  return (
    <>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
              <Trash2Icon className="h-6 w-6" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {grade.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700 dark:text-slate-300">
              This will permanently delete this grade and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel variant="outline" className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              onClick={() => {
                deleteGrade(grade.id, {
                  onSuccess: () => {
                    toast.success('Element deleted')
                  },
                  onError(error) {
                    console.log({ error })
                    console.log(error.message)
                    toast.error('Element not deleted')
                  },
                })
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function DeleteClass({ classe, children }: ClassCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: deleteClass } = useDeleteClass()

  return (
    <>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
              <Trash2Icon className="h-6 w-6" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete {classe.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700 dark:text-slate-300">
              This will permanently delete this grade and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel variant="outline" className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              onClick={() => {
                deleteClass(classe.id, {
                  onSuccess: () => {
                    toast.success('Element deleted')
                  },
                  onError(error) {
                    console.log({ error })
                    console.log(error.message)
                    toast.error('Element not deleted')
                  },
                })
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
