import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2Icon, PlusCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import InputWrapper from '#/components/owner/Wrappers/InputWrapper'
import { addGradeSchema, type AddGradeSchema } from '#/schemas/grades.schema'
import { addGradeServerFn } from '#/server/modules/grades/grades.server-functions'
import { StatusEnum } from '#/server/db/schema'

type AddGradeDialogProps = {
  onCreated?: (gradeId: string) => void
  triggerClassName?: string
  triggerTitle?: string
  schoolId: string
}

export function AddGradeDialog({
  onCreated,
  triggerClassName,
  triggerTitle = 'Add grade',
  schoolId,
}: AddGradeDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddGradeSchema>({
    defaultValues: {
      schoolId,
      name: '',
      levelOrder: 1,
      status: StatusEnum.NEW,
    },
    resolver: standardSchemaResolver(addGradeSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: AddGradeSchema) => {
      const response = await addGradeServerFn({ data })

      if (response.success) return response.data
      throw new Error('Failed to add grade')
    },
    onSuccess: async (grade) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['grades'] }),
        queryClient.invalidateQueries({
          queryKey: ['grades-with-classes-and-subjects'],
        }),
      ])

      toast.success('Grade added successfully')

      form.reset({
        schoolId,
        name: '',
        levelOrder: 1,
        status: StatusEnum.NEW,
      })

      setOpen(false)
      onCreated?.(grade.id)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add grade',
      )
    },
  })

  function onSubmit(data: AddGradeSchema) {
    mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          form.reset({
            schoolId,
            name: '',
            levelOrder: 1,
            status: StatusEnum.NEW,
          })
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="default"
          className={triggerClassName ?? ''}
          title={triggerTitle}
        >
          {isPending ? (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          ) : (
            <PlusCircleIcon className="mr-2 size-4" />
          )}
          Add grade
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add grade</DialogTitle>
          <DialogDescription>
            Create a new grade level for your school.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <InputWrapper
              form={form}
              name="name"
              label="Grade name"
              placeholder="1AM"
            />

            <InputWrapper
              form={form}
              name="levelOrder"
              label="Level order"
              placeholder="1"
              type="number"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
                Status
              </label>

              <select
                value={form.watch('status')}
                onChange={(e) =>
                  form.setValue(
                    'status',
                    e.target.value as AddGradeSchema['status'],
                    {
                      shouldValidate: true,
                      shouldDirty: true,
                    },
                  )
                }
                className="h-11 rounded-lg border border-[#d9dde3] bg-white px-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#151a25] dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="New">New</option>
              </select>

              {form.formState.errors.status ? (
                <p className="text-sm text-red-500">
                  {form.formState.errors.status.message as string}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save grade'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
