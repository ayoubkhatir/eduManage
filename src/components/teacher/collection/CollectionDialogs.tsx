import { useEffect, useState } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { SubmitHandler } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { useAddOrEditCollection } from '@/services/api/teacher/collection/hooks'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CollectionForm } from '@/components/teacher/collection/CollectionForm'

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
})

type NameFormType = z.infer<typeof nameSchema>

type AddOrEditCollectionDialogProps = {
  role: 'add' | 'edit'
  id?: string
  defaultName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  className?: string
}

export function AddOrEditCollectionDialog({
  role,
  id,
  defaultName,
  open,
  onOpenChange,
  hideTrigger,
  className,
}: AddOrEditCollectionDialogProps) {
  const addOrEditCollectionMutation = useAddOrEditCollection()
  const [internalOpen, setInternalOpen] = useState(false)
  const dialogOpen = open ?? internalOpen

  const setDialogOpen = (nextOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameFormType>({
    resolver: zodResolver(nameSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: defaultName ?? '',
    },
  })

  useEffect(() => {
    if (dialogOpen) {
      reset({ name: defaultName ?? '' })
    }
  }, [defaultName, dialogOpen, reset])

  const inputId = role === 'add' ? 'collection-name' : 'edit-collection-name'

  const onSubmit: SubmitHandler<NameFormType> = async (data) => {
    try {
      if (role === 'add') {
        await addOrEditCollectionMutation.mutateAsync({
          name: data.name,
          role: 'add',
        })
      } else {
        if (!id) {
          toast.error('Missing folder id')
          return
        }

        await addOrEditCollectionMutation.mutateAsync({
          name: data.name,
          role: 'edit',
          id,
        })
      }

      toast.success(
        role === 'add'
          ? 'Folder created successfully'
          : 'Folder updated successfully',
      )

      reset()
      setDialogOpen(false)
    } catch {
      toast.error(
        role === 'add' ? 'Failed to create folder' : 'Failed to update folder',
      )
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <div
            className={cn(
              'group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-60',
              className,
            )}
          >
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">
                create_new_folder
              </span>
            </div>
            <div className="text-center">
              <p className="text-slate-900 dark:text-white text-lg font-bold">
                Create New Folder
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Add a new collection
              </p>
            </div>
          </div>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {role === 'add' ? 'Create a New Collection' : 'Edit Collection'}
          </DialogTitle>
          <DialogDescription>
            {role === 'add'
              ? 'Fill in the details below to create a new collection.'
              : 'Update the collection name below.'}
          </DialogDescription>
        </DialogHeader>
        <form
          className="py-4 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CollectionForm
            inputId={inputId}
            role={role}
            register={register}
            error={errors.name}
            isSubmitting={isSubmitting}
          />
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  )
}

type DeleteCollectionDialogProps = {
  open: boolean
  hasSelection: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}

export function DeleteCollectionDialog({
  open,
  hasSelection,
  onOpenChange,
  onConfirm,
}: DeleteCollectionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete collection</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete this collection? This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (!hasSelection) return
              await onConfirm()
            }}
            className="cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
