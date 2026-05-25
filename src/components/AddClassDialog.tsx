import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FormProvider } from 'react-hook-form'
import { Loader2Icon, PlusCircleIcon } from 'lucide-react'

import {
  Button,
  type ButtonSizes,
  type ButtonVariants,
} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { useAddClass } from '#/hooks/classes/hooks'
// import { getAllClassesQueryOptions } from '#/server/modules/classes/classes.controller'
// import SelectWrapper from './admin/Wrappers/SelectWrapper'
import InputWrapper from './admin/Wrappers/InputWrapper'

type AddClassDialogProps = {
  schoolId: string
  onCreated?: (classId: string) => void
  defaultGradeId?: string
  lockGradeSelection?: boolean
  triggerClassName?: string
  triggerTitle?: string
  buttonSize?: ButtonSizes
  buttonVariant?: ButtonVariants
}

export function AddClassDialog({
  schoolId,
  onCreated,
  defaultGradeId,
  lockGradeSelection = false,
  triggerClassName,
  triggerTitle = 'Add class',
  buttonSize = 'icon',
  buttonVariant = 'default',
}: AddClassDialogProps) {
  const [open, setOpen] = useState(false)

  const { form, onSubmit, isPending } = useAddClass(schoolId, (classId) => {
    onCreated?.(classId)
    setOpen(false)
  })

  const { data: grades, status: fetchStatus } = useQuery({
    ...getAllGradesQueryOptions(),
  })

  // const { data: classes } = useQuery(getAllClassesQueryOptions(schoolId)) 
  // this line with the select wrapper are used to map all the existing classes

  useEffect(() => {
    if (!open) return

    if (defaultGradeId) {
      form.setValue('gradeId', defaultGradeId, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [open, defaultGradeId, form])

  if (fetchStatus === 'error') {
    return (
      <Button
        disabled
        type="button"
        size={buttonSize}
        variant={buttonVariant}
        className={triggerClassName ?? 'size-11 border-0'}
        title="Cannot add class"
      >
        <PlusCircleIcon className="size-4" />
      </Button>
    )
  }

  if (fetchStatus === 'pending') {
    return (
      <Button
        disabled
        type="button"
        size={buttonSize}
        variant={buttonVariant}
        className={triggerClassName ?? 'size-11 border-0'}
        title="Loading grades..."
      >
        <Loader2Icon className="size-4 animate-spin" />
      </Button>
    )
  }

  const selectedGrade = grades.find((g) => g.id === form.watch('gradeId'))

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          size={buttonSize}
          variant={buttonVariant}
          className={triggerClassName ?? 'size-11 border-0'}
          title={triggerTitle}
        >
          <PlusCircleIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add class</DialogTitle>
          <DialogDescription>
            Create a new class and assign it to a grade.
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
              label="Class name"
              placeholder="A"
            />
            {/* <SelectWrapper
              form={form}
              name="name"
              label="Class name"
              values={
                classes?.map((c) => ({ label: c.name, value: c.name })) ?? []
              }
            /> */}

            {lockGradeSelection && defaultGradeId ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
                  Grade
                </label>

                <div className="rounded-lg bg-[#f0f2f4] px-3 py-2 text-sm text-[#111318] dark:bg-gray-800 dark:text-gray-200">
                  {selectedGrade?.name ?? 'Selected grade'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
                  Grade
                </label>

                <select
                  value={form.watch('gradeId') ?? ''}
                  onChange={(e) =>
                    form.setValue('gradeId', e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className="h-11 rounded-lg border border-[#d9dde3] bg-white px-3 text-sm outline-none focus:border-primary dark:border-gray-700 dark:bg-[#151a25] dark:text-gray-100"
                >
                  <option value="">Select a grade</option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>

                {form.formState.errors.gradeId ? (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.gradeId.message as string}
                  </p>
                ) : null}
              </div>
            )}

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
                {isPending ? 'Saving...' : 'Save class'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
