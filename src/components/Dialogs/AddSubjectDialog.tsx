import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FormProvider } from 'react-hook-form'
import { Loader2Icon, PlusCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { useAddSubject } from '#/hooks/subjects/hooks'
import InputWrapper from '#/components/admin/Wrappers/InputWrapper'

type AddSubjectDialogProps = {
  onCreated?: (subjectId: string) => void
  defaultGradeIds?: string[]
  lockGradeSelection?: boolean
  triggerClassName?: string
  triggerTitle?: string
  schoolId: string
}

export function AddSubjectDialog({
  onCreated,
  defaultGradeIds = [],
  lockGradeSelection = false,
  triggerClassName,
  triggerTitle = 'Add subject',
  schoolId,
}: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false)

  const { form, onSubmit, isPending } = useAddSubject(schoolId, (subjectId) => {
    onCreated?.(subjectId)
    setOpen(false)
  })

  const { data: grades, status: fetchStatus } = useQuery({
    ...getAllGradesQueryOptions(schoolId),
  })

  useEffect(() => {
    if (!open) return

    if (defaultGradeIds.length > 0) {
      form.setValue('gradeIds', defaultGradeIds, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [open, defaultGradeIds, form])

  if (fetchStatus === 'error') {
    return (
      <Button
        disabled
        type="button"
        size="icon"
        variant="default"
        className={triggerClassName ?? 'size-11 border-0'}
        title="Cannot add subject"
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
        size="icon"
        variant="default"
        className={triggerClassName ?? 'size-11 border-0'}
        title="Loading grades..."
      >
        <Loader2Icon className="size-4 animate-spin" />
      </Button>
    )
  }

  const gradeOptions = grades.map((g) => ({
    label: g.name,
    value: g.id,
  }))

  const selectedGradeIds = form.watch('gradeIds') ?? []

  function toggleGrade(value: string) {
    const current = selectedGradeIds

    if (current.includes(value)) {
      form.setValue(
        'gradeIds',
        current.filter((id) => id !== value),
        { shouldValidate: true, shouldDirty: true },
      )
    } else {
      form.setValue('gradeIds', [...current, value], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const selectedGradeLabels = gradeOptions
    .filter((grade) => selectedGradeIds.includes(grade.value))
    .map((grade) => grade.label)

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
          size="icon"
          variant="default"
          className={triggerClassName ?? 'size-11 border-0'}
          title={triggerTitle}
        >
          <PlusCircleIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add subject</DialogTitle>
          <DialogDescription>
            Create a subject and attach it to one or more grades.
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
              label="Subject name"
              placeholder="Mathematics 1"
            />

            <InputWrapper
              form={form}
              name="code"
              label="Subject code"
              placeholder="MATH1"
            />

            {lockGradeSelection && defaultGradeIds.length > 0 ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
                  Grades
                </label>

                <div className="flex flex-wrap gap-2 rounded-lg bg-[#f0f2f4] p-3 dark:bg-gray-800">
                  {selectedGradeLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:bg-[#151a25] dark:text-slate-300"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">
                  Grades
                </label>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#f0f2f4] p-3 dark:bg-gray-800">
                  {gradeOptions.map((grade) => {
                    const checked = selectedGradeIds.includes(grade.value)

                    return (
                      <label
                        key={grade.value}
                        className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm dark:bg-[#151a25]"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleGrade(grade.value)}
                        />
                        <span>{grade.label}</span>
                      </label>
                    )
                  })}
                </div>

                {form.formState.errors.gradeIds ? (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.gradeIds.message as string}
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
                {isPending ? 'Saving...' : 'Save subject'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
